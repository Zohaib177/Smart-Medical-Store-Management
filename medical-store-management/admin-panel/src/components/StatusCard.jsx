import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

function StatusCard({ title, status, icon: Icon, loading, success, error }) {
  const isLoading = loading;
  const isSuccess = success;
  const isError = error;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{status}</p>
        </div>
        <div className={`rounded-xl p-3 ${isError ? 'bg-red-50' : isSuccess ? 'bg-emerald-50' : 'bg-slate-100'}`}>
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
