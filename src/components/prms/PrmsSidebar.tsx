"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Building2,
  FileSpreadsheet,
  ShoppingCart,
  PackageCheck,
  Receipt,
  Boxes,
  Package,
  Server,
  Cloud,
  Handshake,
  ScrollText,
  FileCheck2,
  Wallet,
  PiggyBank,
  BarChart3,
  Settings,
  CircleUser,
  Bell,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { PrmsRole } from "@/lib/prms-roles";
import {
  canManageSettings,
  canViewAuditLog,
  canViewReports,
  canManageFinance,
  hasPrmsStaffRole,
} from "@/lib/prms-roles";

function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  collapsed = false,
  soon = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  collapsed?: boolean;
  soon?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname?.startsWith(href);

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="prms-nav-active"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/15 to-secondary/10"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className="relative size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      {!collapsed && <span className="relative truncate">{label}</span>}
      {!collapsed && soon && (
        <Lock className="relative ml-auto size-3 text-muted-foreground/60" aria-label="Coming soon" />
      )}
    </>
  );

  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active ? "text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
    >
      {inner}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return <div className="mt-4 mb-1 border-t border-border/50" />;
  return (
    <div className="mt-4 mb-1 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{children}</div>
  );
}

export default function PrmsSidebar({
  roles,
  permissionOverrides,
  onNavigate,
  collapsed = false,
}: {
  roles: PrmsRole[];
  permissionOverrides?: Record<string, boolean>;
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const roleCtx = { roles, permissionOverrides };
  const nav = (props: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
    soon?: boolean;
  }) => <NavLink {...props} collapsed={collapsed} onNavigate={onNavigate} />;

  const isStaff = hasPrmsStaffRole(roles);

  // Employee self-service portal.
  if (!isStaff) {
    return (
      <nav className="flex h-full flex-col gap-1 p-3">
        {nav({ href: "/prms/me", label: "My Dashboard", icon: LayoutDashboard, exact: true })}
        {nav({ href: "/prms/me/requisitions", label: "My Requisitions", icon: FileText })}
        {nav({ href: "/prms/me/expenses", label: "My Expenses", icon: Receipt })}
      </nav>
    );
  }

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      {nav({ href: "/prms", label: "Dashboard", icon: LayoutDashboard, exact: true })}

      <SectionLabel collapsed={collapsed}>Purchasing</SectionLabel>
      {nav({ href: "/prms/procurement", label: "Procurement Hub", icon: ShoppingCart })}
      {nav({ href: "/prms/purchase-orders", label: "Purchase Orders", icon: FileText })}
      {nav({ href: "/prms/vendors", label: "Vendors", icon: Building2 })}

      <SectionLabel collapsed={collapsed}>Expenses</SectionLabel>
      {nav({ href: "/prms/expenses", label: "Expense Claims", icon: Receipt })}

      <SectionLabel collapsed={collapsed}>Assets & Office</SectionLabel>
      {nav({ href: "/prms/assets", label: "Hardware Assets", icon: Boxes })}
      {nav({ href: "/prms/inventory", label: "Office Inventory", icon: Package })}

      <SectionLabel collapsed={collapsed}>Subscriptions</SectionLabel>
      {nav({ href: "/prms/subscriptions", label: "Software & SaaS", icon: Cloud })}
      {nav({ href: "/prms/infrastructure", label: "Cloud & Servers", icon: Server })}

      <SectionLabel collapsed={collapsed}>Reports & Workspace</SectionLabel>
      {canViewReports(roleCtx) && nav({ href: "/prms/reports", label: "Spend Analytics", icon: BarChart3 })}
      {nav({ href: "/prms/me", label: "My Requisitions", icon: CircleUser, exact: true })}
      {canManageSettings(roleCtx) && nav({ href: "/prms/settings", label: "Settings", icon: Settings })}
    </nav>
  );
}
