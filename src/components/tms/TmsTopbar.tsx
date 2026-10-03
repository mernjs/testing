"use client";

import TmsMobileSidebar from "@/components/tms/TmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PanelSearch from "@/components/platform/PanelSearch";
import TmsNotificationsBell, { type BellItem } from "@/components/tms/TmsNotificationsBell";
import { primaryTmsRoleLabel, type TmsRole } from "@/lib/tms-roles";

export default function TmsTopbar({
  roles,
  permissionOverrides,
  studentId,
  notifications,
  unread,
}: {
  roles: TmsRole[];
  allRoles: string[];
  permissionOverrides?: Record<string, boolean>;
  studentId: string | null;
  notifications: BellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <TmsMobileSidebar roles={roles} permissionOverrides={permissionOverrides} studentId={studentId} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Training Management</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryTmsRoleLabel(roles)}</p>
      </div>
      <div className="flex min-w-0 flex-1 justify-center">
        <PanelSearch />
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <TmsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
