import { Plus, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import ErrorState from '../components/ui/ErrorState';
import Pagination from '../components/ui/Pagination';
import Toast from '../components/ui/Toast';
import PurchaseSummaryCards from '../components/purchases/PurchaseSummaryCards';
import PurchaseFilters from '../components/purchases/PurchaseFilters';
import PurchaseTable from '../components/purchases/PurchaseTable';
import PurchaseDetailsModal from '../components/purchases/PurchaseDetailsModal';
import PurchaseCancelDialog from '../components/purchases/PurchaseCancelDialog';
import usePurchases from '../hooks/usePurchases';
import { formatNumber } from '../utils/formatters';

export default function PurchasesPage() {
  const purchases = usePurchases();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.state?.message) {
      purchases.setToast({ type: 'success', message: location.state.message });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate, purchases.setToast]);
  const hasFilters = Boolean(purchases.filters.search || purchases.filters.supplierId || purchases.filters.paymentStatus || purchases.filters.purchaseStatus || purchases.filters.dateFrom || purchases.filters.dateTo);
  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Management" description="Record supplier invoices, receive medicine stock and maintain an auditable purchase history." actions={<Button onClick={() => navigate('/admin/purchases/new')}><Plus className="h-4 w-4" /> New Purchase</Button>} />
      <PurchaseSummaryCards summary={purchases.summary} loading={purchases.isLoadingSummary} />
      {purchases.errors.summary && !purchases.isLoadingSummary && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">Unable to load purchase summary. <button type="button" className="ml-2 underline" onClick={purchases.fetchSummary}>Retry</button></div>}
      <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.04)]">
        <PurchaseFilters filters={purchases.filters} suppliers={purchases.options.suppliers || []} h={purchases} />
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"><p className="text-sm text-slate-500"><strong className="text-slate-800">{formatNumber(purchases.pagination.totalRecords)}</strong> {purchases.pagination.totalRecords === 1 ? 'purchase' : 'purchases'}</p><Button variant="secondary" size="sm" onClick={purchases.refreshPurchases} disabled={purchases.isRefreshing || purchases.isLoading}><RefreshCw className={`h-4 w-4 ${purchases.isRefreshing ? 'animate-spin' : ''}`} />{purchases.isRefreshing ? 'Refreshing...' : 'Refresh'}</Button></div>
        {purchases.errors.list && !purchases.purchases.length && !purchases.isLoading ? <div className="p-5"><ErrorState title="Unable to load purchases" description="Check your connection and try again." onRetry={purchases.refreshPurchases} /></div> : <PurchaseTable purchases={purchases.purchases} isLoading={purchases.isLoading} hasFilters={hasFilters} onView={purchases.openDetails} onCancel={purchases.openCancelDialog} />}
        <Pagination pagination={purchases.pagination} onPageChange={purchases.setPage} />
      </section>
      <PurchaseDetailsModal purchase={purchases.selectedPurchase} isOpen={purchases.modals.details} isLoading={purchases.isLoadingDetails} onClose={purchases.closeDetails} onCancel={purchases.openCancelDialog} />
      <PurchaseCancelDialog purchase={purchases.selectedPurchase} isOpen={purchases.modals.cancel} isCancelling={purchases.isCancelling} onClose={purchases.closeCancelDialog} onConfirm={purchases.cancelPurchase} />
      <Toast toast={purchases.toast} onClose={() => purchases.setToast(null)} />
    </div>
  );
}
