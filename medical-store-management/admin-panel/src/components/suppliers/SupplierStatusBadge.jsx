import { CheckCircle2, XCircle } from 'lucide-react'; import Badge from '../ui/Badge';
export default function SupplierStatusBadge({status}){const active=status==='active';const Icon=active?CheckCircle2:XCircle;return <Badge variant={active?'success':'neutral'}><Icon className="mr-1 h-3.5 w-3.5"/>{active?'Active':'Inactive'}</Badge>;}
