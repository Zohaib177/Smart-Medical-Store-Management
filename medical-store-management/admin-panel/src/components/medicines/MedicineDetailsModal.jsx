import {
  formatCurrency,
  formatDateTime,
  formatDate,
} from "../../utils/formatters";
import { getDaysUntilExpiryText } from "../../utils/medicineHelpers";
import LoadingCard from "../ui/LoadingCard";
import Modal from "../ui/Modal";
import ExpiryStatusBadge from "./ExpiryStatusBadge";
import MedicineImagePreview from "./MedicineImagePreview";
import MedicineStatusBadge from "./MedicineStatusBadge";
import StockStatusBadge from "./StockStatusBadge";
export default function MedicineDetailsModal({
  medicine,
  isOpen,
  onClose,
  isLoading,
}) {
  const value = (x) =>
    x === null || x === undefined || x === "" ? "Not provided" : x;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Medicine Details"
      description="Pricing, stock, product and expiry information."
      size="lg"
    >
      <div className="bg-slate-50/40 px-5 py-5 sm:px-6 sm:py-6">
        {isLoading ? (
          <LoadingCard />
        ) : (
          medicine && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-5 text-white shadow-lg shadow-emerald-950/10">
                <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full border-[24px] border-white/[0.04]" />
                <div className="relative flex items-start gap-4">
                  <MedicineImagePreview
                    src={medicine.imageUrl}
                    alt={medicine.medicineName}
                    className="h-20 w-20"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold tracking-[-0.025em] text-white">
                      {medicine.medicineName}
                    </h3>
                    <p className="mt-1 text-sm text-emerald-100/75">
                      {value(medicine.genericName)}
                      {medicine.strength ? ` · ${medicine.strength}` : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 rounded-xl bg-white/95 p-2">
                      <MedicineStatusBadge status={medicine.status} />
                      <StockStatusBadge status={medicine.stockStatus} />
                      <ExpiryStatusBadge status={medicine.expiryStatus} />
                    </div>
                  </div>
                </div>
              </div>
              <Group title="Classification">
                <Details
                  items={[
                    ["Category", medicine.category.categoryName],
                    ["Company", medicine.company.companyName],
                    ["Dosage form", value(medicine.dosageForm)],
                    ["Strength", value(medicine.strength)],
                  ]}
                />
              </Group>
              <Group title="Product information">
                <Details
                  items={[
                    ["Batch number", value(medicine.batchNumber)],
                    ["Barcode", value(medicine.barcode)],
                    [
                      "Prescription required",
                      medicine.prescriptionRequired ? "Yes" : "No",
                    ],
                    ["Image URL", value(medicine.imageUrl)],
                  ]}
                />
                <Detail
                  label="Description"
                  value={value(medicine.description)}
                />
              </Group>
              <Group title="Pricing and stock">
                <Details
                  items={[
                    ["Purchase price", formatCurrency(medicine.purchasePrice)],
                    ["Sale price", formatCurrency(medicine.salePrice)],
                    ["Stock quantity", medicine.stockQuantity],
                    ["Minimum stock", medicine.minimumStock],
                  ]}
                />
              </Group>
              <Group title="Dates and expiry">
                <Details
                  items={[
                    [
                      "Manufacturing date",
                      formatDate(medicine.manufacturingDate),
                    ],
                    ["Expiry date", formatDate(medicine.expiryDate)],
                    [
                      "Expiry timeline",
                      getDaysUntilExpiryText(medicine.daysUntilExpiry),
                    ],
                    ["Created", formatDateTime(medicine.createdAt)],
                    ["Last updated", formatDateTime(medicine.updatedAt)],
                  ]}
                />
              </Group>
            </div>
          )
        )}
      </div>
    </Modal>
  );
}
function Group({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-emerald-700 before:h-1.5 before:w-1.5 before:rounded-full before:bg-emerald-500">
        {title}
      </h4>
      {children}
    </section>
  );
}
function Details({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <Detail key={label} label={label} value={value} />
      ))}
    </div>
  );
}
function Detail({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1.5 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
