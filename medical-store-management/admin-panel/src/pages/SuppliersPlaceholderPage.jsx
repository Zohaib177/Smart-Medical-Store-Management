import { Truck } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function SuppliersPlaceholderPage() {
  return <ModulePlaceholder icon={Truck} title="Supplier Management" description="Manage supplier relationships and contact records." emptyTitle="Supplier management is coming soon" emptyDescription="Supplier CRUD will be implemented in the supplier-management phase." />;
}
