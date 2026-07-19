import Button from './Button';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirm', variant = 'primary', isLoading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} title={title} size="sm">
      <div className="px-5 py-5 sm:px-6">
        <p className="text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm} disabled={isLoading}>{isLoading ? 'Please wait...' : confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  );
}
