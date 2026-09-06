"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserPlus,
  CalendarClock,
  CalendarDays,
  CalendarCheck,
  Wallet,
  ScrollText,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { HrmsRole } from "@/lib/hrms-roles";
import { canViewAuditLog, canManageSettings, canRunPayroll } from "@/lib/hrms-roles";

function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  collapsed = false,
  disabled = false,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  collapsed?: boolean;
  disabled?: boolean;
  badge?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = !disabled && (exact ? pathname === href : pathname?.startsWith(href));

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="hrms-nav-active"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/15 to-secondary/10"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className="relative size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      {!collapsed && <span className="relative truncate">{label}</span>}
      {!collapsed && badge && (
        <span className="relative ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {badge}
        </span>
      )}
    </>
  );

  if (disabled) {
    const node = (
      <span
        aria-disabled
        className={cn(
          "group relative flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/50",
          collapsed && "justify-center px-0"
        )}
      >
        {inner}
      </span>
    );
    if (!collapsed) return node;
    return (
      <Tooltip>
        <TooltipTrigger render={node} />
        <TooltipContent side="right">{label} · Phase 2</TooltipContent>
      </Tooltip>
    );
  }

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

export default function HrmsSidebar({
  roles,
  onNavigate,
  collapsed = false,
}: {
  roles: HrmsRole[];
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <NavLink href="/hrms" label="Dashboard" icon={LayoutDashboard} exact collapsed={collapsed} onNavigate={onNavigate} />

      <SectionLabel collapsed={collapsed}>People</SectionLabel>
      <NavLink href="/hrms/employees" label="Employees" icon={Users} collapsed={collapsed} onNavigate={onNavigate} />
      <NavLink href="/hrms/departments" label="Departments & Teams" icon={Building2} collapsed={collapsed} onNavigate={onNavigate} />
      <NavLink href="/hrms/recruitment" label="Recruitment" icon={UserPlus} collapsed={collapsed} onNavigate={onNavigate} />

      <SectionLabel collapsed={collapsed}>Operations</SectionLabel>
      <NavLink href="/hrms/attendance" label="Attendance" icon={CalendarClock} collapsed={collapsed} onNavigate={onNavigate} />
      <NavLink href="/hrms/leave" label="Leave" icon={CalendarDays} collapsed={collapsed} onNavigate={onNavigate} />
      <NavLink href="/hrms/holidays" label="Holidays" icon={CalendarCheck} collapsed={collapsed} onNavigate={onNavigate} />
      {canRunPayroll(roles) && (
        <NavLink href="/hrms/payroll" label="Payroll" icon={Wallet} collapsed={collapsed} onNavigate={onNavigate} />
      )}

      <SectionLabel collapsed={collapsed}>Governance</SectionLabel>
      <NavLink href="/hrms/notifications" label="Notifications" icon={Bell} collapsed={collapsed} onNavigate={onNavigate} />
      {canManageSettings(roles) && (
        <NavLink href="/hrms/settings" label="Settings" icon={Settings} collapsed={collapsed} onNavigate={onNavigate} />
      )}
      {canViewAuditLog(roles) && (
        <NavLink href="/hrms/audit" label="Audit Log" icon={ScrollText} collapsed={collapsed} onNavigate={onNavigate} />
      )}
    </nav>
  );
}
