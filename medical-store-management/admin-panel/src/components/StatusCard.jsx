import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

function StatusCard({ title, status, icon: Icon, loading, success, error }) {
  const isLoading = loading;
  const isSuccess = success;
  const isError = error;

  return (
    <div className="rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_26px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950">{status}</p>
        </div>
        <div className={`rounded-2xl p-3 ring-1 ${isError ? 'bg-red-50 ring-red-100' : isSuccess ? 'bg-emerald-50 ring-emerald-100' : 'bg-slate-100 ring-slate-200'}`}>
          {isLoading ? (
            <Activity className="h-6 w-6 animate-spin text-slate-500" />
          ) : isError ? (
            <AlertCircle className="h-6 w-6 text-red-500" />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-slate-500">
        <Icon className="mr-2 h-4 w-4" />
        {isLoading ? 'Checking connection...' : isError ? 'Connection issue' : 'Connected'}
      </div>
    </div>
  );
}

export default StatusCard;
