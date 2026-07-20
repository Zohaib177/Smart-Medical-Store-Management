import Badge from './Badge';

export default function PageHeader({ title, description, badge, actions, breadcrumbs }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {breadcrumbs}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-bold leading-tight tracking-[-0.035em] text-slate-950 sm:text-[32px]">{title}</h1>
          {badge && <Badge variant="info">{badge}</Badge>}
        </div>
        {description && <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
