"use client";

import Link from "next/link";
import { Search, Users, FolderKanban } from "lucide-react";
import MessengerMobileSidebar from "@/components/messenger/MessengerMobileSidebar";
import MessengerNotificationsBell, { type BellItem } from "@/components/messenger/MessengerNotificationsBell";
import { ConnectionPill } from "@/components/messenger/ConnectionPill";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { primaryChatRoleLabel, hasChatStaffRole, type ChatRole } from "@/lib/messenger-roles";

export default function MessengerTopbar({
  roles,
  notifications,
  unread,
  unreadDms,
  unreadChannels,
}: {
  roles: ChatRole[];
  notifications: BellItem[];
  unread: number;
  unreadDms: number;
  unreadChannels: number;
}) {
  const staff = hasChatStaffRole(roles);
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
          href="/messenger/search"
          className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}
          aria-label="Search"
        >
          <Search className="size-3.5" data-icon="inline-start" />
          <span className="hidden md:inline">Search</span>
        </Link>

        {staff && (
          <>
            <Link
              href="/pms"
              className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
              aria-label="Open PMS"
            >
              <FolderKanban className="size-3.5" data-icon="inline-start" />
              <span className="hidden sm:inline">PMS</span>
            </Link>
            <Link
              href="/hrms"
              className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
              aria-label="Open HRMS"
            >
              <Users className="size-3.5" data-icon="inline-start" />
              <span className="hidden sm:inline">HRMS</span>
            </Link>
          </>
        )}

        <MessengerNotificationsBell items={notifications} unread={unread} />
        <ThemeToggle />
      </div>
    </header>
  );
}
