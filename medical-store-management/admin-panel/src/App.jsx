import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import SetupPage from './pages/SetupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MedicinesPlaceholderPage from './pages/MedicinesPlaceholderPage';
import CategoriesPlaceholderPage from './pages/CategoriesPlaceholderPage';
import CompaniesPlaceholderPage from './pages/CompaniesPlaceholderPage';
import SuppliersPlaceholderPage from './pages/SuppliersPlaceholderPage';
import PurchasesPlaceholderPage from './pages/PurchasesPlaceholderPage';
import SalesPlaceholderPage from './pages/SalesPlaceholderPage';
import InventoryPlaceholderPage from './pages/InventoryPlaceholderPage';
import CustomersPlaceholderPage from './pages/CustomersPlaceholderPage';
import ReportsPlaceholderPage from './pages/ReportsPlaceholderPage';
import SettingsPlaceholderPage from './pages/SettingsPlaceholderPage';
import AdminNotFoundPage from './pages/AdminNotFoundPage';

function HomeRedirect() {
  const { admin, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">Loading session...</div>;
  return <Navigate to={admin ? '/admin/dashboard' : '/login'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="medicines" element={<MedicinesPlaceholderPage />} />
            <Route path="categories" element={<CategoriesPlaceholderPage />} />
            <Route path="companies" element={<CompaniesPlaceholderPage />} />
            <Route path="suppliers" element={<SuppliersPlaceholderPage />} />
            <Route path="purchases" element={<PurchasesPlaceholderPage />} />
            <Route path="sales" element={<SalesPlaceholderPage />} />
            <Route path="inventory" element={<InventoryPlaceholderPage />} />
            <Route path="customers" element={<CustomersPlaceholderPage />} />
            <Route path="reports" element={<ReportsPlaceholderPage />} />
            <Route path="settings" element={<SettingsPlaceholderPage />} />
            <Route path="*" element={<AdminNotFoundPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
