import { Boxes } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function InventoryPlaceholderPage() {
  return <ModulePlaceholder icon={Boxes} title="Inventory Management" description="Monitor medicine availability and stock movement." emptyTitle="Inventory transactions are not enabled yet" emptyDescription="Detailed inventory management will be implemented in a future phase." />;
}
