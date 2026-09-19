"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, UserCheck, FolderKanban, ShoppingCart, GraduationCap, MessagesSquare, LayoutGrid, Landmark, ShieldCheck, BarChart3, Settings, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { normalizeRoles } from "@/lib/hrms-roles";
import { normalizePmsRoles } from "@/lib/pms-roles";
import { normalizePrmsRoles } from "@/lib/prms-roles";
import { normalizeTmsRoles } from "@/lib/tms-roles";
import { normalizeFmsRoles } from "@/lib/fms-roles";
import { normalizeChatRoles } from "@/lib/messenger-roles";
import { normalizeAdminRoles } from "@/lib/admin-roles";

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
          layoutId="hub-nav-active"
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

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return <div className="mt-4 mb-1 border-t border-border/50" />;
  return (
    <div className="mt-4 mb-1 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{children}</div>
  );
}

/**
 * Same shell/nav pattern as `AdminSidebar.tsx`. Hub only ever has one real
 * page of its own (the dashboard) — below it, the "Your Panels" section
 * mirrors exactly the same real-role checks the dashboard's tile grid and
 * `cross-module-sso.ts` use, so this sidebar and the dashboard never
 * disagree about what an account can reach.
 */
export default function HubSidebar({
  roles,
  onNavigate,
  collapsed = false,
}: {
  roles: string[];
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const nav = (props: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean }) => (
    <NavLink {...props} collapsed={collapsed} onNavigate={onNavigate} />
  );

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      {nav({ href: "/workspace", label: "Dashboard", icon: LayoutDashboard, exact: true })}

      <SectionLabel collapsed={collapsed}>Your Panels</SectionLabel>
      {nav({ href: "/hrms/me", label: "User Portal", icon: UserCheck })}
      {normalizeRoles(roles).length > 0 && nav({ href: "/hrms", label: "Human Resources", icon: Users })}
      {normalizePmsRoles(roles).length > 0 && nav({ href: "/pms", label: "Project Management", icon: FolderKanban })}
      {normalizePrmsRoles(roles).length > 0 && nav({ href: "/prms", label: "Procurement", icon: ShoppingCart })}
      {normalizeTmsRoles(roles).length > 0 && nav({ href: "/tms", label: "Training", icon: GraduationCap })}
      {normalizeFmsRoles(roles).length > 0 && nav({ href: "/fms", label: "Finance", icon: Landmark })}
      {normalizeChatRoles(roles).length > 0 && nav({ href: "/messenger", label: "YashChat", icon: MessagesSquare })}
      {nav({ href: "/lms", label: "CRM & Leads", icon: LayoutGrid })}
      {normalizeAdminRoles(roles).length > 0 && nav({ href: "/admin", label: "Super Admin", icon: ShieldCheck })}

      <SectionLabel collapsed={collapsed}>Governance</SectionLabel>
      {nav({ href: "/workspace", label: "Analytics", icon: BarChart3, exact: true })}
      {nav({ href: "/workspace", label: "Settings", icon: Settings })}
      {nav({ href: "/workspace", label: "Audit Log", icon: ScrollText })}
    </nav>
  );
}
