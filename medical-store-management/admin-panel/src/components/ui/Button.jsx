const variants = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-emerald-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-emerald-500',
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  const sizes = size === 'sm' ? 'min-h-9 px-3 text-xs' : 'min-h-10 px-4 text-sm';
  return (
    <button type={type} className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${sizes} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
