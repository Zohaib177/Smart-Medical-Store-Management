import ConfirmDialog from '../ui/ConfirmDialog';

export default function CompanyDeleteDialog({ company, isOpen, onClose, onConfirm, isDeleting }) {
  return <ConfirmDialog isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} title={`Delete “${company?.companyName || 'company'}”?`} description="Deletion is permanent. A company cannot be deleted while medicines are linked to it; the server will enforce this safety rule." confirmLabel="Delete Company" variant="danger" isLoading={isDeleting} />;
}
