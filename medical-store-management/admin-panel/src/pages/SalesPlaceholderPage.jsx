import { ShoppingCart } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function SalesPlaceholderPage() {
  return <ModulePlaceholder icon={ShoppingCart} title="Sales / Point of Sale" description="Process customer sales and issue invoices." emptyTitle="Point of sale is not enabled yet" emptyDescription="Sales and POS workflows will be implemented in a future phase." />;
}
