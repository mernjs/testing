"use client";

import Link from "next/link";
import { LayoutGrid, FolderKanban, GraduationCap, MessagesSquare, ShieldCheck, LayoutDashboard } from "lucide-react";
import HrmsMobileSidebar from "@/components/hrms/HrmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import HrmsNotificationsBell, { type BellItem } from "@/components/hrms/HrmsNotificationsBell";
import { buttonVariants } from "@/components/ui/button";
import type { HrmsRole } from "@/lib/hrms-roles";
import { primaryRoleLabel } from "@/lib/hrms-roles";
import { normalizePmsRoles } from "@/lib/pms-roles";
import { normalizeTmsRoles } from "@/lib/tms-roles";
import { normalizeChatRoles } from "@/lib/messenger-roles";

export default function HrmsTopbar({
  roles,
  allRoles,
  permissionOverrides,
  employeeId,
  notifications,
  unread,
}: {
  roles: HrmsRole[];
  allRoles: string[];
  permissionOverrides?: Record<string, boolean>;
  employeeId: string | null;
  notifications: BellItem[];
  unread: number;
}) {
  const isSuperAdmin = roles.includes("super_admin");
  const hasPms = normalizePmsRoles(allRoles).length > 0;
  const hasTms = normalizeTmsRoles(allRoles).length > 0;
  const hasMessenger = normalizeChatRoles(allRoles).length > 0;
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <HrmsMobileSidebar roles={roles} permissionOverrides={permissionOverrides} employeeId={employeeId} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Human Resources</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Link
          href="/workspace"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Open Staff Hub"
        >
          <LayoutDashboard className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">Hub</span>
        </Link>
        {isSuperAdmin && (
          <Link
            href="/admin"
            className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
            aria-label="Back to Admin"
          >
            <ShieldCheck className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        )}
        {hasMessenger && (
          <Link
            href="/messenger"
            className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
            aria-label="Open Messenger"
          >
            <MessagesSquare className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">Messenger</span>
          </Link>
        )}
        {hasPms && (
          <Link
            href="/pms"
            className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
            aria-label="Open PMS"
          >
            <FolderKanban className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">PMS</span>
          </Link>
        )}
        {hasTms && (
          <Link
            href="/tms"
            className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
            aria-label="Open TMS"
          >
            <GraduationCap className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">TMS</span>
          </Link>
        )}
        <Link
          href="/lms"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Open LMS"
        >
          <LayoutGrid className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">LMS</span>
        </Link>
        <ThemeToggle />
        <HrmsNotificationsBell items={notifications} unread={unread} basePath="/hrms/notifications" />
      </div>
    </header>
  );
}
