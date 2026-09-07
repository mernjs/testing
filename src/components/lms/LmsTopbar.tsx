"use client";

import Link from "next/link";
import { Globe, Users, FolderKanban } from "lucide-react";
import MobileSidebar from "@/components/lms/MobileSidebar";
import GlobalSearch from "@/components/lms/GlobalSearch";
import NotificationsBell from "@/components/lms/NotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import type { SerializedLead, SerializedCareerApplication } from "@/components/lms/types";

export default function LmsTopbar({
  staleLeads,
  staleLeadsCount,
  staleApplications,
  staleApplicationsCount,
  recentLeads,
  recentApplications,
}: {
  staleLeads: SerializedLead[];
  staleLeadsCount: number;
  staleApplications: SerializedCareerApplication[];
  staleApplicationsCount: number;
  recentLeads: SerializedLead[];
  recentApplications: SerializedCareerApplication[];
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <MobileSidebar />
      <div className="min-w-0 flex-1 sm:max-w-md">
        <GlobalSearch />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Link
          href="/pms"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Open PMS"
        >
          <FolderKanban className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">PMS</span>
        </Link>
        <Link
          href="/hrms"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Open HRMS"
        >
          <Users className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">HRMS</span>
        </Link>
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
