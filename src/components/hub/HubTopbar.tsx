"use client";

import HubMobileSidebar from "@/components/hub/HubMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";

export default function HubTopbar({ email, roles }: { email: string; roles: string[] }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <HubMobileSidebar roles={roles} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Staff Hub</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {email}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
