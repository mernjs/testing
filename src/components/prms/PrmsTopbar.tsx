"use client";

import Link from "next/link";
import { Users, LayoutGrid, FolderKanban, GraduationCap, Globe, MessagesSquare, ShieldCheck, LayoutDashboard } from "lucide-react";
import PrmsMobileSidebar from "@/components/prms/PrmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PrmsNotificationsBell, { type BellItem } from "@/components/prms/PrmsNotificationsBell";
import { buttonVariants } from "@/components/ui/button";
import { primaryPrmsRoleLabel, type PrmsRole } from "@/lib/prms-roles";
import { normalizeRoles } from "@/lib/hrms-roles";
import { normalizePmsRoles } from "@/lib/pms-roles";
import { normalizeTmsRoles } from "@/lib/tms-roles";
import { normalizeChatRoles } from "@/lib/messenger-roles";

export default function PrmsTopbar({
  roles,
  allRoles,
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
  const isSuperAdmin = roles.includes("super_admin");
  const hasHrms = normalizeRoles(allRoles).length > 0;
  const hasPms = normalizePmsRoles(allRoles).length > 0;
  const hasTms = normalizeTmsRoles(allRoles).length > 0;
  const hasMessenger = normalizeChatRoles(allRoles).length > 0;
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <PrmsMobileSidebar roles={roles} permissionOverrides={permissionOverrides} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Procurement &amp; Expense</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryPrmsRoleLabel(roles)}</p>
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
        {hasHrms && (
          <Link
            href="/hrms"
            className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
            aria-label="Open HRMS"
          >
            <Users className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">HRMS</span>
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
            className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
            aria-label="Open TMS"
          >
            <GraduationCap className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">TMS</span>
          </Link>
        )}
        <Link
          href="/lms"
          className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
          aria-label="Open LMS"
        >
          <LayoutGrid className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">LMS</span>
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
          aria-label="Visit website"
        >
          <Globe className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">Website</span>
        </a>
        <ThemeToggle />
        <PrmsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
