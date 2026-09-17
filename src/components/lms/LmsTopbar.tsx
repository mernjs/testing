"use client";

import MobileSidebar from "@/components/lms/MobileSidebar";
import NotificationsBell from "@/components/lms/NotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import type { SerializedLead, SerializedCareerApplication } from "@/components/lms/types";

export default function LmsTopbar({
  userEmail,
  staleLeads,
  staleLeadsCount,
  staleApplications,
  staleApplicationsCount,
  recentLeads,
  recentApplications,
}: {
  roles: string[];
  userEmail: string;
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
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Lead Management</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {userEmail}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
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
