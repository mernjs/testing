"use client";

import { Globe } from "lucide-react";
import MobileSidebar from "@/components/admin/MobileSidebar";
import GlobalSearch from "@/components/admin/GlobalSearch";
import NotificationsBell from "@/components/admin/NotificationsBell";
import ThemeToggle from "@/components/admin/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import type { SerializedLead, SerializedCareerApplication } from "@/components/admin/types";

export default function AdminTopbar({
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
