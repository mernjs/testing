"use client";

import Link from "next/link";
import { Search, Users, FolderKanban, ShieldCheck, LayoutDashboard } from "lucide-react";
import MessengerMobileSidebar from "@/components/messenger/MessengerMobileSidebar";
import MessengerNotificationsBell, { type BellItem } from "@/components/messenger/MessengerNotificationsBell";
import { ConnectionPill } from "@/components/messenger/ConnectionPill";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { primaryChatRoleLabel, type ChatRole } from "@/lib/messenger-roles";
import { normalizeRoles } from "@/lib/hrms-roles";
import { normalizePmsRoles } from "@/lib/pms-roles";

export default function MessengerTopbar({
  roles,
  allRoles,
  notifications,
  unread,
  unreadDms,
  unreadChannels,
}: {
  roles: ChatRole[];
  allRoles: string[];
  notifications: BellItem[];
  unread: number;
  unreadDms: number;
  unreadChannels: number;
}) {
  const isSuperAdmin = roles.includes("super_admin");
  const hasHrms = normalizeRoles(allRoles).length > 0;
  const hasPms = normalizePmsRoles(allRoles).length > 0;
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <MessengerMobileSidebar
        roles={roles}
        unreadDms={unreadDms}
        unreadChannels={unreadChannels}
        unreadNotifications={unread}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Team Communication</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryChatRoleLabel(roles)}</p>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ConnectionPill />
        <Link
          href="/workspace"
          className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
          aria-label="Open Staff Hub"
        >
          <LayoutDashboard className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">Hub</span>
        </Link>
        {isSuperAdmin && (
          <Link
            href="/admin"
            className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
            aria-label="Back to Admin"
          >
            <ShieldCheck className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        )}
        <Link
          href="/messenger/search"
          className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}
          aria-label="Search"
        >
          <Search className="size-3.5" data-icon="inline-start" />
          <span className="hidden md:inline">Search</span>
        </Link>

        {hasPms && (
          <Link
            href="/pms"
            className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
            aria-label="Open PMS"
          >
            <FolderKanban className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">PMS</span>
          </Link>
        )}
        {hasHrms && (
          <Link
            href="/hrms"
            className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
            aria-label="Open HRMS"
          >
            <Users className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">HRMS</span>
          </Link>
        )}

        <MessengerNotificationsBell items={notifications} unread={unread} />
        <ThemeToggle />
      </div>
    </header>
  );
}
