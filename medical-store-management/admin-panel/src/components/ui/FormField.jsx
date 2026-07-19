export default function FormField({ id, label, error, hint, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}{required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
