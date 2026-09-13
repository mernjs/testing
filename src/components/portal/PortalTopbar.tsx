"use client";

import PortalMobileSidebar from "@/components/portal/PortalMobileSidebar";
import PortalNotificationsBell, { type BellItem } from "@/components/portal/PortalNotificationsBell";
import LeadSwitcher, { type LeadSummary } from "@/components/portal/LeadSwitcher";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { PORTAL_ROLE_META, type PortalRole } from "@/lib/portal-roles";

export default function PortalTopbar({
  role,
  displayName,
  notifications,
  unread,
  leads = [],
}: {
  role: PortalRole;
  displayName: string;
  notifications: BellItem[];
  unread: number;
  leads?: LeadSummary[];
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <PortalMobileSidebar role={role} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{PORTAL_ROLE_META[role].portalName}</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {displayName}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <LeadSwitcher leads={leads} />
        <PortalNotificationsBell items={notifications} unread={unread} />
        <ThemeToggle />
      </div>
    </header>
  );
}
