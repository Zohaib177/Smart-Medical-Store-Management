import { AlertTriangle, Ban, CheckCircle2, PackagePlus, Pill, ShoppingBag, ShoppingCart, Timer, Truck, UserPlus, Users } from 'lucide-react';
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
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your medical store operations." />

      <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">{formatDate(new Date())}</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Welcome back, {adminName}</h2>
            <p className="mt-1 text-sm text-slate-600">Here is the latest operational snapshot for your store.</p>
          </div>
          {lastUpdated && <p className="text-xs text-slate-500">Updated {formatDateTime(lastUpdated)}</p>}
        </div>
      </section>

      {error ? (
        <ErrorState title="Unable to load dashboard summary." description="Check the backend connection and try again." onRetry={retry} />
      ) : (
        <section aria-label="Store summary" className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {stats.map((stat) => <DashboardStatCard key={stat.title} {...stat} isLoading={isLoading} />)}
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-5">
        <DashboardSection title="Quick Actions" description="Open the modules used for common store tasks." className="xl:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickActionCard title="Add Medicine" description="Open medicine management" icon={PackagePlus} to="/admin/medicines" />
            <QuickActionCard title="Record Purchase" description="Open purchase management" icon={ShoppingBag} to="/admin/purchases" />
            <QuickActionCard title="New Sale" description="Open sales and POS" icon={ShoppingCart} to="/admin/sales" />
            <QuickActionCard title="Add Supplier" description="Open supplier management" icon={UserPlus} to="/admin/suppliers" />
          </div>
        </DashboardSection>

        <DashboardSection title="Inventory Alerts" description="Stock conditions that may need attention." className="xl:col-span-2">
          <div className="space-y-3">
            {isLoading && <p className="text-sm text-slate-500">Checking inventory alerts...</p>}
            {!isLoading && alerts.map((alert) => <AlertItem key={alert.title} {...alert} />)}
            {!isLoading && alerts.length === 0 && <AlertItem icon={CheckCircle2} title="No urgent inventory alerts" message="Stock levels and upcoming expiry counts do not currently require attention." variant="success" />}
          </div>
        </DashboardSection>
      </div>

      <DashboardSection title="Recent Activity" description="Purchases, sales and stock events will be summarized here.">
        <RecentActivityItem />
      </DashboardSection>
    </div>
  );
}

export default DashboardPage;
