import { History } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export default function RecentActivityItem() {
  return (
    <EmptyState
      icon={History}
      title="No activity to display yet"
      description="Recent activity will appear after purchase, sale and inventory modules are enabled."
    />
  );
}
