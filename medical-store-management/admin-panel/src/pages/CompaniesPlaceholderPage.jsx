import { Building2 } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function CompaniesPlaceholderPage() {
  return <ModulePlaceholder icon={Building2} title="Pharmaceutical Companies" description="Maintain the manufacturers represented in your catalog." emptyTitle="Company management is not enabled yet" emptyDescription="Pharmaceutical company CRUD will be implemented in a future module phase." />;
}
