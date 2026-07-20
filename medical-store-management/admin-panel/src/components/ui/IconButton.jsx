export default function IconButton({ label, children, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition duration-150 hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
