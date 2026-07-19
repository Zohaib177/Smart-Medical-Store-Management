import {
  BarChart3,
  Boxes,
  Building2,
  LayoutDashboard,
  Pill,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Tags,
  Truck,
  Users,
} from 'lucide-react';

export const navigationItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, description: 'Store overview and alerts' },
  { label: 'Medicines', path: '/admin/medicines', icon: Pill, description: 'Manage medicine records' },
  { label: 'Categories', path: '/admin/categories', icon: Tags, description: 'Organize medicine categories' },
  { label: 'Companies', path: '/admin/companies', icon: Building2, description: 'Manage pharmaceutical companies' },
  { label: 'Suppliers', path: '/admin/suppliers', icon: Truck, description: 'Manage supplier relationships' },
  { label: 'Purchases', path: '/admin/purchases', icon: ShoppingBag, description: 'Record stock purchases' },
  { label: 'Sales / POS', path: '/admin/sales', icon: ShoppingCart, description: 'Process customer sales' },
  { label: 'Inventory', path: '/admin/inventory', icon: Boxes, description: 'Monitor stock movement' },
  { label: 'Customers', path: '/admin/customers', icon: Users, description: 'Manage customer records' },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3, description: 'Review business reports' },
  { label: 'Settings', path: '/admin/settings', icon: Settings, description: 'Configure the system' },
];

export function getNavigationItem(pathname) {
  return navigationItems.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
}
