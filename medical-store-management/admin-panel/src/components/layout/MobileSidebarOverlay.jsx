import useSidebar from '../../hooks/useSidebar';

export default function MobileSidebarOverlay() {
  const { isMobileOpen, closeMobileSidebar } = useSidebar();
  if (!isMobileOpen) return null;

  return (
    <button
      type="button"
      aria-label="Close navigation menu"
      onClick={closeMobileSidebar}
      className="fixed inset-0 z-40 bg-slate-950/55 lg:hidden"
    />
  );
}
