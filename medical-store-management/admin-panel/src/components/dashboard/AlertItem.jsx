const variants = {
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export default function AlertItem({ icon: Icon, title, message, variant = 'warning' }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3.5 ${variants[variant]}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-600">{message}</p>
      </div>
    </div>
  );
}
