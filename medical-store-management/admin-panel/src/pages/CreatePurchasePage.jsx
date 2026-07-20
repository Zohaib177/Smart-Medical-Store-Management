import { ArrowLeft, LoaderCircle, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import PurchaseForm from '../components/purchases/PurchaseForm';
import usePurchaseForm from '../hooks/usePurchaseForm';

export default function CreatePurchasePage() {
  const navigate = useNavigate();
  const purchase = usePurchaseForm();
  const submit = async (event) => { event.preventDefault(); const response = await purchase.submitPurchase(); if (response) navigate('/admin/purchases', { replace: true, state: { message: response.message || 'Purchase created successfully' } }); };
  return (
    <form onSubmit={submit} className="space-y-6">
      <PageHeader title="Create Purchase" description="Receive medicines from an active supplier. Stock and inventory history update only after the complete transaction succeeds." actions={<Button variant="secondary" onClick={() => navigate('/admin/purchases')}><ArrowLeft className="h-4 w-4" /> Back to Purchases</Button>} />
      <PurchaseForm state={purchase} />
      <div className="sticky bottom-4 z-20 flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-end"><Button variant="secondary" onClick={() => navigate('/admin/purchases')} disabled={purchase.isSubmitting}>Cancel</Button><Button type="submit" disabled={purchase.isSubmitting || purchase.isLoadingOptions}>{purchase.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{purchase.isSubmitting ? 'Saving Purchase...' : 'Save Purchase'}</Button></div>
    </form>
  );
}
