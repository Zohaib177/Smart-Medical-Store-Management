import { createContext, useEffect, useMemo, useState } from 'react';

export const SidebarContext = createContext(null);

const STORAGE_KEY = 'medical-store-sidebar-collapsed';

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    if (!isMobileOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  const value = useMemo(() => ({
    isCollapsed,
    isMobileOpen,
    toggleCollapsed: () => setIsCollapsed((current) => !current),
    setCollapsed: setIsCollapsed,
    openMobileSidebar: () => setIsMobileOpen(true),
    closeMobileSidebar: () => setIsMobileOpen(false),
    toggleMobileSidebar: () => setIsMobileOpen((current) => !current),
  }), [isCollapsed, isMobileOpen]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
