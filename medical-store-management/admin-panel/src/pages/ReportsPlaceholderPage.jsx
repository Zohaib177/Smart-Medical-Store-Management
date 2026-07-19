import { BarChart3 } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function ReportsPlaceholderPage() {
  return <ModulePlaceholder icon={BarChart3} title="Reports" description="Review operational and business performance information." emptyTitle="Reports are not available yet" emptyDescription="Real reports will be added after purchase, sales and inventory modules provide business data." />;
}
