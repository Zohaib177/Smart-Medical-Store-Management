import { useEffect, useState } from 'react';
import { AlertTriangle, Activity, Building2, Database, RefreshCw, ShieldCheck } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import { getSystemHealth } from '../services/healthService';

function SetupPage() {
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('Disconnected');
  const [databaseStatus, setDatabaseStatus] = useState('Disconnected');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastChecked, setLastChecked] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    setErrorMessage('');
    setIsRetrying(true);

    try {
      const data = await getSystemHealth();
      setBackendStatus(data.server === 'connected' ? 'Connected' : 'Disconnected');
      setDatabaseStatus(data.database === 'connected' ? 'Connected' : 'Disconnected');
      setLastChecked(new Date(data.timestamp || Date.now()).toLocaleString());
    } catch (error) {
      setBackendStatus('Disconnected');
      setDatabaseStatus('Disconnected');
      setErrorMessage('Unable to reach the backend API. Please verify the server is running.');
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Medical Store Admin Panel</h1>
              <p className="text-sm text-slate-500">System foundation and database connection status</p>
            </div>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            Phase 0
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Setup Status</h2>
              <p className="mt-1 text-sm text-slate-500">Confirm that the backend and database are ready for future modules.</p>
            </div>
            <button
              onClick={checkHealth}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
              Retry Connection
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatusCard title="Frontend Status" status="Connected" icon={ShieldCheck} loading={false} success={true} error={false} />
            <StatusCard title="Backend API Status" status={backendStatus} icon={Activity} loading={loading} success={backendStatus === 'Connected'} error={backendStatus === 'Disconnected' && !loading} />
            <StatusCard title="MySQL Database Status" status={databaseStatus} icon={Database} loading={loading} success={databaseStatus === 'Connected'} error={databaseStatus === 'Disconnected' && !loading} />
          </div>

          {errorMessage && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-medium">Connection issue</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">Last checked: {lastChecked || 'Waiting for first check...'}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">API: {import.meta.env.VITE_API_BASE_URL}</span>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
        Medical Store Management System
      </footer>
    </div>
  );
}

export default SetupPage;
