import ConfirmDialog from '../ui/ConfirmDialog';

export default function CategoryDeleteDialog({ category, isOpen, onClose, onConfirm, isDeleting }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete “${category?.categoryName || 'category'}”?`}
      description="Deletion is permanent. A category cannot be deleted when medicines are linked to it; the server will enforce this safety rule."
      confirmLabel="Delete Category"
      variant="danger"
      isLoading={isDeleting}
    />
  );
}
