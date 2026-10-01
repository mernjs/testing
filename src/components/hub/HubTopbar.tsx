"use client";

import type { NavSection } from "@/lib/workspace/nav";
import HubMobileSidebar from "@/components/hub/HubMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import HubSearch from "@/components/platform/hub/HubSearch";
import NotificationBell from "@/components/platform/hub/NotificationBell";

export default function HubTopbar({ email, nav, unread = 0 }: { email: string; nav: NavSection[]; unread?: number }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <HubMobileSidebar nav={nav} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Workspace</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {email}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <HubSearch />
        <NotificationBell initial={unread} />
        <ThemeToggle />
      </div>
    </header>
  );
}
