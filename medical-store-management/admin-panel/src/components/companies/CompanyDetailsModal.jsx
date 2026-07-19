import { Building2, Mail, MapPin, Package, Phone, UserRound } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import LoadingCard from '../ui/LoadingCard';
import Modal from '../ui/Modal';
import CompanyStatusBadge from './CompanyStatusBadge';

export default function CompanyDetailsModal({ company, isOpen, onClose, isLoading }) {
  const value = (text) => text || 'Not provided';
  return <Modal isOpen={isOpen} onClose={onClose} title="Company Details" description="Manufacturer contact information and medicine usage." size="lg"><div className="px-5 py-5 sm:px-6">{isLoading ? <LoadingCard /> : company && <div className="space-y-5"><div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Building2 className="h-5 w-5" /></span><div><h3 className="font-bold text-slate-900">{company.companyName}</h3><div className="mt-2"><CompanyStatusBadge status={company.status} /></div></div></div><div className="grid gap-3 sm:grid-cols-2"><Detail icon={UserRound} label="Contact person" value={value(company.contactPerson)} /><Detail icon={Mail} label="Email" value={value(company.email)} /><Detail icon={Phone} label="Phone" value={value(company.phone)} /><Detail icon={Package} label="Linked medicines" value={company.medicineCount} /></div><Detail icon={MapPin} label="Address" value={value(company.address)} /><div className="grid gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:grid-cols-2"><p>Created: <span className="font-medium text-slate-700">{formatDateTime(company.createdAt)}</span></p><p>Updated: <span className="font-medium text-slate-700">{formatDateTime(company.updatedAt)}</span></p></div></div>}</div></Modal>;
}

function Detail({ icon: Icon, label, value }) { return <div className="min-w-0 rounded-xl border border-slate-200 p-4"><Icon className="h-4 w-4 text-emerald-600" /><p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 break-words text-sm text-slate-700">{value}</p></div>; }
