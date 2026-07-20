export default function SelectInput({ label, value, onChange, options, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm outline-none hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
