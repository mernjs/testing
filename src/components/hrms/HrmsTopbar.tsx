"use client";

import HrmsMobileSidebar from "@/components/hrms/HrmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import HrmsNotificationsBell, { type BellItem } from "@/components/hrms/HrmsNotificationsBell";
import type { HrmsRole } from "@/lib/hrms-roles";
import { primaryRoleLabel } from "@/lib/hrms-roles";

export default function HrmsTopbar({
  roles,
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
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <HrmsMobileSidebar roles={roles} permissionOverrides={permissionOverrides} employeeId={employeeId} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Human Resources</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <HrmsNotificationsBell items={notifications} unread={unread} basePath="/hrms/notifications" />
      </div>
    </header>
  );
}
