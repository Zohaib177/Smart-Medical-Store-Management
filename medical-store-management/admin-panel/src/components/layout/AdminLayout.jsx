import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../../context/SidebarContext';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import MobileSidebarOverlay from './MobileSidebarOverlay';

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen overflow-x-hidden bg-slate-50">
        <AdminSidebar />
        <MobileSidebarOverlay />
        <div className="min-w-0 flex-1">
          <AdminHeader />
          <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
