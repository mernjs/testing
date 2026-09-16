"use client";

import AdminMobileSidebar from "@/components/admin/AdminMobileSidebar";
import AdminNotificationsBell, { type BellItem } from "@/components/admin/AdminNotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { primaryAdminRoleLabel, type AdminRole } from "@/lib/admin-roles";

export default function AdminTopbar({
  roles,
  notifications,
  unread,
}: {
  roles: AdminRole[];
  notifications: BellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <AdminMobileSidebar />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Super Admin Command Center</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryAdminRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <AdminNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
