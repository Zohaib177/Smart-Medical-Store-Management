const variants = {
  primary: 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/10 hover:-translate-y-px hover:bg-emerald-700 hover:shadow-md focus-visible:ring-emerald-500',
  secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-emerald-500',
  danger: 'bg-red-600 text-white shadow-sm hover:-translate-y-px hover:bg-red-700 focus-visible:ring-red-500',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-emerald-500',
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  const sizes = size === 'sm' ? 'min-h-9 px-3.5 text-xs' : 'min-h-11 px-4 text-sm';
  return (
    <button type={type} className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 ${sizes} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
