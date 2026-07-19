import { Users } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function CustomersPlaceholderPage() {
  return <ModulePlaceholder icon={Users} title="Customer Management" description="Maintain customer contact and account information." emptyTitle="Customer management is not enabled yet" emptyDescription="Customer CRUD will be implemented in a future module phase." />;
}
