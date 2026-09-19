"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ShoppingCart,
  GraduationCap,
  MessagesSquare,
  LayoutGrid,
  Landmark,
  ShieldCheck,
  BarChart3,
  KeyRound,
  Globe,
  ExternalLink,
} from "lucide-react";
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
  external = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  collapsed?: boolean;
  external?: boolean;
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
      {!collapsed && <span className="relative truncate flex-1">{label}</span>}
      {!collapsed && external && <ExternalLink className="relative size-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />}
    </>
  );

  const link = (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active ? "text-primary font-semibold" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
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

export default function HubSidebar({
  roles = [],
  onNavigate,
  collapsed = false,
}: {
  roles?: string[];
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const nav = (props: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean; external?: boolean }) => (
    <NavLink {...props} collapsed={collapsed} onNavigate={onNavigate} />
  );

  // Strict workspace role access checks for employees
  const hasHrms = normalizeRoles(roles).length > 0;
  const hasPms = normalizePmsRoles(roles).length > 0;
  const hasPrms = normalizePrmsRoles(roles).length > 0;
  const hasTms = normalizeTmsRoles(roles).length > 0;
  const hasFms = normalizeFmsRoles(roles).length > 0;
  const hasChat = normalizeChatRoles(roles).length > 0;
  const hasAdmin = normalizeAdminRoles(roles).length > 0;

  return (
    <nav className="flex h-full flex-col gap-1 p-3 overflow-y-auto">
      {nav({ href: "/workspace", label: "Dashboard", icon: LayoutDashboard, exact: true })}

      {/* Panel Analytics Links — Strictly filtered to employee workspace access */}
      <SectionLabel collapsed={collapsed}>Panel Analytics</SectionLabel>
      {(hasFms || hasAdmin) && nav({ href: "/workspace/analytics/fms", label: "Finance Analytics", icon: Landmark })}
      {(hasHrms || hasAdmin) && nav({ href: "/workspace/analytics/hrms", label: "HR Analytics", icon: Users })}
      {nav({ href: "/workspace/analytics/lms", label: "Lead Analytics", icon: LayoutGrid })}
      {(hasChat || hasAdmin) && nav({ href: "/workspace/analytics/messenger", label: "Messenger Analytics", icon: MessagesSquare })}
      {(hasPms || hasAdmin) && nav({ href: "/workspace/analytics/pms", label: "Project Analytics", icon: FolderKanban })}
      {hasAdmin && nav({ href: "/workspace/analytics/portal", label: "Portal Analytics", icon: Globe })}
      {(hasPrms || hasAdmin) && nav({ href: "/workspace/analytics/prms", label: "Procurement Analytics", icon: ShoppingCart })}
      {(hasTms || hasAdmin) && nav({ href: "/workspace/analytics/tms", label: "Training Analytics", icon: GraduationCap })}
      {nav({ href: "/workspace/analytics/workspace", label: "Workspace Analytics", icon: BarChart3 })}

      {/* Account Settings */}
      <SectionLabel collapsed={collapsed}>Account</SectionLabel>
      {nav({ href: "/workspace/change-password", label: "Change Password", icon: KeyRound })}
    </nav>
  );
}
