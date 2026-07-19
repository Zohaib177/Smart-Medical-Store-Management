import { ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';
import Badge from '../ui/Badge'; import { getTransactionTypeLabel } from '../../utils/inventoryHelpers';
export default function TransactionTypeBadge({ type }) { const [Icon, variant] = ({ stockIn: [ArrowDownToLine, 'success'], stockOut: [ArrowUpFromLine, 'danger'], correction: [RefreshCw, 'warning'] }[type] || [RefreshCw, 'neutral']); return <Badge variant={variant}><Icon className="mr-1 h-3.5 w-3.5" />{getTransactionTypeLabel(type)}</Badge>; }
