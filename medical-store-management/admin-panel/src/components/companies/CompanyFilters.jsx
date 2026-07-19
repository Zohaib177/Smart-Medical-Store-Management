import { RotateCcw } from 'lucide-react';
import { getCompanySortValue } from '../../utils/companyHelpers';
import Button from '../ui/Button';
import SearchInput from '../ui/SearchInput';
import SelectInput from '../ui/SelectInput';

const statuses = [{ value: '', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }];
const sorts = [{ value: 'created_at:desc', label: 'Newest' }, { value: 'created_at:asc', label: 'Oldest' }, { value: 'company_name:asc', label: 'Name A–Z' }, { value: 'company_name:desc', label: 'Name Z–A' }, { value: 'updated_at:desc', label: 'Recently updated' }];

export default function CompanyFilters({ filters, onSearch, onStatus, onSort, onClear }) {
  const changed = filters.search || filters.status || getCompanySortValue(filters) !== 'created_at:desc';
  return <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center"><SearchInput value={filters.search} onChange={onSearch} placeholder="Search company, contact, email, phone..." label="Search companies" /><div className="grid gap-3 sm:grid-cols-2 lg:flex"><SelectInput label="Filter by status" value={filters.status} onChange={onStatus} options={statuses} className="lg:w-40" /><SelectInput label="Sort companies" value={getCompanySortValue(filters)} onChange={onSort} options={sorts} className="lg:w-44" /></div><Button variant="ghost" size="sm" onClick={onClear} disabled={!changed} className="self-start"><RotateCcw className="h-4 w-4" /> Clear filters</Button></div>;
}
