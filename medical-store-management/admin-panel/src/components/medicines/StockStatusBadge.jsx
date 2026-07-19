import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import { getStockStatusLabel } from '../../utils/medicineHelpers';
export default function StockStatusBadge({ status }) { const config = { inStock: [CheckCircle2, 'success'], lowStock: [AlertTriangle, 'warning'], outOfStock: [XCircle, 'danger'] }[status] || [AlertTriangle, 'neutral']; const [Icon, variant] = config; return <Badge variant={variant}><Icon className="mr-1 h-3.5 w-3.5" />{getStockStatusLabel(status)}</Badge>; }
