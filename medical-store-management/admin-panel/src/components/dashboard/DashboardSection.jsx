export default function DashboardSection({ title, description, action, children, className = '' }) {
  return (
    <section className={`rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_26px_rgba(15,23,42,0.035)] sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-[-0.02em] text-slate-950">{title}</h2>
          {description && <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
