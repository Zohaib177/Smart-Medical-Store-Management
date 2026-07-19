import { Building2 } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import LoadingCard from '../ui/LoadingCard';
import CompanyTableRow from './CompanyTableRow';

export default function CompanyTable({ companies, isLoading, hasFilters, actions }) {
  if (isLoading) return <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <LoadingCard key={index} />)}</div>;
  if (!companies.length) return <div className="p-5"><EmptyState icon={Building2} title={hasFilters ? 'No matching companies' : 'No companies yet'} description={hasFilters ? 'Try changing or clearing the current filters.' : 'Add the first pharmaceutical company to begin.'} /></div>;
  return <div className="max-w-full overflow-x-auto"><table className="w-full min-w-[1220px] text-left"><thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Company Name</th><th className="px-4 py-3">Contact Person</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3 text-center">Medicines</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{companies.map((company) => <CompanyTableRow key={company.id} company={company} {...actions} />)}</tbody></table></div>;
}
