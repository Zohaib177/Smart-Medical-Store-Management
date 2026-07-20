import { Eye, Pencil, Power, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getDaysUntilExpiryText } from "../../utils/medicineHelpers";
import IconButton from "../ui/IconButton";
import ExpiryStatusBadge from "./ExpiryStatusBadge";
import MedicineImagePreview from "./MedicineImagePreview";
import MedicineStatusBadge from "./MedicineStatusBadge";
import StockStatusBadge from "./StockStatusBadge";
export default function MedicineTableRow({
  medicine,
  onView,
  onEdit,
  onStatus,
  onDelete,
}) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/25">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3.5">
          <MedicineImagePreview
            src={medicine.imageUrl}
            alt={medicine.medicineName}
          />
          <div className="min-w-0">
            <p className="max-w-52 truncate text-sm font-bold text-slate-950">
              {medicine.medicineName}
            </p>
            <p className="mt-1 max-w-52 truncate text-xs text-slate-500">
              {medicine.genericName || "No generic name"}
              {medicine.strength ? ` · ${medicine.strength}` : ""}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-slate-600">
        {medicine.category.categoryName}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-slate-600">
        {medicine.company.companyName}
      </td>
      <td className="px-4 py-4 text-sm text-slate-600">
        {medicine.batchNumber || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-900">
        {formatCurrency(medicine.salePrice)}
      </td>
      <td className="px-4 py-4">
        <p className="mb-2 text-base font-bold leading-none text-slate-950">
          {medicine.stockQuantity}
        </p>
        <StockStatusBadge status={medicine.stockStatus} />
      </td>
      <td className="px-4 py-4">
        <p className="mb-2 whitespace-nowrap text-xs font-medium text-slate-600">
          {formatDate(medicine.expiryDate)}
        </p>
        <ExpiryStatusBadge status={medicine.expiryStatus} />
        <p className="mt-1 text-[11px] text-slate-400">
          {getDaysUntilExpiryText(medicine.daysUntilExpiry)}
        </p>
      </td>
      <td className="px-4 py-4">
        <MedicineStatusBadge status={medicine.status} />
      </td>
      <td className="px-4 py-4">
        <div className="flex justify-end gap-0.5 rounded-xl bg-slate-50 p-1 ring-1 ring-slate-200/80">
          <IconButton
            label={`View ${medicine.medicineName}`}
            onClick={() => onView(medicine)}
          >
            <Eye className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={`Edit ${medicine.medicineName}`}
            onClick={() => onEdit(medicine)}
          >
            <Pencil className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={`${medicine.status === "active" ? "Deactivate" : "Activate"} ${medicine.medicineName}`}
            onClick={() => onStatus(medicine)}
          >
            <Power className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={`Delete ${medicine.medicineName}`}
            onClick={() => onDelete(medicine)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </td>
    </tr>
  );
}
