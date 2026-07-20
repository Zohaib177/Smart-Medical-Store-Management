import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import IconButton from './IconButton';

export default function Modal({ isOpen, onClose, title, description, children, size = 'md' }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      const focusable = dialogRef.current?.querySelector('input, textarea, select, button, [tabindex]:not([tabindex="-1"])');
      (focusable || dialogRef.current)?.focus();
    }, 0);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-5">
      <button type="button" className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" onClick={onClose} aria-label="Close dialog" />
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`relative max-h-[92vh] w-full overflow-y-auto rounded-t-[26px] border border-white/50 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] outline-none sm:rounded-[22px] ${widths[size] || widths.md}`}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-5 py-5 backdrop-blur sm:px-6">
          <div>
            <h2 id="modal-title" className="text-xl font-bold tracking-[-0.025em] text-slate-950">{title}</h2>
            {description && <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>}
          </div>
          <IconButton label="Close dialog" onClick={onClose} className="-mr-2 -mt-1 shrink-0"><X className="h-5 w-5" /></IconButton>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
