import { Trash2 } from 'lucide-react';
import IconButton from '../ui/IconButton';
import { calculateItemSubtotal } from '../../utils/purchaseHelpers';
import { formatCurrency } from '../../utils/formatters';

const inputClass = 'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

export default function PurchaseItemRow({ item, medicines, selectedMedicineIds, errors, onUpdate, onSelect, onRemove, canRemove }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 lg:grid-cols-[2fr_1fr_1fr_.7fr_1fr_1fr_auto]">
      <Field label="Medicine" error={errors?.medicineId}><select value={item.medicineId} onChange={(event) => onSelect(item.rowId, event.target.value)} className={inputClass}><option value="">Select medicine</option>{medicines.map((medicine) => <option key={medicine.id} value={medicine.id} disabled={selectedMedicineIds.has(Number(medicine.id)) && Number(item.medicineId) !== Number(medicine.id)}>{medicine.medicineName} - Stock {medicine.currentStock}</option>)}</select></Field>
      <Field label="Batch" error={errors?.batchNumber}><input value={item.batchNumber} maxLength={100} onChange={(event) => onUpdate(item.rowId, 'batchNumber', event.target.value)} className={inputClass} /></Field>
      <Field label="Expiry" error={errors?.expiryDate}><input type="date" value={item.expiryDate} onChange={(event) => onUpdate(item.rowId, 'expiryDate', event.target.value)} className={inputClass} /></Field>
      <Field label="Quantity" error={errors?.quantity}><input type="number" min="1" step="1" value={item.quantity} onChange={(event) => onUpdate(item.rowId, 'quantity', event.target.value)} className={inputClass} /></Field>
      <Field label="Unit Price" error={errors?.unitPurchasePrice}><input type="number" min="0" step="0.01" value={item.unitPurchasePrice} onChange={(event) => onUpdate(item.rowId, 'unitPurchasePrice', event.target.value)} className={inputClass} /></Field>
      <div><p className="text-xs font-bold text-slate-600">Subtotal</p><p className="mt-3 text-sm font-bold text-slate-900">{formatCurrency(calculateItemSubtotal(item))}</p></div>
      <div className="flex items-end"><IconButton label="Remove medicine" onClick={() => onRemove(item.rowId)} disabled={!canRemove} className="hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></IconButton></div>
    </div>
  );
}

function Field({ label, error, children }) {
  return <label className="block text-xs font-bold text-slate-600">{label}<div className="mt-1.5">{children}</div>{error && <span className="mt-1 block text-[11px] text-red-600">{error}</span>}</label>;
}
