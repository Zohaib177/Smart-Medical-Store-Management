import { ShoppingBag } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function PurchasesPlaceholderPage() {
  return <ModulePlaceholder icon={ShoppingBag} title="Purchase Management" description="Record procurement and incoming medicine stock." emptyTitle="Purchase recording is not enabled yet" emptyDescription="Purchase workflows will be implemented in a future phase." />;
}
