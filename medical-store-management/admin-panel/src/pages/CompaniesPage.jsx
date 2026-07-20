import { Plus, RefreshCw } from "lucide-react";
import CompanyDeleteDialog from "../components/companies/CompanyDeleteDialog";
import CompanyDetailsModal from "../components/companies/CompanyDetailsModal";
import CompanyFilters from "../components/companies/CompanyFilters";
import CompanyForm from "../components/companies/CompanyForm";
import CompanyTable from "../components/companies/CompanyTable";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ErrorState from "../components/ui/ErrorState";
import Modal from "../components/ui/Modal";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import Toast from "../components/ui/Toast";
import useCompanies from "../hooks/useCompanies";
import { formatNumber } from "../utils/formatters";

export default function CompaniesPage() {
  const state = useCompanies();
  const {
    companies,
    pagination,
    filters,
    isLoading,
    isRefreshing,
    error,
    selectedCompany,
    modals,
    mutation,
    isDetailsLoading,
    toast,
    refreshCompanies,
    setSearch,
    setStatus,
    setSort,
    setPage,
    clearFilters,
    openCreateModal,
    openEditModal,
    openDetailsModal,
    openDeleteModal,
    openStatusModal,
    closeModals,
    createCompany,
    updateCompany,
    updateStatus,
    deleteCompany,
    clearToast,
  } = state;
  const filtered = Boolean(
    filters.search ||
    filters.status ||
    filters.sortBy !== "created_at" ||
    filters.sortDirection !== "desc",
  );
  const activating = selectedCompany?.nextStatus === "active";
  return (
    <div className="space-y-6">
      <PageHeader
        title="Medicine Companies"
        description="Manage pharmaceutical companies and manufacturers linked with medicines."
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" /> Add Company
          </Button>
        }
      />
      <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.04)]">
        <CompanyFilters
          filters={filters}
          onSearch={setSearch}
          onStatus={setStatus}
          onSort={setSort}
          onClear={clearFilters}
        />
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">
              {formatNumber(pagination.totalRecords)}
            </span>{" "}
            {pagination.totalRecords === 1 ? "company" : "companies"}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={refreshCompanies}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />{" "}
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        {error && !companies.length && !isLoading ? (
          <div className="p-5">
            <ErrorState
              title="Unable to load companies."
              description="Check your connection and try again."
              onRetry={refreshCompanies}
            />
          </div>
        ) : (
          <CompanyTable
            companies={companies}
            isLoading={isLoading}
            hasFilters={filtered}
            actions={{
              onView: openDetailsModal,
              onEdit: openEditModal,
              onStatus: openStatusModal,
              onDelete: openDeleteModal,
            }}
          />
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>
      <Modal
        isOpen={modals.create}
        onClose={closeModals}
        title="Add Company"
        description="Register a pharmaceutical company or manufacturer."
        size="lg"
      >
        <CompanyForm
          onSubmit={createCompany}
          onCancel={closeModals}
          isSaving={mutation === "create"}
        />
      </Modal>
      <Modal
        isOpen={modals.edit}
        onClose={closeModals}
        title="Edit Company"
        description="Update company and contact information."
        size="lg"
      >
        <CompanyForm
          company={selectedCompany}
          onSubmit={updateCompany}
          onCancel={closeModals}
          isSaving={mutation === "update"}
        />
      </Modal>
      <CompanyDetailsModal
        company={selectedCompany}
        isOpen={modals.details}
        onClose={closeModals}
        isLoading={isDetailsLoading}
      />
      <CompanyDeleteDialog
        company={selectedCompany}
        isOpen={modals.delete}
        onClose={closeModals}
        onConfirm={deleteCompany}
        isDeleting={mutation === "delete"}
      />
      <ConfirmDialog
        isOpen={modals.status}
        onClose={closeModals}
        onConfirm={updateStatus}
        title={`${activating ? "Activate" : "Deactivate"} company?`}
        description={
          activating
            ? "The company will become available for medicine selection."
            : "The company will no longer be available for new active medicine selections. Existing linked medicines will remain unchanged."
        }
        confirmLabel={activating ? "Activate Company" : "Deactivate Company"}
        variant={activating ? "primary" : "danger"}
        isLoading={mutation === "status"}
      />
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
