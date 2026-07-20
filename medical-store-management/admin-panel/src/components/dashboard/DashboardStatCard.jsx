import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/formatters';
import LoadingCard from '../ui/LoadingCard';

const variants = {
  default: { icon: 'bg-emerald-50 text-emerald-700 ring-emerald-100', line: 'bg-emerald-500' },
  warning: { icon: 'bg-amber-50 text-amber-700 ring-amber-100', line: 'bg-amber-500' },
  danger: { icon: 'bg-red-50 text-red-700 ring-red-100', line: 'bg-red-500' },
  info: { icon: 'bg-sky-50 text-sky-700 ring-sky-100', line: 'bg-sky-500' },
};

export default function DashboardStatCard({ title, value, icon: Icon, helperText, isLoading, status = 'default', link }) {
  if (isLoading) return <LoadingCard />;
  const variant = variants[status] || variants.default;

  const content = (
    <div className="group relative min-h-40 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_24px_rgba(15,23,42,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <span className={`absolute inset-x-0 top-0 h-1 ${variant.line}`} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <p className="pt-1 text-[13px] font-semibold leading-5 text-slate-600">{title}</p>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${variant.icon}`}>
          <Icon className="h-[21px] w-[21px]" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <p className="text-[32px] font-bold leading-none tracking-[-0.04em] text-slate-950">{formatNumber(value)}</p>
        {link && <span className="rounded-lg bg-slate-50 p-1.5 text-slate-400 transition group-hover:bg-emerald-50 group-hover:text-emerald-700"><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{helperText}</p>
    </div>
  );

  return link ? <Link to={link} className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">{content}</Link> : content;
}
