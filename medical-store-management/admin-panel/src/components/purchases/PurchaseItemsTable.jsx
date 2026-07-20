import { Plus } from 'lucide-react';
import Button from '../ui/Button';
import PurchaseItemRow from './PurchaseItemRow';

export default function PurchaseItemsTable({ items, medicines, itemErrors, onUpdate, onSelect, onRemove, onAdd }) {
  const selectedMedicineIds = new Set(items.map((item) => Number(item.medicineId)).filter(Boolean));
  return (
    <section className="space-y-4 rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-bold text-slate-950">Purchase Items</h2><p className="text-sm text-slate-500">Add each medicine received on this invoice.</p></div>
        <Button variant="secondary" size="sm" onClick={onAdd}><Plus className="h-4 w-4" /> Add Medicine</Button>
      </div>
      {items.map((item) => <PurchaseItemRow key={item.rowId} item={item} medicines={medicines} selectedMedicineIds={selectedMedicineIds} errors={itemErrors[item.rowId]} onUpdate={onUpdate} onSelect={onSelect} onRemove={onRemove} canRemove={items.length > 1} />)}
    </section>
  );
}
