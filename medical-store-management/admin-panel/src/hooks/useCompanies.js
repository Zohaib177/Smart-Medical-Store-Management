import { useCallback, useEffect, useRef, useState } from 'react';
import * as api from '../services/companyService';
import { getCompanyErrorMessage } from '../utils/companyHelpers';

const defaultPagination = { page: 1, limit: 10, totalRecords: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
const defaultFilters = { search: '', status: '', sortBy: 'created_at', sortDirection: 'desc', page: 1, limit: 10 };
const closed = { create: false, edit: false, details: false, delete: false, status: false };

export default function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [filters, setFilters] = useState(defaultFilters);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modals, setModals] = useState(closed);
  const [mutation, setMutation] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const mounted = useRef(true);
  const requestId = useRef(0);

  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(filters.search.trim()), 400); return () => clearTimeout(timer); }, [filters.search]);
  const fetchCompanies = useCallback(async ({ refreshing = false } = {}) => {
    const id = ++requestId.current;
    refreshing ? setIsRefreshing(true) : setIsLoading(true);
    setError(null);
    try {
      const response = await api.getCompanies({ page: filters.page, limit: filters.limit, search: debouncedSearch || undefined, status: filters.status || undefined, sortBy: filters.sortBy, sortDirection: filters.sortDirection });
      if (mounted.current && id === requestId.current) { setCompanies(response.data || []); setPagination({ ...defaultPagination, ...response.pagination }); }
    } catch (requestError) {
      if (mounted.current && id === requestId.current) { setError(requestError); setToast({ type: 'error', message: 'Unable to load companies.' }); }
    } finally {
      if (mounted.current && id === requestId.current) { setIsLoading(false); setIsRefreshing(false); }
    }
  }, [debouncedSearch, filters.limit, filters.page, filters.sortBy, filters.sortDirection, filters.status]);
  useEffect(() => { mounted.current = true; fetchCompanies(); return () => { mounted.current = false; }; }, [fetchCompanies]);

  const refreshCompanies = useCallback(() => fetchCompanies({ refreshing: true }), [fetchCompanies]);
  const setSearch = useCallback((search) => setFilters((value) => ({ ...value, search, page: 1 })), []);
  const setStatus = useCallback((status) => setFilters((value) => ({ ...value, status, page: 1 })), []);
  const setSort = useCallback((sort) => { const [sortBy, sortDirection] = sort.split(':'); setFilters((value) => ({ ...value, sortBy, sortDirection, page: 1 })); }, []);
  const setPage = useCallback((page) => setFilters((value) => ({ ...value, page })), []);
  const clearFilters = useCallback(() => { setFilters(defaultFilters); setDebouncedSearch(''); }, []);
  const closeModals = useCallback(() => { setModals(closed); setSelectedCompany(null); setIsDetailsLoading(false); }, []);
  const openCreateModal = useCallback(() => { setSelectedCompany(null); setModals({ ...closed, create: true }); }, []);
  const openEditModal = useCallback((company) => { setSelectedCompany(company); setModals({ ...closed, edit: true }); }, []);
  const openDeleteModal = useCallback((company) => { setSelectedCompany(company); setModals({ ...closed, delete: true }); }, []);
  const openStatusModal = useCallback((company) => { setSelectedCompany({ ...company, nextStatus: company.status === 'active' ? 'inactive' : 'active' }); setModals({ ...closed, status: true }); }, []);
  const openDetailsModal = useCallback(async (company) => {
    setSelectedCompany(company); setModals({ ...closed, details: true }); setIsDetailsLoading(true);
    try { const details = await api.getCompanyById(company.id); if (mounted.current) setSelectedCompany(details); }
    catch (requestError) { if (mounted.current) setToast({ type: 'error', message: getCompanyErrorMessage(requestError, 'Unable to load company details.') }); }
    finally { if (mounted.current) setIsDetailsLoading(false); }
  }, []);

  const mutate = useCallback(async (kind, request, successFallback, shouldThrow = false) => {
    setMutation(kind);
    try {
      const response = await request();
      if (mounted.current) { setToast({ type: 'success', message: response.message || successFallback }); closeModals(); await fetchCompanies({ refreshing: true }); }
      return response;
    } catch (requestError) {
      if (mounted.current) setToast({ type: 'error', message: getCompanyErrorMessage(requestError) });
      if (shouldThrow) throw requestError;
      return null;
    } finally { if (mounted.current) setMutation(null); }
  }, [closeModals, fetchCompanies]);

  const createCompany = useCallback((data) => mutate('create', () => api.createCompany(data), 'Company created successfully', true), [mutate]);
  const updateCompany = useCallback((data) => mutate('update', () => api.updateCompany(selectedCompany.id, data), 'Company updated successfully', true), [mutate, selectedCompany]);
  const updateStatus = useCallback(() => mutate('status', () => api.updateCompanyStatus(selectedCompany.id, selectedCompany.nextStatus), 'Company status updated successfully'), [mutate, selectedCompany]);
  const deleteCompany = useCallback(async () => {
    const currentPage = filters.page;
    const lastOnPage = companies.length === 1 && currentPage > 1;
    const response = await mutate('delete', () => api.deleteCompany(selectedCompany.id), 'Company deleted successfully');
    if (response && lastOnPage && mounted.current) setFilters((value) => ({ ...value, page: value.page - 1 }));
  }, [companies.length, filters.page, mutate, selectedCompany]);
  const clearToast = useCallback(() => setToast(null), []);

  return { companies, pagination, filters, isLoading, isRefreshing, error, selectedCompany, modals, mutation, isDetailsLoading, toast, refreshCompanies, setSearch, setStatus, setSort, setPage, clearFilters, openCreateModal, openEditModal, openDetailsModal, openDeleteModal, openStatusModal, closeModals, createCompany, updateCompany, updateStatus, deleteCompany, clearToast };
}
