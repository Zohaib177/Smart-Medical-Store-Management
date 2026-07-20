import { useEffect, useState } from 'react';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function PurchaseCancelDialog({ purchase, isOpen, isCancelling, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { if (isOpen) { setReason(''); setError(''); } }, [isOpen]);
  const submit = async (event) => {
    event.preventDefault();
    if (reason.trim().length < 3) { setError('Enter a cancellation reason of at least 3 characters.'); return; }
    try { await onConfirm(reason.trim()); } catch { /* page toast displays the API error */ }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Purchase?" description="This action reverses received stock and writes inventory audit entries." size="sm">
      <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle className="h-5 w-5 shrink-0" /><p><strong>{purchase?.purchaseNumber}</strong> can only be cancelled if all purchased quantities are still available in stock. The record will remain for audit history.</p></div>
        <label className="block text-sm font-bold text-slate-700">Cancellation reason <span className="text-red-600">*</span><textarea autoFocus rows="4" maxLength="500" value={reason} onChange={(event) => { setReason(event.target.value); setError(''); }} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" placeholder="Why is this purchase being cancelled?" />{error && <span className="mt-1.5 block text-xs font-semibold text-red-600">{error}</span>}</label>
        <div className="flex justify-end gap-3"><Button variant="secondary" onClick={onClose} disabled={isCancelling}>Keep Purchase</Button><Button type="submit" variant="danger" disabled={isCancelling}>{isCancelling && <LoaderCircle className="h-4 w-4 animate-spin" />}{isCancelling ? 'Cancelling...' : 'Cancel Purchase'}</Button></div>
      </form>
    </Modal>
  );
}
