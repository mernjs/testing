"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FolderKanban,
  ShoppingCart,
  GraduationCap,
  MessagesSquare,
  LayoutGrid,
  Landmark,
  ShieldCheck,
  BarChart3,
  Settings,
  ScrollText,
} from "lucide-react";
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

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return <div className="mt-4 mb-1 border-t border-border/50" />;
  return (
    <div className="mt-4 mb-1 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{children}</div>
  );
}

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
      {nav({ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true })}

      <SectionLabel collapsed={collapsed}>Your Panels</SectionLabel>
      {nav({ href: "/admin/analytics/fms", label: "Finance Analytics", icon: Landmark })}
      {nav({ href: "/admin/analytics/hrms", label: "HR Analytics", icon: Users })}
      {nav({ href: "/admin/analytics/lms", label: "Lead Analytics", icon: LayoutGrid })}
      {nav({ href: "/admin/analytics/messenger", label: "Messenger Analytics", icon: MessagesSquare })}
      {nav({ href: "/admin/analytics/pms", label: "Project Analytics", icon: FolderKanban })}
      {nav({ href: "/admin/analytics/portal", label: "Portal Analytics", icon: UserCheck })}
      {nav({ href: "/admin/analytics/prms", label: "Procurement Analytics", icon: ShoppingCart })}
      {nav({ href: "/admin/analytics/tms", label: "Training Analytics", icon: GraduationCap })}
      {nav({ href: "/admin/analytics/workspace", label: "Workspace Analytics", icon: LayoutDashboard })}

      <SectionLabel collapsed={collapsed}>Administration</SectionLabel>
      {nav({ href: "/admin/users", label: "Users, Roles & Access", icon: ShieldCheck })}

      <SectionLabel collapsed={collapsed}>Governance</SectionLabel>
      {nav({ href: "/admin", label: "Analytics", icon: BarChart3, exact: true })}
      {nav({ href: "/admin/users", label: "Settings", icon: Settings })}
      {nav({ href: "/admin/users", label: "Audit Log", icon: ScrollText })}
    </nav>
  );
}
