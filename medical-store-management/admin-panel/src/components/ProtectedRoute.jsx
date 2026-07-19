import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute() {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">Loading...</div>;
  }

  return admin ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
