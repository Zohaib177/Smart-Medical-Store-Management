import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="rounded-[20px] border border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-white px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-base font-bold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
