import { Eye, Pencil, Power, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import IconButton from '../ui/IconButton';
import CategoryStatusBadge from './CategoryStatusBadge';

export default function CategoryTableRow({ category, onView, onEdit, onStatus, onDelete }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
      <td className="px-5 py-4"><p className="max-w-52 font-semibold text-slate-900">{category.categoryName}</p></td>
      <td className="px-5 py-4"><p className="max-w-xs truncate text-sm text-slate-600" title={category.description || 'No description'}>{category.description || <span className="text-slate-400">No description</span>}</p></td>
      <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{category.medicineCount}</td>
      <td className="px-5 py-4"><CategoryStatusBadge status={category.status} /></td>
      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">{formatDate(category.createdAt)}</td>
      <td className="px-5 py-4">
        <div className="flex justify-end gap-1">
          <IconButton label={`View ${category.categoryName}`} title="View details" onClick={() => onView(category)}><Eye className="h-4 w-4" /></IconButton>
          <IconButton label={`Edit ${category.categoryName}`} title="Edit category" onClick={() => onEdit(category)}><Pencil className="h-4 w-4" /></IconButton>
          <IconButton label={`${category.status === 'active' ? 'Deactivate' : 'Activate'} ${category.categoryName}`} title={category.status === 'active' ? 'Deactivate' : 'Activate'} onClick={() => onStatus(category)}><Power className={`h-4 w-4 ${category.status === 'active' ? 'text-amber-600' : 'text-emerald-600'}`} /></IconButton>
          <IconButton label={`Delete ${category.categoryName}`} title="Delete category" onClick={() => onDelete(category)} className="hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></IconButton>
        </div>
      </td>
    </tr>
  );
}
