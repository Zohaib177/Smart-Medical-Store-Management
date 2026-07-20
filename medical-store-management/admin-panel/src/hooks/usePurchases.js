import { useCallback, useEffect, useRef, useState } from 'react';
import * as api from '../services/purchaseService';
import { getPurchaseErrorMessage } from '../utils/purchaseHelpers';

const defaultPagination = { page: 1, limit: 10, totalRecords: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
const defaultFilters = { search: '', supplierId: '', paymentStatus: '', purchaseStatus: '', dateFrom: '', dateTo: '', sortBy: 'created_at', sortDirection: 'desc', page: 1, limit: 10 };

export default function usePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(defaultPagination);
  const [filters, setFilters] = useState(defaultFilters);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [options, setOptions] = useState({ suppliers: [] });
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [errors, setErrors] = useState({ list: null, summary: null });
  const [modals, setModals] = useState({ details: false, cancel: false });
  const [toast, setToast] = useState(null);
  const mounted = useRef(true);

  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(filters.search.trim()), 400); return () => clearTimeout(timer); }, [filters.search]);
  const fetchPurchases = useCallback(async ({ refresh = false } = {}) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    try {
      const response = await api.getPurchases({ ...filters, search: debouncedSearch || undefined });
      if (mounted.current) { setPurchases(response.data || []); setPagination({ ...defaultPagination, ...response.pagination }); setErrors((value) => ({ ...value, list: null })); }
    } catch (error) { if (mounted.current) setErrors((value) => ({ ...value, list: error })); }
    finally { if (mounted.current) { setIsLoading(false); setIsRefreshing(false); } }
  }, [filters.dateFrom, filters.dateTo, filters.limit, filters.page, filters.paymentStatus, filters.purchaseStatus, filters.sortBy, filters.sortDirection, filters.supplierId, debouncedSearch]);
  const fetchSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    try { const data = await api.getPurchaseSummary(); if (mounted.current) { setSummary(data); setErrors((value) => ({ ...value, summary: null })); } }
    catch (error) { if (mounted.current) setErrors((value) => ({ ...value, summary: error })); }
    finally { if (mounted.current) setIsLoadingSummary(false); }
  }, []);
  useEffect(() => { mounted.current = true; fetchPurchases(); return () => { mounted.current = false; }; }, [fetchPurchases]);
  useEffect(() => { fetchSummary(); api.getPurchaseOptions().then((data) => { if (mounted.current) setOptions(data); }).catch(() => {}); }, [fetchSummary]);

  const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  const openDetails = async (purchase) => {
    setSelectedPurchase(purchase); setModals({ details: true, cancel: false }); setIsLoadingDetails(true);
    try { const data = await api.getPurchaseById(purchase.id); if (mounted.current) setSelectedPurchase(data); }
    catch (error) { setToast({ type: 'error', message: getPurchaseErrorMessage(error, 'Unable to load purchase details') }); }
    finally { if (mounted.current) setIsLoadingDetails(false); }
  };
  const closeModals = () => { if (!isCancelling) { setModals({ details: false, cancel: false }); setSelectedPurchase(null); } };
  const openCancelDialog = (purchase) => { setSelectedPurchase(purchase); setModals({ details: false, cancel: true }); };
  const cancelPurchase = async (reason) => {
    setIsCancelling(true);
    try {
      const response = await api.cancelPurchase(selectedPurchase.id, { reason });
      if (mounted.current) { setModals({ details: false, cancel: false }); setSelectedPurchase(null); setToast({ type: 'success', message: response.message }); await Promise.all([fetchPurchases({ refresh: true }), fetchSummary()]); }
      return response;
    } catch (error) { if (mounted.current) setToast({ type: 'error', message: getPurchaseErrorMessage(error, 'Unable to cancel purchase') }); throw error; }
    finally { if (mounted.current) setIsCancelling(false); }
  };
  const refreshPurchases = async () => { await Promise.all([fetchPurchases({ refresh: true }), fetchSummary()]); setToast({ type: 'success', message: 'Purchases refreshed successfully' }); };

  return { purchases, summary, pagination, filters, options, selectedPurchase, isLoading, isLoadingSummary, isRefreshing, isLoadingDetails, isCancelling, errors, modals, toast, setToast, fetchSummary, refreshPurchases, setSearch: (value) => changeFilter('search', value), setSupplier: (value) => changeFilter('supplierId', value), setPaymentStatus: (value) => changeFilter('paymentStatus', value), setPurchaseStatus: (value) => changeFilter('purchaseStatus', value), setDateRange: changeFilter, setSort: (value) => { const [sortBy, sortDirection] = value.split(':'); setFilters((current) => ({ ...current, sortBy, sortDirection, page: 1 })); }, clearFilters: () => setFilters(defaultFilters), setPage: (page) => setFilters((current) => ({ ...current, page })), openDetails, closeDetails: closeModals, openCancelDialog, closeCancelDialog: closeModals, cancelPurchase };
}
