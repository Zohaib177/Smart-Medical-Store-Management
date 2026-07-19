import { useCallback, useEffect, useRef, useState } from 'react';
import * as categoryApi from '../services/categoryService';
import { getCategoryErrorMessage } from '../utils/categoryHelpers';

const defaultPagination = Object.freeze({
  page: 1,
  limit: 10,
  totalRecords: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
});

const defaultFilters = Object.freeze({
  search: '',
  status: '',
  sortBy: 'created_at',
  sortDirection: 'desc',
  page: 1,
  limit: 10,
});

const closedModals = Object.freeze({ create: false, edit: false, details: false, delete: false, status: false });

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [filters, setFilters] = useState(defaultFilters);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modals, setModals] = useState(closedModals);
  const [mutation, setMutation] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search.trim()), 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchCategories = useCallback(async ({ refreshing = false } = {}) => {
    const requestId = ++requestIdRef.current;
    if (refreshing) setIsRefreshing(true); else setIsLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getCategories({
        page: filters.page,
        limit: filters.limit,
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
      });
      if (mountedRef.current && requestId === requestIdRef.current) {
        setCategories(response.data || []);
        setPagination({ ...defaultPagination, ...response.pagination });
      }
    } catch (requestError) {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setError(requestError);
        setToast({ type: 'error', message: 'Unable to load categories.' });
      }
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [debouncedSearch, filters.limit, filters.page, filters.sortBy, filters.sortDirection, filters.status]);

  useEffect(() => {
    mountedRef.current = true;
    fetchCategories();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchCategories]);

  const refreshCategories = useCallback(() => fetchCategories({ refreshing: true }), [fetchCategories]);
  const setSearch = useCallback((search) => setFilters((current) => ({ ...current, search, page: 1 })), []);
  const setStatus = useCallback((status) => setFilters((current) => ({ ...current, status, page: 1 })), []);
  const setSort = useCallback((sortValue) => {
    const [sortBy, sortDirection] = sortValue.split(':');
    setFilters((current) => ({ ...current, sortBy, sortDirection, page: 1 }));
  }, []);
  const setPage = useCallback((page) => setFilters((current) => ({ ...current, page })), []);
  const clearFilters = useCallback(() => {
    setFilters((current) => ({ ...defaultFilters, limit: current.limit }));
    setDebouncedSearch('');
  }, []);

  const closeModals = useCallback(() => {
    setModals(closedModals);
    setSelectedCategory(null);
    setIsDetailsLoading(false);
  }, []);
  const openCreateModal = useCallback(() => {
    setSelectedCategory(null);
    setModals({ ...closedModals, create: true });
  }, []);
  const openEditModal = useCallback((category) => {
    setSelectedCategory(category);
    setModals({ ...closedModals, edit: true });
  }, []);
  const openDetailsModal = useCallback(async (category) => {
    setSelectedCategory(category);
    setModals({ ...closedModals, details: true });
    setIsDetailsLoading(true);
    try {
      const details = await categoryApi.getCategoryById(category.id);
      if (mountedRef.current) setSelectedCategory(details);
    } catch (requestError) {
      if (mountedRef.current) setToast({ type: 'error', message: getCategoryErrorMessage(requestError, 'Unable to load category details.') });
    } finally {
      if (mountedRef.current) setIsDetailsLoading(false);
    }
  }, []);
  const openDeleteModal = useCallback((category) => {
    setSelectedCategory(category);
    setModals({ ...closedModals, delete: true });
  }, []);
  const openStatusModal = useCallback((category) => {
    setSelectedCategory({ ...category, nextStatus: category.status === 'active' ? 'inactive' : 'active' });
    setModals({ ...closedModals, status: true });
  }, []);

  const createCategory = useCallback(async (data) => {
    setMutation('create');
    try {
      const response = await categoryApi.createCategory(data);
      if (mountedRef.current) {
        setToast({ type: 'success', message: response.message || 'Category created successfully' });
        closeModals();
        await fetchCategories({ refreshing: true });
      }
      return response;
    } catch (requestError) {
      if (mountedRef.current) setToast({ type: 'error', message: getCategoryErrorMessage(requestError) });
      throw requestError;
    } finally {
      if (mountedRef.current) setMutation(null);
    }
  }, [closeModals, fetchCategories]);

  const updateCategory = useCallback(async (data) => {
    setMutation('update');
    try {
      const response = await categoryApi.updateCategory(selectedCategory.id, data);
      if (mountedRef.current) {
        setToast({ type: 'success', message: response.message || 'Category updated successfully' });
        closeModals();
        await fetchCategories({ refreshing: true });
      }
      return response;
    } catch (requestError) {
      if (mountedRef.current) setToast({ type: 'error', message: getCategoryErrorMessage(requestError) });
      throw requestError;
    } finally {
      if (mountedRef.current) setMutation(null);
    }
  }, [closeModals, fetchCategories, selectedCategory]);

  const updateStatus = useCallback(async () => {
    setMutation('status');
    try {
      const response = await categoryApi.updateCategoryStatus(selectedCategory.id, selectedCategory.nextStatus);
      if (mountedRef.current) {
        setToast({ type: 'success', message: response.message || 'Category status updated successfully' });
        closeModals();
        await fetchCategories({ refreshing: true });
      }
    } catch (requestError) {
      if (mountedRef.current) setToast({ type: 'error', message: getCategoryErrorMessage(requestError) });
    } finally {
      if (mountedRef.current) setMutation(null);
    }
  }, [closeModals, fetchCategories, selectedCategory]);

  const deleteCategory = useCallback(async () => {
    setMutation('delete');
    try {
      const response = await categoryApi.deleteCategory(selectedCategory.id);
      if (mountedRef.current) {
        setToast({ type: 'success', message: response.message || 'Category deleted successfully' });
        closeModals();
        if (categories.length === 1 && filters.page > 1) {
          setFilters((current) => ({ ...current, page: current.page - 1 }));
        } else {
          await fetchCategories({ refreshing: true });
        }
      }
    } catch (requestError) {
      if (mountedRef.current) setToast({ type: 'error', message: getCategoryErrorMessage(requestError) });
    } finally {
      if (mountedRef.current) setMutation(null);
    }
  }, [categories.length, closeModals, fetchCategories, filters.page, selectedCategory]);

  const clearToast = useCallback(() => setToast(null), []);

  return {
    categories, pagination, filters, isLoading, isRefreshing, error, selectedCategory, modals,
    mutation, isDetailsLoading, toast, fetchCategories, refreshCategories, setSearch, setStatus,
    setSort, setPage, clearFilters, openCreateModal, openEditModal, openDetailsModal,
    openDeleteModal, openStatusModal, closeModals, createCategory, updateCategory,
    updateStatus, deleteCategory, clearToast,
  };
}
