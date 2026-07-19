import { MapPinOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';

export default function AdminNotFoundPage() {
  return (
    <EmptyState
      icon={MapPinOff}
      title="Admin page not found"
      description="The requested admin page does not exist or has not been enabled."
      action={<Link to="/admin/dashboard" className="inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Return to dashboard</Link>}
    />
  );
}
