import { Ban, LoaderCircle, Printer } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import PurchaseInvoice from './PurchaseInvoice';

export default function PurchaseDetailsModal({ purchase, isOpen, isLoading, onClose, onCancel }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Details" description="Complete invoice, medicine and payment information." size="lg">
      {isLoading ? <div className="flex min-h-72 items-center justify-center text-sm font-semibold text-slate-500"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Loading purchase...</div> : <PurchaseInvoice purchase={purchase} />}
      {!isLoading && purchase && <div className="no-print sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 p-5 backdrop-blur sm:flex-row sm:justify-end"><Button variant="secondary" onClick={onClose}>Close</Button><Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print Invoice</Button><Button variant="danger" onClick={() => onCancel(purchase)} disabled={purchase.purchaseStatus === 'cancelled'}><Ban className="h-4 w-4" /> Cancel Purchase</Button></div>}
    </Modal>
  );
}
