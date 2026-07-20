export default function LoadingCard() {
  return (
    <div className="min-h-40 animate-pulse rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.035)]" aria-label="Loading content">
      <div className="flex items-start justify-between">
        <div className="h-4 w-28 rounded-full bg-slate-200" />
        <div className="h-11 w-11 rounded-2xl bg-slate-100" />
      </div>
      <div className="mt-5 h-8 w-16 rounded-lg bg-slate-200" />
      <div className="mt-3 h-3 w-36 rounded-full bg-slate-100" />
    </div>
  );
}
