"use client";

import PmsMobileSidebar from "@/components/pms/PmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PmsNotificationsBell, { type BellItem } from "@/components/pms/PmsNotificationsBell";
import { primaryPmsRoleLabel, type PmsRole } from "@/lib/pms-roles";

export default function PmsTopbar({
  roles,
  permissionOverrides,
  employeeId,
  notifications,
  unread,
}: {
  roles: PmsRole[];
  allRoles: string[];
  permissionOverrides?: Record<string, boolean>;
  employeeId: string | null;
  notifications: BellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <PmsMobileSidebar roles={roles} permissionOverrides={permissionOverrides} employeeId={employeeId} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Project Management</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryPmsRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <PmsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
