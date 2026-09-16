"use client";

import Link from "next/link";
import { Globe, Users, FolderKanban, GraduationCap, MessagesSquare, ShieldCheck, LayoutDashboard } from "lucide-react";
import MobileSidebar from "@/components/lms/MobileSidebar";
import GlobalSearch from "@/components/lms/GlobalSearch";
import NotificationsBell from "@/components/lms/NotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import type { SerializedLead, SerializedCareerApplication } from "@/components/lms/types";
import { normalizeRoles } from "@/lib/hrms-roles";
import { normalizePmsRoles } from "@/lib/pms-roles";
import { normalizeTmsRoles } from "@/lib/tms-roles";
import { normalizeChatRoles } from "@/lib/messenger-roles";

export default function LmsTopbar({
  roles,
  staleLeads,
  staleLeadsCount,
  staleApplications,
  staleApplicationsCount,
  recentLeads,
  recentApplications,
}: {
  roles: string[];
  staleLeads: SerializedLead[];
  staleLeadsCount: number;
  staleApplications: SerializedCareerApplication[];
  staleApplicationsCount: number;
  recentLeads: SerializedLead[];
  recentApplications: SerializedCareerApplication[];
}) {
  const isSuperAdmin = roles.includes("super_admin");
  const hasHrms = normalizeRoles(roles).length > 0;
  const hasPms = normalizePmsRoles(roles).length > 0;
  const hasTms = normalizeTmsRoles(roles).length > 0;
  const hasMessenger = normalizeChatRoles(roles).length > 0;
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <MobileSidebar />
      <div className="min-w-0 flex-1 sm:max-w-md">
        <GlobalSearch />
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
        {hasTms && (
          <Link
            href="/tms"
            className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
            aria-label="Open TMS"
          >
            <GraduationCap className="size-3.5" data-icon="inline-start" />
            <span className="hidden sm:inline">TMS</span>
          </Link>
        )}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Visit website"
        >
          <Globe className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">Visit Website</span>
        </a>
        <ThemeToggle />
        <NotificationsBell
          staleLeads={staleLeads}
          staleLeadsCount={staleLeadsCount}
          staleApplications={staleApplications}
          staleApplicationsCount={staleApplicationsCount}
          recentLeads={recentLeads}
          recentApplications={recentApplications}
        />
      </div>
    </header>
  );
}
