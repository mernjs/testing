"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FolderKanban, ShoppingCart, GraduationCap, MessagesSquare, LayoutGrid, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  collapsed = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname?.startsWith(href);

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="admin-nav-active"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/15 to-secondary/10"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className="relative size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      {!collapsed && <span className="relative truncate">{label}</span>}
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

/**
 * Flat, panel-level navigation — every deep per-module sub-entity link (CRM
 * leads/clients, PMS projects/tasks/…, TMS/PRMS/YashChat entities, etc.) was
 * removed in favor of one link straight into each panel's own real nav,
 * mirroring how `HubSidebar.tsx` lists panels for every other user. A
 * super_admin always has full access to every panel (every module treats
 * `super_admin` as universal access), so every link here is unconditional —
 * same reasoning `AdminTopbar.tsx`'s own cross-panel links already use.
 */
export default function AdminSidebar({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const nav = (props: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean }) => (
    <NavLink {...props} collapsed={collapsed} onNavigate={onNavigate} />
  );

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      {nav({ href: "/admin", label: "Command Center", icon: LayoutDashboard, exact: true })}
      {nav({ href: "/workspace", label: "Staff Hub", icon: LayoutDashboard })}
      {nav({ href: "/hrms", label: "Human Resources", icon: Users })}
      {nav({ href: "/pms", label: "Project Management", icon: FolderKanban })}
      {nav({ href: "/prms", label: "Procurement", icon: ShoppingCart })}
      {nav({ href: "/tms", label: "Training Management", icon: GraduationCap })}
      {nav({ href: "/messenger", label: "YashChat", icon: MessagesSquare })}
      {nav({ href: "/lms", label: "CRM & Leads", icon: LayoutGrid })}
      {nav({ href: "/admin/users", label: "Users, Roles & Access", icon: ShieldCheck })}
    </nav>
  );
}
