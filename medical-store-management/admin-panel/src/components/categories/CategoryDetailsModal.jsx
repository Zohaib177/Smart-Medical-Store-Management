import { CalendarDays, Package, Tags } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import LoadingCard from '../ui/LoadingCard';
import Modal from '../ui/Modal';
import CategoryStatusBadge from './CategoryStatusBadge';

export default function CategoryDetailsModal({ category, isOpen, onClose, isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details" description="Complete information for this medicine category.">
      <div className="px-5 py-5 sm:px-6">
        {isLoading ? <LoadingCard /> : category && (
          <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Tags className="h-5 w-5" /></span>
              <div className="min-w-0"><h3 className="break-words font-bold text-slate-900">{category.categoryName}</h3><div className="mt-2"><CategoryStatusBadge status={category.status} /></div></div>
            </div>
            <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{category.description || 'No description provided.'}</p></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4"><Package className="h-5 w-5 text-emerald-600" /><p className="mt-2 text-2xl font-bold text-slate-900">{category.medicineCount}</p><p className="text-xs text-slate-500">Linked medicines</p></div>
              <div className="rounded-xl border border-slate-200 p-4"><CalendarDays className="h-5 w-5 text-blue-600" /><p className="mt-2 text-xs font-semibold text-slate-500">Created</p><p className="mt-1 text-sm text-slate-700">{formatDateTime(category.createdAt)}</p></div>
            </div>
            <div className="border-t border-slate-100 pt-4 text-xs text-slate-500">Last updated: <span className="font-medium text-slate-700">{formatDateTime(category.updatedAt)}</span></div>
          </div>
        )}
      </div>
    </Modal>
  );
}
