"use client";

import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SidebarProfileMenu from "@/components/admin/SidebarProfileMenu";
import { useSidebarCollapse } from "@/components/admin/SidebarCollapseContext";
import { brandify } from "@/lib/brand";
import { cn } from "@/lib/utils";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 68;

export default function AdminSidebarShell({
  adminEmail,
  createdAt,
  lastLoginAt,
}: {
  adminEmail: string;
  createdAt: string;
  lastLoginAt: string | null;
}) {
  const { collapsed, toggle, hydrated } = useSidebarCollapse();

  return (
    <motion.aside
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      initial={false}
      transition={hydrated ? { type: "spring", stiffness: 320, damping: 32 } : { duration: 0 }}
      className="hidden shrink-0 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.12)] backdrop-blur-xl md:flex dark:bg-card/40"
    >
      <div
        className={cn(
          "sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-card/70 px-4 backdrop-blur-xl dark:bg-card/40",
          collapsed ? "justify-center gap-1.5 px-2" : "justify-between"
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <BrandMark className="size-6 shrink-0" />
          {!collapsed && (
            <span className="truncate text-sm font-bold">
              {brandify("YashOrbit")} <span className="text-foreground">Admin</span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AdminSidebar collapsed={collapsed} />
      </div>

      <SidebarProfileMenu adminEmail={adminEmail} createdAt={createdAt} lastLoginAt={lastLoginAt} />
    </motion.aside>
  );
}
