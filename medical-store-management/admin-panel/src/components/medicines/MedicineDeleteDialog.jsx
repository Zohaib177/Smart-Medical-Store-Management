import ConfirmDialog from "../ui/ConfirmDialog";
export default function MedicineDeleteDialog({
  medicine,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete “${medicine?.medicineName || "medicine"}”?`}
      description="Deletion is permanent. This medicine cannot be deleted if purchase, sale, or inventory records are linked to it."
      confirmLabel="Delete Medicine"
      variant="danger"
      isLoading={isDeleting}
    />
  );
}
