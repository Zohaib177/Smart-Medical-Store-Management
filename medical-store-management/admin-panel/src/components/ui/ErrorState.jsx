import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="rounded-[20px] border border-red-200 bg-gradient-to-b from-red-50 to-white p-7 text-center" role="alert">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700"><AlertCircle className="h-6 w-6" aria-hidden="true" /></span>
      <h2 className="mt-4 font-bold text-slate-950">{title}</h2>
      {description && <p className="mt-1.5 text-sm leading-6 text-slate-600">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry
        </button>
      )}
    </div>
  );
}
