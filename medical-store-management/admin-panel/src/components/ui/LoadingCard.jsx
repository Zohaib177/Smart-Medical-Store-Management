export default function LoadingCard() {
  return (
    <div className="min-h-36 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Loading dashboard statistic">
      <div className="flex items-start justify-between">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="h-10 w-10 rounded-xl bg-slate-100" />
      </div>
      <div className="mt-5 h-8 w-16 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-36 rounded bg-slate-100" />
    </div>
  );
}
