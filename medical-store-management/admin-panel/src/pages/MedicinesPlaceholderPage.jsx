import { Pill } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function MedicinesPlaceholderPage() {
  return <ModulePlaceholder icon={Pill} title="Medicine Management" description="Maintain the products available in your medical store." emptyTitle="Medicine management is coming next" emptyDescription="Medicine CRUD will be implemented in the medicine-management phase." />;
}
