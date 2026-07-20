import { ShoppingCart } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import LoadingCard from '../ui/LoadingCard';
import PurchaseTableRow from './PurchaseTableRow';

export default function PurchaseTable({ purchases, isLoading, hasFilters, onView, onCancel }) {
  if (isLoading) return <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <LoadingCard key={index} />)}</div>;
  if (!purchases.length) return <div className="p-5"><EmptyState icon={ShoppingCart} title={hasFilters ? 'No matching purchases' : 'No purchases yet'} description={hasFilters ? 'Try changing or clearing the filters.' : 'Create the first supplier purchase to receive medicine stock.'} /></div>;
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[1240px] text-left">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500"><tr>{['Purchase', 'Supplier', 'Date', 'Items', 'Total', 'Due', 'Payment', 'Status', 'Actions'].map((heading) => <th key={heading} className={`px-4 py-3 ${heading === 'Items' ? 'text-center' : ''} ${heading === 'Actions' ? 'text-right' : ''}`}>{heading}</th>)}</tr></thead>
        <tbody>{purchases.map((purchase) => <PurchaseTableRow key={purchase.id} purchase={purchase} onView={onView} onCancel={onCancel} />)}</tbody>
      </table>
    </div>
  );
}
