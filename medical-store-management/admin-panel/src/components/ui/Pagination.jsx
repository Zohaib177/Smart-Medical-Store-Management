import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, hasNextPage, hasPreviousPage } = pagination;
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-xs text-slate-500">Page <span className="font-semibold text-slate-700">{page}</span> of <span className="font-semibold text-slate-700">{totalPages}</span></p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={!hasPreviousPage} onClick={() => onPageChange(page - 1)}><ChevronLeft className="h-4 w-4" /> Previous</Button>
        <Button variant="secondary" size="sm" disabled={!hasNextPage} onClick={() => onPageChange(page + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
