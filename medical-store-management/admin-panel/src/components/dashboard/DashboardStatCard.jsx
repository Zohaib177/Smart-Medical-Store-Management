import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/formatters';
import LoadingCard from '../ui/LoadingCard';

const variants = {
  default: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
};

export default function DashboardStatCard({ title, value, icon: Icon, helperText, isLoading, status = 'default', link }) {
  if (isLoading) return <LoadingCard />;

  const content = (
    <div className="group min-h-36 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${variants[status] || variants.default}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="text-3xl font-bold tracking-tight text-slate-900">{formatNumber(value)}</p>
        {link && <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-emerald-600" aria-hidden="true" />}
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{helperText}</p>
    </div>
  );

  return link ? <Link to={link} className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">{content}</Link> : content;
}
