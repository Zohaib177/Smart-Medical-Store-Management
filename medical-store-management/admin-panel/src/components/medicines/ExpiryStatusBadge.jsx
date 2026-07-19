import { AlertTriangle, CalendarCheck2, CalendarX2, CircleHelp } from 'lucide-react';
import Badge from '../ui/Badge';
import { getExpiryStatusLabel } from '../../utils/medicineHelpers';
export default function ExpiryStatusBadge({ status }) { const config = { valid: [CalendarCheck2, 'success'], expiringSoon: [AlertTriangle, 'warning'], expired: [CalendarX2, 'danger'], unknown: [CircleHelp, 'neutral'] }[status] || [CircleHelp, 'neutral']; const [Icon, variant] = config; return <Badge variant={variant}><Icon className="mr-1 h-3.5 w-3.5" />{getExpiryStatusLabel(status)}</Badge>; }
