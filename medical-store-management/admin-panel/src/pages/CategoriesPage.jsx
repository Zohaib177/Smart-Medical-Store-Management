import { Plus, RefreshCw } from 'lucide-react';
import CategoryDeleteDialog from '../components/categories/CategoryDeleteDialog';
import CategoryDetailsModal from '../components/categories/CategoryDetailsModal';
import CategoryFilters from '../components/categories/CategoryFilters';
import CategoryForm from '../components/categories/CategoryForm';
import CategoryTable from '../components/categories/CategoryTable';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorState from '../components/ui/ErrorState';
import Modal from '../components/ui/Modal';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import Toast from '../components/ui/Toast';
import useCategories from '../hooks/useCategories';
import { formatNumber } from '../utils/formatters';

export default function CategoriesPage() {
  const categoryState = useCategories();
  const {
    categories, pagination, filters, isLoading, isRefreshing, error, selectedCategory,
    modals, mutation, isDetailsLoading, toast, refreshCategories, setSearch, setStatus,
    setSort, setPage, clearFilters, openCreateModal, openEditModal, openDetailsModal,
    openDeleteModal, openStatusModal, closeModals, createCategory, updateCategory,
    updateStatus, deleteCategory, clearToast,
  } = categoryState;
  const hasFilters = Boolean(filters.search || filters.status || filters.sortBy !== 'created_at' || filters.sortDirection !== 'desc');
  const activating = selectedCategory?.nextStatus === 'active';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medicine Categories"
        description="Organize medicines into searchable and manageable categories."
        actions={<Button onClick={openCreateModal}><Plus className="h-4 w-4" /> Add Category</Button>}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CategoryFilters filters={filters} onSearch={setSearch} onStatus={setStatus} onSort={setSort} onClear={clearFilters} />
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <p className="text-sm text-slate-500"><span className="font-semibold text-slate-800">{formatNumber(pagination.totalRecords)}</span> {pagination.totalRecords === 1 ? 'category' : 'categories'}</p>
          <Button variant="secondary" size="sm" onClick={refreshCategories} disabled={isRefreshing || isLoading}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {error && !categories.length && !isLoading ? (
          <div className="p-5"><ErrorState title="Unable to load categories." description="Check your connection and try again." onRetry={refreshCategories} /></div>
        ) : (
          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            hasFilters={hasFilters}
            actions={{ onView: openDetailsModal, onEdit: openEditModal, onStatus: openStatusModal, onDelete: openDeleteModal }}
          />
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>

      <Modal isOpen={modals.create} onClose={closeModals} title="Add Category" description="Create a searchable category for medicine records.">
        <CategoryForm onSubmit={createCategory} onCancel={closeModals} isSaving={mutation === 'create'} />
      </Modal>

      <Modal isOpen={modals.edit} onClose={closeModals} title="Edit Category" description="Update the selected category information.">
        <CategoryForm category={selectedCategory} onSubmit={updateCategory} onCancel={closeModals} isSaving={mutation === 'update'} />
      </Modal>

      <CategoryDetailsModal category={selectedCategory} isOpen={modals.details} onClose={closeModals} isLoading={isDetailsLoading} />
      <CategoryDeleteDialog category={selectedCategory} isOpen={modals.delete} onClose={closeModals} onConfirm={deleteCategory} isDeleting={mutation === 'delete'} />
      <ConfirmDialog
        isOpen={modals.status}
        onClose={closeModals}
        onConfirm={updateStatus}
        title={`${activating ? 'Activate' : 'Deactivate'} category?`}
        description={activating ? 'The category will become available for active medicine selections.' : 'Medicines may remain linked, but this category will no longer be available for new active selections.'}
        confirmLabel={activating ? 'Activate Category' : 'Deactivate Category'}
        variant={activating ? 'primary' : 'danger'}
        isLoading={mutation === 'status'}
      />
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
