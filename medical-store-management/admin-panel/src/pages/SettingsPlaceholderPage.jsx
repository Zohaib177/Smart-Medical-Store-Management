import { Settings } from 'lucide-react';
import ModulePlaceholder from '../components/ui/ModulePlaceholder';

export default function SettingsPlaceholderPage() {
  return <ModulePlaceholder icon={Settings} title="System Settings" description="Configure medical store and application preferences." emptyTitle="Settings management is not enabled yet" emptyDescription="Editable system settings will be implemented in a future phase." />;
}
