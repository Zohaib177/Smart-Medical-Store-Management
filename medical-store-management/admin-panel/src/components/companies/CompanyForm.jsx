import { useEffect, useState } from 'react';
import { getCompanyErrorMessage, getCompanyFieldErrors } from '../../utils/companyHelpers';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

const empty = { companyName: '', contactPerson: '', email: '', phone: '', address: '', status: 'active' };

export default function CompanyForm({ company, onSubmit, onCancel, isSaving }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  useEffect(() => { setForm(company ? { companyName: company.companyName || '', contactPerson: company.contactPerson || '', email: company.email || '', phone: company.phone || '', address: company.address || '', status: company.status || 'active' } : empty); setErrors({}); setFormError(''); }, [company]);
  const update = (field, value) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: '' })); setFormError(''); };
  const validate = () => {
    const next = {}; const name = form.companyName.trim(); const email = form.email.trim(); const phone = form.phone.trim();
    if (!name) next.companyName = 'Company name is required'; else if (name.length < 2 || name.length > 150) next.companyName = 'Company name must be between 2 and 150 characters';
    if (form.contactPerson.trim().length > 120) next.contactPerson = 'Contact person must not exceed 120 characters';
    if (email.length > 150 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) next.email = 'Enter a valid email address up to 150 characters';
    if (phone.length > 30 || (phone && !/^[0-9+()\-\s]+$/.test(phone))) next.phone = 'Phone may use numbers, spaces, +, -, and parentheses only';
    if (form.address.trim().length > 1000) next.address = 'Address must not exceed 1000 characters';
    if (!['active', 'inactive'].includes(form.status)) next.status = 'Select a valid status';
    setErrors(next); return Object.keys(next).length === 0;
  };
  const submit = async (event) => { event.preventDefault(); if (!validate() || isSaving) return; try { await onSubmit(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]))); } catch (error) { setErrors(getCompanyFieldErrors(error)); setFormError(getCompanyErrorMessage(error)); } };
  const inputClass = 'h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';
  return <form onSubmit={submit} noValidate className="space-y-5 px-5 py-5 sm:px-6">{formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}<FormField id="companyName" label="Company Name" error={errors.companyName} required><input id="companyName" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} maxLength={150} disabled={isSaving} className={inputClass} /></FormField><div className="grid gap-5 sm:grid-cols-2"><FormField id="contactPerson" label="Contact Person" error={errors.contactPerson}><input id="contactPerson" value={form.contactPerson} onChange={(e) => update('contactPerson', e.target.value)} maxLength={120} disabled={isSaving} className={inputClass} /></FormField><FormField id="phone" label="Phone" error={errors.phone}><input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} maxLength={30} disabled={isSaving} className={inputClass} /></FormField></div><FormField id="companyEmail" label="Email" error={errors.email}><input id="companyEmail" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} maxLength={150} disabled={isSaving} className={inputClass} /></FormField><FormField id="companyAddress" label="Address" error={errors.address}><textarea id="companyAddress" rows={4} value={form.address} onChange={(e) => update('address', e.target.value)} maxLength={1000} disabled={isSaving} className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /><p className="mt-1 text-right text-xs text-slate-400">{form.address.length}/1000</p></FormField><FormField id="companyStatus" label="Status" error={errors.status}><select id="companyStatus" value={form.status} onChange={(e) => update('status', e.target.value)} className={inputClass}><option value="active">Active</option><option value="inactive">Inactive</option></select></FormField><div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><Button variant="secondary" onClick={onCancel} disabled={isSaving}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : company ? 'Update Company' : 'Save Company'}</Button></div></form>;
}
