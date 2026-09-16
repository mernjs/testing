"use client";

import PrmsMobileSidebar from "@/components/prms/PrmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PrmsNotificationsBell, { type BellItem } from "@/components/prms/PrmsNotificationsBell";
import { primaryPrmsRoleLabel, type PrmsRole } from "@/lib/prms-roles";

export default function PrmsTopbar({
  roles,
  permissionOverrides,
  notifications,
  unread,
}: {
  roles: PrmsRole[];
  allRoles: string[];
  permissionOverrides?: Record<string, boolean>;
  notifications: BellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <PrmsMobileSidebar roles={roles} permissionOverrides={permissionOverrides} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Procurement &amp; Expense</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryPrmsRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <PrmsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
