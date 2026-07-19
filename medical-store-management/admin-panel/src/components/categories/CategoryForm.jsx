import { useEffect, useState } from 'react';
import { getCategoryErrorMessage, getCategoryFieldErrors } from '../../utils/categoryHelpers';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

const emptyForm = { categoryName: '', description: '', status: 'active' };

export default function CategoryForm({ category, onSubmit, onCancel, isSaving }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const isEdit = Boolean(category);

  useEffect(() => {
    setForm(category ? { categoryName: category.categoryName || '', description: category.description || '', status: category.status || 'active' } : emptyForm);
    setErrors({});
    setFormError('');
  }, [category]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setFormError('');
  };

  const validate = () => {
    const next = {};
    const name = form.categoryName.trim();
    if (!name) next.categoryName = 'Category name is required';
    else if (name.length < 2) next.categoryName = 'Category name must contain at least 2 characters';
    else if (name.length > 100) next.categoryName = 'Category name must not exceed 100 characters';
    if (form.description.trim().length > 500) next.description = 'Description must not exceed 500 characters';
    if (!['active', 'inactive'].includes(form.status)) next.status = 'Select a valid status';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate() || isSaving) return;
    try {
      await onSubmit({ categoryName: form.categoryName.trim(), description: form.description.trim(), status: form.status });
    } catch (error) {
      setErrors(getCategoryFieldErrors(error));
      setFormError(getCategoryErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 px-5 py-5 sm:px-6">
      {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}
      <FormField id="categoryName" label="Category Name" error={errors.categoryName} required>
        <input id="categoryName" value={form.categoryName} onChange={(event) => update('categoryName', event.target.value)} maxLength={100} disabled={isSaving} className={`h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 ${errors.categoryName ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'}`} />
      </FormField>
      <FormField id="description" label="Description" error={errors.description} hint="Optional information to help administrators understand this category.">
        <textarea id="description" rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} maxLength={500} disabled={isSaving} className={`w-full resize-y rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'}`} />
        <p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/500</p>
      </FormField>
      <FormField id="categoryStatus" label="Status" error={errors.status}>
        <select id="categoryStatus" value={form.status} onChange={(event) => update('status', event.target.value)} disabled={isSaving} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </FormField>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : isEdit ? 'Update Category' : 'Save Category'}</Button>
      </div>
    </form>
  );
}
