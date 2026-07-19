import { useCallback, useEffect, useRef, useState } from 'react';
import { getDashboardSummary } from '../services/dashboardService';

export const emptyDashboardSummary = Object.freeze({
  totalMedicines: 0,
  lowStockMedicines: 0,
  expiringSoonMedicines: 0,
  outOfStockMedicines: 0,
  totalSuppliers: 0,
  totalCustomers: 0,
});

export default function useDashboard() {
  const [summary, setSummary] = useState(emptyDashboardSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const mountedRef = useRef(true);

  const fetchDashboardSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardSummary();
      if (mountedRef.current) {
        setSummary({ ...emptyDashboardSummary, ...data });
        setLastUpdated(data.generatedAt || new Date().toISOString());
      }
    } catch (requestError) {
      if (mountedRef.current) setError(requestError);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchDashboardSummary();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchDashboardSummary]);

  return { summary, isLoading, error, lastUpdated, fetchDashboardSummary, retry: fetchDashboardSummary };
}
