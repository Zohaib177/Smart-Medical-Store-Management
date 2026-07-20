const variants = {
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export default function AlertItem({ icon: Icon, title, message, variant = 'warning' }) {
  return (
    <div className={`flex items-start gap-3.5 rounded-2xl border p-4 ${variants[variant]}`}>
      <span className="rounded-xl bg-white/70 p-2 shadow-sm"><Icon className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">{message}</p>
      </div>
    </div>
  );
}
