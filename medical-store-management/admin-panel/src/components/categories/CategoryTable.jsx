import { Tags } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import LoadingCard from '../ui/LoadingCard';
import CategoryTableRow from './CategoryTableRow';

export default function CategoryTable({ categories, isLoading, hasFilters, actions }) {
  if (isLoading) {
    return <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <LoadingCard key={index} />)}</div>;
  }
  if (!categories.length) {
    return <div className="p-5"><EmptyState icon={Tags} title={hasFilters ? 'No matching categories' : 'No categories yet'} description={hasFilters ? 'Try changing or clearing the current search and status filters.' : 'Create your first medicine category to organize the catalog.'} /></div>;
  }
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr><th className="px-5 py-3">Category Name</th><th className="px-5 py-3">Description</th><th className="px-5 py-3 text-center">Medicines</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Created</th><th className="px-5 py-3 text-right">Actions</th></tr>
        </thead>
        <tbody>{categories.map((category) => <CategoryTableRow key={category.id} category={category} {...actions} />)}</tbody>
      </table>
    </div>
  );
}
