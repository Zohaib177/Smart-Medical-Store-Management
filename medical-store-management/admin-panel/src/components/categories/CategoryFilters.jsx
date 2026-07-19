import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { getSortValue } from '../../utils/categoryHelpers';
import Button from '../ui/Button';
import SearchInput from '../ui/SearchInput';
import SelectInput from '../ui/SelectInput';

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const sortOptions = [
  { value: 'created_at:desc', label: 'Newest' },
  { value: 'created_at:asc', label: 'Oldest' },
  { value: 'category_name:asc', label: 'Name A–Z' },
  { value: 'category_name:desc', label: 'Name Z–A' },
  { value: 'updated_at:desc', label: 'Recently updated' },
];

export default function CategoryFilters({ filters, onSearch, onStatus, onSort, onClear }) {
  const hasFilters = filters.search || filters.status || getSortValue(filters) !== 'created_at:desc';
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
      <SearchInput value={filters.search} onChange={onSearch} placeholder="Search name or description..." label="Search categories" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto">
        <SelectInput label="Filter by status" value={filters.status} onChange={onStatus} options={statusOptions} className="lg:w-40" />
        <SelectInput label="Sort categories" value={getSortValue(filters)} onChange={onSort} options={sortOptions} className="lg:w-44" />
      </div>
      <Button variant="ghost" size="sm" onClick={onClear} disabled={!hasFilters} className="self-start lg:self-auto">
        <RotateCcw className="h-4 w-4" /> Clear filters
      </Button>
      <SlidersHorizontal className="hidden h-4 w-4 text-slate-300 lg:block" aria-hidden="true" />
    </div>
  );
}
