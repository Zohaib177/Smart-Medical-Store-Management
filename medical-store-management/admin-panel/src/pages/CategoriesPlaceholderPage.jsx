import { Tags } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function CategoriesPlaceholderPage() {
  return <ModulePlaceholder icon={Tags} title="Medicine Categories" description="Organize medicines into clear and searchable groups." emptyTitle="Category management is not enabled yet" emptyDescription="Category CRUD will be implemented in a future module phase." />;
}
