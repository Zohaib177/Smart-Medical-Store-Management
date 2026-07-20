export default function FormField({ id, label, error, hint, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-bold text-slate-700">
        {label}{required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1.5 text-xs font-semibold text-red-600" role="alert">{error}</p> : hint && <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>}
    </div>
  );
}
