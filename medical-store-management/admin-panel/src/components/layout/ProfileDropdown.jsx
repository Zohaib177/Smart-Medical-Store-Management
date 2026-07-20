import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../ui/Badge';

function initials(name) {
  return String(name || 'Admin').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const adminName = admin?.full_name || admin?.fullName || 'Administrator';

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label="Open admin profile menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 text-left transition hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">{initials(adminName)}</span>
        <span className="hidden max-w-32 sm:block">
          <span className="block truncate text-sm font-semibold text-slate-800">{adminName}</span>
          <span className="block truncate text-xs text-slate-500">Admin</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden="true" />
      </button>

      {isOpen && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.16)]">
          <div className="border-b border-slate-100 px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-slate-900">{adminName}</p>
              <Badge variant="success">{admin?.status || 'active'}</Badge>
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">{admin?.email || 'Admin account'}</p>
          </div>
          <button type="button" role="menuitem" onClick={() => setIsOpen(false)} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
            <UserRound className="h-4 w-4" aria-hidden="true" /> View profile
            <span className="ml-auto text-xs text-slate-400">Coming soon</span>
          </button>
          <Link role="menuitem" to="/admin/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
            <Settings className="h-4 w-4" aria-hidden="true" /> Settings
          </Link>
          <button type="button" role="menuitem" disabled={isLoggingOut} onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">
            <LogOut className="h-4 w-4" aria-hidden="true" /> {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}
