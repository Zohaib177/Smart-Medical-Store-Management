import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;
  return (
    <div role="status" aria-live="polite" className={`fixed bottom-4 right-4 z-[90] flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${isSuccess ? 'border-emerald-200' : 'border-red-200'}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`} />
      <p className="min-w-0 flex-1 text-sm font-medium text-slate-700">{toast.message}</p>
      <button type="button" aria-label="Dismiss notification" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
    </div>
  );
}
