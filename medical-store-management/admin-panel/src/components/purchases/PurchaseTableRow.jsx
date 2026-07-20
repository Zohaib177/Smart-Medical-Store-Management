import { Ban, Eye } from 'lucide-react';
import IconButton from '../ui/IconButton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import PaymentStatusBadge from './PaymentStatusBadge';
import PurchaseStatusBadge from './PurchaseStatusBadge';

export default function PurchaseTableRow({ purchase, onView, onCancel }) {
  return (
    <tr className="border-t border-slate-100 text-sm transition hover:bg-slate-50/70">
      <td className="px-4 py-4"><p className="font-bold text-slate-900">{purchase.purchaseNumber}</p><p className="mt-1 text-xs text-slate-500">Invoice: {purchase.invoiceNumber}</p></td>
      <td className="px-4 py-4"><p className="font-semibold text-slate-800">{purchase.supplier?.supplierName}</p><p className="mt-1 text-xs text-slate-500">{purchase.supplier?.phone || 'No phone'}</p></td>
      <td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(purchase.purchaseDate)}</td>
      <td className="px-4 py-4 text-center"><span className="font-bold text-slate-800">{purchase.itemCount}</span><span className="ml-1 text-xs text-slate-500">({purchase.totalQuantity} units)</span></td>
      <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-900">{formatCurrency(purchase.totalAmount)}</td>
      <td className="whitespace-nowrap px-4 py-4 text-slate-700">{formatCurrency(purchase.dueAmount)}</td>
      <td className="px-4 py-4"><PaymentStatusBadge status={purchase.paymentStatus} /></td>
      <td className="px-4 py-4"><PurchaseStatusBadge status={purchase.purchaseStatus} /></td>
      <td className="px-4 py-4"><div className="flex justify-end gap-1"><IconButton label="View purchase" onClick={() => onView(purchase)}><Eye className="h-4 w-4" /></IconButton><IconButton label="Cancel purchase" onClick={() => onCancel(purchase)} disabled={purchase.purchaseStatus === 'cancelled'} className="hover:bg-red-50 hover:text-red-600"><Ban className="h-4 w-4" /></IconButton></div></td>
    </tr>
  );
}
