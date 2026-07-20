import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { getMedicineSortValue } from "../../utils/medicineHelpers";
import Button from "../ui/Button";
import SearchInput from "../ui/SearchInput";
import SelectInput from "../ui/SelectInput";
const status = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];
const stock = [
  { value: "", label: "All stock" },
  { value: "inStock", label: "In stock" },
  { value: "lowStock", label: "Low stock" },
  { value: "outOfStock", label: "Out of stock" },
];
const expiry = [
  { value: "", label: "All expiry" },
  { value: "valid", label: "Valid" },
  { value: "expiringSoon", label: "Expiring soon" },
  { value: "expired", label: "Expired" },
  { value: "unknown", label: "No expiry date" },
];
const sorts = [
  { value: "created_at:desc", label: "Newest" },
  { value: "created_at:asc", label: "Oldest" },
  { value: "medicine_name:asc", label: "Name A–Z" },
  { value: "medicine_name:desc", label: "Name Z–A" },
  { value: "stock_quantity:asc", label: "Lowest stock" },
  { value: "stock_quantity:desc", label: "Highest stock" },
  { value: "expiry_date:asc", label: "Earliest expiry" },
  { value: "expiry_date:desc", label: "Latest expiry" },
  { value: "sale_price:asc", label: "Lowest sale price" },
  { value: "sale_price:desc", label: "Highest sale price" },
];
export default function MedicineFilters({ filters, options, handlers }) {
  const changed =
    filters.search ||
    filters.status ||
    filters.categoryId ||
    filters.companyId ||
    filters.stockStatus ||
    filters.expiryStatus ||
    getMedicineSortValue(filters) !== "created_at:desc";
  const categories = [
    { value: "", label: "All categories" },
    ...options.categories.map((x) => ({
      value: String(x.id),
      label: x.categoryName,
    })),
  ];
  const companies = [
    { value: "", label: "All companies" },
    ...options.companies.map((x) => ({
      value: String(x.id),
      label: x.companyName,
    })),
  ];
  return (
    <div className="space-y-4 border-b border-slate-200 bg-slate-50/45 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700 ring-1 ring-emerald-100">
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">Filter medicines</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Narrow the catalog by product, stock or expiry.
          </p>
        </div>
      </div>
      <SearchInput
        value={filters.search}
        onChange={handlers.setSearch}
        placeholder="Search medicine, generic, barcode, batch, category..."
        label="Search medicines"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SelectInput
          label="Status"
          value={filters.status}
          onChange={handlers.setStatus}
          options={status}
        />
        <SelectInput
          label="Category"
          value={filters.categoryId}
          onChange={handlers.setCategory}
          options={categories}
        />
        <SelectInput
          label="Company"
          value={filters.companyId}
          onChange={handlers.setCompany}
          options={companies}
        />
        <SelectInput
          label="Stock status"
          value={filters.stockStatus}
          onChange={handlers.setStockStatus}
          options={stock}
        />
        <SelectInput
          label="Expiry status"
          value={filters.expiryStatus}
          onChange={handlers.setExpiryStatus}
          options={expiry}
        />
        <SelectInput
          label="Sort medicines"
          value={getMedicineSortValue(filters)}
          onChange={handlers.setSort}
          options={sorts}
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlers.clearFilters}
          disabled={!changed}
        >
          <RotateCcw className="h-4 w-4" /> Clear filters
        </Button>
      </div>
    </div>
  );
}
