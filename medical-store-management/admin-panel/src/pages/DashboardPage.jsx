import { useAuth } from '../contexts/AuthContext';

function DashboardPage() {
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-800">Welcome, {admin?.full_name || 'Admin'}</h1>
          </div>
          <button
            onClick={() => logout()}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-500">Authentication is now enabled for the admin panel.</p>
      </div>
    </div>
  );
}

export default DashboardPage;
