import { ChevronRight, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getNavigationItem } from '../../config/navigationConfig';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const currentItem = getNavigationItem(pathname);
  const isDashboard = currentItem?.path === '/admin/dashboard';

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
      {isDashboard ? (
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
          <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" /> Dashboard
        </span>
      ) : (
        <>
          <Link className="hidden items-center gap-1.5 hover:text-emerald-700 sm:inline-flex" to="/admin/dashboard">
            <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" /> Dashboard
          </Link>
          <ChevronRight className="hidden h-3.5 w-3.5 sm:block" aria-hidden="true" />
          <span className="truncate font-medium text-slate-700">{currentItem?.label || 'Admin'}</span>
        </>
      )}
    </nav>
  );
}
