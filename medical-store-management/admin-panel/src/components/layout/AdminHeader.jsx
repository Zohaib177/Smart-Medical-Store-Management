import { Bell, Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getNavigationItem } from '../../config/navigationConfig';
import useSidebar from '../../hooks/useSidebar';
import IconButton from '../ui/IconButton';
import Breadcrumbs from './Breadcrumbs';
import ProfileDropdown from './ProfileDropdown';

export default function AdminHeader() {
  const { pathname } = useLocation();
  const { openMobileSidebar } = useSidebar();
  const currentPage = getNavigationItem(pathname)?.label || 'Admin';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <IconButton label="Open navigation menu" onClick={openMobileSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </IconButton>
        <div className="min-w-0 lg:w-48">
          <p className="truncate text-sm font-semibold text-slate-900">{currentPage}</p>
          <Breadcrumbs />
        </div>
        <label className="ml-auto hidden h-10 min-w-0 max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex">
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search</span>
          <input type="search" placeholder="Search medicines, invoices..." className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
        </label>
        <IconButton label="Notifications" className="relative md:ml-2">
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true" />
        </IconButton>
        <ProfileDropdown />
      </div>
    </header>
  );
}
