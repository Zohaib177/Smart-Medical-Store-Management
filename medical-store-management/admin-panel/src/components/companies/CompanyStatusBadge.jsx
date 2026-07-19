import Badge from '../ui/Badge';

export default function CompanyStatusBadge({ status }) {
  const active = status === 'active';
  return <Badge variant={active ? 'success' : 'neutral'}><span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />{active ? 'Active' : 'Inactive'}</Badge>;
}
