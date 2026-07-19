import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickActionCard({ title, description, icon: Icon, to }) {
  return (
    <Link to={to} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-200 hover:bg-emerald-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" aria-hidden="true" />
    </Link>
  );
}
