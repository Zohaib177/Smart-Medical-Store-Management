import { ClipboardList, Download, RefreshCw, Warehouse } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import Pagination from "../components/ui/Pagination";
import Toast from "../components/ui/Toast";
import InventorySummaryCards from "../components/inventory/InventorySummaryCards";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryHistoryFilters from "../components/inventory/InventoryHistoryFilters";
import InventoryHistoryTable from "../components/inventory/InventoryHistoryTable";
import StockAdjustmentModal from "../components/inventory/StockAdjustmentModal";
import MedicineHistoryModal from "../components/inventory/MedicineHistoryModal";
import useInventory from "../hooks/useInventory";
import { formatCurrency } from "../utils/formatters";
function exportCurrentPage(items) {
  const headers = [
    "Medicine",
    "Generic Name",
    "Category",
    "Company",
    "Batch",
    "Barcode",
    "Purchase Price",
    "Current Stock",
    "Minimum Stock",
    "Stock Status",
    "Expiry Date",
    "Inventory Value",
  ];
  const rows = items.map((x) => [
    x.medicineName,
    x.genericName,
    x.category?.categoryName,
    x.company?.companyName,
    x.batchNumber,
    x.barcode,
    x.purchasePrice,
    x.stockQuantity,
    x.minimumStock,
    x.stockStatus,
    x.expiryDate,
    x.inventoryValue,
  ]);
  const escape = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const csv = [headers, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventory-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
export default function InventoryPage() {
  const s = useInventory();
  const inventoryFiltered = Boolean(
    s.inventoryFilters.search ||
    s.inventoryFilters.status ||
    s.inventoryFilters.categoryId ||
    s.inventoryFilters.companyId ||
    s.inventoryFilters.stockStatus ||
    s.inventoryFilters.expiryStatus,
  );
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Monitor stock levels, expiry risks and medicine stock adjustments."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => exportCurrentPage(s.inventory)}
              disabled={!s.inventory.length}
            >
              <Download className="h-4 w-4" /> Export Current Page
            </Button>
            <Button
              variant="secondary"
              onClick={
                s.activeTab === "inventory"
                  ? s.refreshInventory
                  : s.refreshHistory
              }
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        }
      />
      {s.errors.summary ? (
        <ErrorState
          title="Unable to load inventory summary"
          description="Summary cards could not be loaded."
          onRetry={s.fetchSummary}
        />
      ) : (
        <InventorySummaryCards
          summary={s.summary}
          isLoading={s.isLoadingSummary}
        />
      )}
      <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.04)]">
        <div
          className="flex border-b border-slate-200 p-2"
          role="tablist"
          aria-label="Inventory views"
        >
          <button
            type="button"
            role="tab"
            aria-selected={s.activeTab === "inventory"}
            onClick={() => s.setActiveTab("inventory")}
            className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold sm:flex-none ${s.activeTab === "inventory" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Warehouse className="h-4 w-4" />
            Current Inventory
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={s.activeTab === "history"}
            onClick={() => s.setActiveTab("history")}
            className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold sm:flex-none ${s.activeTab === "history" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <ClipboardList className="h-4 w-4" />
            Inventory History
          </button>
        </div>
        {s.activeTab === "inventory" ? (
          <>
            <InventoryFilters
              filters={s.inventoryFilters}
              options={s.options}
              onChange={s.changeInventoryFilter}
              onClear={s.clearInventoryFilters}
            />
            <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-500">
              <span>
                <strong className="text-slate-800">
                  {s.inventoryPagination.totalRecords}
                </strong>{" "}
                medicines · Page value{" "}
                {formatCurrency(
                  s.inventory.reduce((sum, x) => sum + x.inventoryValue, 0),
                )}
              </span>
            </div>
            {s.errors.inventory && !s.inventory.length ? (
              <div className="p-5">
                <ErrorState
                  title="Unable to load inventory"
                  description="Check the API connection and retry."
                  onRetry={s.fetchInventory}
                />
              </div>
            ) : (
              <InventoryTable
                items={s.inventory}
                isLoading={s.isLoadingInventory}
                hasFilters={inventoryFiltered}
                onAdjust={s.openAdjustmentModal}
                onHistory={s.openMedicineHistoryModal}
              />
            )}
            <Pagination
              pagination={s.inventoryPagination}
              onPageChange={s.setInventoryPage}
            />
          </>
        ) : (
          <>
            <InventoryHistoryFilters
              filters={s.historyFilters}
              medicines={s.inventory}
              onChange={s.changeHistoryFilter}
              onClear={s.clearHistoryFilters}
            />
            {s.errors.history && !s.history.length ? (
              <div className="p-5">
                <ErrorState
                  title="Unable to load inventory history"
                  description="Check the selected filters and retry."
                  onRetry={s.fetchHistory}
                />
              </div>
            ) : (
              <InventoryHistoryTable
                items={s.history}
                isLoading={s.isLoadingHistory}
                onMedicineHistory={s.openMedicineHistoryModal}
              />
            )}
            <Pagination
              pagination={s.historyPagination}
              onPageChange={s.setHistoryPage}
            />
          </>
        )}
      </section>
      <StockAdjustmentModal
        medicine={s.selectedMedicine}
        isOpen={s.modals.adjustment}
        onClose={s.closeModals}
        onSubmit={s.adjustStock}
        isSaving={s.isAdjusting}
      />
      <MedicineHistoryModal
        isOpen={s.modals.history}
        onClose={s.closeModals}
        result={s.selectedMedicineHistory}
        filters={s.medicineHistoryFilters}
        pagination={s.medicineHistoryPagination}
        isLoading={s.isLoadingMedicineHistory}
        error={s.errors.medicineHistory}
        onFilterChange={s.changeMedicineHistoryFilter}
        onPageChange={s.setMedicineHistoryPage}
        onRetry={s.fetchMedicineHistory}
      />
      <Toast toast={s.toast} onClose={() => s.setToast(null)} />
    </div>
  );
}
