import EmptyState from './EmptyState';
import PageHeader from './PageHeader';

export default function ModulePlaceholder({ icon, title, description, emptyTitle, emptyDescription }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} badge="Phase 4 placeholder" />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
      </section>
    </div>
  );
}
