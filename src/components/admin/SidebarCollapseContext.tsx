"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "admin-sidebar-collapsed";

interface SidebarCollapseContextValue {
  collapsed: boolean;
  toggle: () => void;
  /** False until the post-mount localStorage read completes — used to skip the
   * width-collapse spring animation on first paint so it doesn't visibly snap. */
  hydrated: boolean;
}

const SidebarCollapseContext = createContext<SidebarCollapseContextValue | null>(null);

export function SidebarCollapseProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reads localStorage post-mount (client-only) so the server-rendered/first-paint
    // markup always matches (expanded), avoiding a hydration mismatch.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // localStorage unavailable — default to expanded.
    }
    setHydrated(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Non-fatal — collapse state just won't persist across reloads.
      }
      return next;
    });
  }

  return (
    <SidebarCollapseContext.Provider value={{ collapsed, toggle, hydrated }}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}

export function useSidebarCollapse(): SidebarCollapseContextValue {
  const ctx = useContext(SidebarCollapseContext);
  if (!ctx) throw new Error("useSidebarCollapse must be used within a SidebarCollapseProvider");
  return ctx;
}
