import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickActionCard({ title, description, icon: Icon, to }) {
  return (
    <Link to={to} className="group flex min-h-[82px] items-center gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/60 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200 transition group-hover:ring-emerald-200">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-slate-900">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" aria-hidden="true" />
    </Link>
  );
}
