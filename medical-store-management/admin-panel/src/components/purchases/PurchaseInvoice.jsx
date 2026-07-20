import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import PaymentStatusBadge from './PaymentStatusBadge';
import PurchaseStatusBadge from './PurchaseStatusBadge';

export default function PurchaseInvoice({ purchase }) {
  if (!purchase) return null;
  return (
    <article className="purchase-invoice space-y-6 bg-white p-5 sm:p-6">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Medical Store</p><h3 className="mt-2 text-2xl font-bold text-slate-950">Purchase Invoice</h3><p className="mt-1 text-sm text-slate-500">{purchase.purchaseNumber}</p></div>
        <div className="sm:text-right"><div className="flex gap-2 sm:justify-end"><PaymentStatusBadge status={purchase.paymentStatus} /><PurchaseStatusBadge status={purchase.purchaseStatus} /></div><p className="mt-3 text-sm text-slate-500">Created {formatDateTime(purchase.createdAt)}</p></div>
      </header>
      <div className="grid gap-5 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
        <Info label="Supplier" value={purchase.supplier?.supplierName} extra={purchase.supplier?.phone} />
        <Info label="Supplier invoice" value={purchase.invoiceNumber} />
        <Info label="Purchase date" value={formatDate(purchase.purchaseDate)} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Medicine</th><th className="px-4 py-3">Batch / Expiry</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Unit Price</th><th className="px-4 py-3 text-right">Subtotal</th></tr></thead><tbody>{purchase.items?.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-4 py-3"><p className="font-semibold text-slate-900">{item.medicine?.medicineName}</p><p className="text-xs text-slate-500">{item.medicine?.genericName || item.medicine?.barcode || '-'}</p></td><td className="px-4 py-3 text-slate-600"><p>{item.batchNumber || '-'}</p><p className="text-xs">{formatDate(item.expiryDate)}</p></td><td className="px-4 py-3 text-right font-semibold">{item.quantity}</td><td className="px-4 py-3 text-right">{formatCurrency(item.unitPurchasePrice)}</td><td className="px-4 py-3 text-right font-bold">{formatCurrency(item.subtotal)}</td></tr>)}</tbody></table></div>
      <div className="grid gap-5 md:grid-cols-[1fr_300px]"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Notes</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{purchase.notes || 'No notes added.'}</p>{purchase.purchaseStatus === 'cancelled' && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><strong>Cancellation reason:</strong> {purchase.cancellationReason}<p className="mt-1 text-xs">Cancelled {formatDateTime(purchase.cancelledAt)}</p></div>}</div><dl className="space-y-2 rounded-2xl bg-slate-950 p-5 text-sm text-white"><Total label="Subtotal" value={purchase.subtotal} /><Total label="Discount" value={-purchase.discountAmount} /><Total label="Tax" value={purchase.taxAmount} /><Total label="Total" value={purchase.totalAmount} strong /><Total label="Paid" value={purchase.paidAmount} /><Total label="Due" value={purchase.dueAmount} strong /></dl></div>
      <footer className="border-t border-slate-200 pt-4 text-xs text-slate-500">Recorded by {purchase.createdBy?.fullName || 'Admin'}.</footer>
    </article>
  );
}

function Info({ label, value, extra }) { return <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-900">{value || '-'}</p>{extra && <p className="mt-1 text-xs text-slate-500">{extra}</p>}</div>; }
function Total({ label, value, strong }) { return <div className={`flex justify-between gap-4 ${strong ? 'border-t border-white/20 pt-2 text-base font-bold' : 'text-slate-300'}`}><dt>{label}</dt><dd>{formatCurrency(value)}</dd></div>; }
