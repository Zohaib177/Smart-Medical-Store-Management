import { ChevronLeft, ChevronRight, LogOut, Menu, ShieldPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { navigationItems } from '../../config/navigationConfig';
import { useAuth } from '../../contexts/AuthContext';
import useSidebar from '../../hooks/useSidebar';

function getInitials(name) {
  return String(name || 'Admin').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function SidebarContent({ collapsed = false, mobile = false, onNavigate, onLogout, isLoggingOut, admin }) {
  const adminName = admin?.full_name || admin?.fullName || 'Administrator';

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-950 text-slate-200">
      <div className={`flex h-20 shrink-0 items-center border-b border-white/10 ${collapsed ? 'justify-center px-3' : 'gap-3 px-5'}`}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-950/30">
          <ShieldPlus className="h-6 w-6" aria-hidden="true" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-bold text-white">Medical Store</p>
            <p className="truncate text-xs text-slate-400">Admin Management</p>
          </div>
        )}
        {mobile && (
          <button type="button" onClick={onNavigate} aria-label="Close navigation menu" className="ml-auto rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        {!collapsed && <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</p>}
        <div className="space-y-1">
          {navigationItems.map(({ label, path, icon: Icon, badge }) => (
            <NavLink
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              onClick={onNavigate}
              className={({ isActive }) => `group flex min-h-11 items-center rounded-xl text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} ${isActive ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/20' : 'text-slate-400 hover:bg-white/7 hover:text-white'}`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!collapsed && <span className="truncate">{label}</span>}
              {!collapsed && badge && <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px]">{badge}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className={`shrink-0 border-t border-white/10 p-3 ${collapsed ? 'space-y-2' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 rounded-xl bg-white/5 p-3'}`} title={collapsed ? adminName : undefined}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-xs font-bold text-emerald-300">{getInitials(adminName)}</span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{adminName}</p>
              <p className="truncate text-xs text-slate-400">{admin?.email || 'Admin account'}</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          title={collapsed ? 'Sign out' : undefined}
          aria-label="Sign out"
          className={`mt-2 flex min-h-10 w-full items-center rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-60 ${collapsed ? 'justify-center' : 'gap-3 px-3'}`}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {!collapsed && (isLoggingOut ? 'Signing out...' : 'Sign out')}
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobileSidebar } = useSidebar();
  const { admin, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const mobilePanelRef = useRef(null);

  useEffect(() => {
    if (!isMobileOpen) return undefined;
    mobilePanelRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeMobileSidebar();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isMobileOpen, closeMobileSidebar]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      closeMobileSidebar();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <aside className={`relative hidden h-screen shrink-0 transition-[width] duration-200 lg:block ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent collapsed={isCollapsed} admin={admin} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-24 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {isMobileOpen && (
        <aside ref={mobilePanelRef} tabIndex={-1} aria-label="Mobile admin navigation" className="mobile-sidebar-enter fixed inset-y-0 left-0 z-50 w-[min(19rem,86vw)] outline-none lg:hidden">
          <SidebarContent mobile admin={admin} onNavigate={closeMobileSidebar} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
        </aside>
      )}
    </>
  );
}
