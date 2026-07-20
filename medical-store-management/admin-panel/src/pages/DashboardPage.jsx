import { Activity, AlertTriangle, Ban, CalendarDays, CheckCircle2, PackagePlus, Pill, ShoppingBag, ShoppingCart, Timer, Truck, UserPlus, Users } from 'lucide-react';
import AlertItem from '../components/dashboard/AlertItem';
import DashboardSection from '../components/dashboard/DashboardSection';
import DashboardStatCard from '../components/dashboard/DashboardStatCard';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import RecentActivityItem from '../components/dashboard/RecentActivityItem';
import ErrorState from '../components/ui/ErrorState';
import PageHeader from '../components/ui/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import useDashboard from '../hooks/useDashboard';
import { formatDate, formatDateTime } from '../utils/formatters';

function DashboardPage() {
  const { admin } = useAuth();
  const { summary, isLoading, error, lastUpdated, retry } = useDashboard();
  const adminName = admin?.full_name || admin?.fullName || 'Administrator';

  const stats = [
    { title: 'Total Medicines', value: summary.totalMedicines, icon: Pill, helperText: 'All medicine records', link: '/admin/medicines' },
    { title: 'Low Stock Medicines', value: summary.lowStockMedicines, icon: AlertTriangle, helperText: 'At or below minimum level', status: 'warning', link: '/admin/inventory' },
    { title: 'Expiring Soon', value: summary.expiringSoonMedicines, icon: Timer, helperText: 'Within the next 30 days', status: 'warning', link: '/admin/inventory' },
    { title: 'Out of Stock', value: summary.outOfStockMedicines, icon: Ban, helperText: 'No stock currently available', status: 'danger', link: '/admin/inventory' },
    { title: 'Total Suppliers', value: summary.totalSuppliers, icon: Truck, helperText: 'Registered supplier records', status: 'info', link: '/admin/suppliers' },
    { title: 'Total Customers', value: summary.totalCustomers, icon: Users, helperText: 'Registered customer records', status: 'info', link: '/admin/customers' },
  ];

  const alerts = [
    summary.lowStockMedicines > 0 && { icon: AlertTriangle, title: 'Low stock requires attention', message: `${summary.lowStockMedicines} medicines are below minimum stock.`, variant: 'warning' },
    summary.expiringSoonMedicines > 0 && { icon: Timer, title: 'Medicines expiring soon', message: `${summary.expiringSoonMedicines} medicines will expire within 30 days.`, variant: 'warning' },
    summary.outOfStockMedicines > 0 && { icon: Ban, title: 'Medicines out of stock', message: `${summary.outOfStockMedicines} medicines are currently out of stock.`, variant: 'danger' },
  ].filter(Boolean);

  return (
    <div className="space-y-7">
      <PageHeader title="Dashboard" description="A clear view of stock health, store records and daily operations." badge="Live overview" />

      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 px-5 py-6 text-white shadow-[0_16px_40px_rgba(6,78,59,0.16)] sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border-[32px] border-white/[0.04]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200"><Activity className="h-4 w-4" /> Store command center</div>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-white sm:text-[28px]">Welcome back, {adminName}</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-100/80">Monitor medicine availability, expiry risks and the records that keep your store running smoothly.</p>
          </div>
          <div className="flex flex-col gap-2 text-xs text-emerald-100/80 sm:items-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2"><CalendarDays className="h-4 w-4 text-emerald-300" />{formatDate(new Date())}</span>
            {lastUpdated && <p className="px-1">Data updated {formatDateTime(lastUpdated)}</p>}
          </div>
        </div>
      </section>

      {error ? (
        <ErrorState title="Unable to load dashboard summary." description="Check the backend connection and try again." onRetry={retry} />
      ) : (
        <section aria-label="Store summary" className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => <DashboardStatCard key={stat.title} {...stat} isLoading={isLoading} />)}
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-5">
        <DashboardSection title="Quick Actions" description="Move directly to the modules used in everyday store operations." className="xl:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickActionCard title="Add Medicine" description="Open medicine management" icon={PackagePlus} to="/admin/medicines" />
            <QuickActionCard title="Record Purchase" description="Open purchase management" icon={ShoppingBag} to="/admin/purchases" />
            <QuickActionCard title="New Sale" description="Open sales and POS" icon={ShoppingCart} to="/admin/sales" />
            <QuickActionCard title="Add Supplier" description="Open supplier management" icon={UserPlus} to="/admin/suppliers" />
          </div>
        </DashboardSection>

        <DashboardSection title="Inventory Alerts" description="Priority stock conditions that may need your attention." className="xl:col-span-2">
          <div className="space-y-3">
            {isLoading && <p className="text-sm text-slate-500">Checking inventory alerts...</p>}
            {!isLoading && alerts.map((alert) => <AlertItem key={alert.title} {...alert} />)}
            {!isLoading && alerts.length === 0 && <AlertItem icon={CheckCircle2} title="No urgent inventory alerts" message="Stock levels and upcoming expiry counts do not currently require attention." variant="success" />}
          </div>
        </DashboardSection>
      </div>

      <DashboardSection title="Recent Activity" description="A timeline of purchases, sales and stock events will appear here.">
        <RecentActivityItem />
      </DashboardSection>
    </div>
  );
}

export default DashboardPage;
