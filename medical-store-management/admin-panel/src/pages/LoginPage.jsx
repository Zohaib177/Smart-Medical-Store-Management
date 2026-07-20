import { useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, ShieldPlus } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, login } = useAuth();
  const destination = location.state?.from?.pathname || '/admin/dashboard';

  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f8f6] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_24px_70px_rgba(15,23,42,0.13)]">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 px-7 py-7 text-white sm:px-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"><ShieldPlus className="h-7 w-7 text-emerald-200" /></span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Medical Store</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em]">Admin Sign In</h1>
          <p className="mt-2 text-sm leading-6 text-emerald-100/75">Secure access to store operations, inventory and management tools.</p>
        </div>

        <form className="space-y-5 p-7 sm:p-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-email" className="mb-2 block text-[13px] font-bold text-slate-700">Email address</label>
            <div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" required /></div>
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-[13px] font-bold text-slate-700">Password</label>
            <div className="relative"><LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" required /></div>
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold text-white shadow-md shadow-emerald-900/15 transition hover:-translate-y-px hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
          >
            <ShieldCheck className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-xs leading-5 text-slate-400">Authorized administrators only. Your session is securely protected.</p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
