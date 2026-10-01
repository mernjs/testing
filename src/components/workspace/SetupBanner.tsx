"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

/**
 * "Finish setting up your workspace" — shown to a company owner whose setup is
 * still open, on the Workspace pages they reached by a deep link (the home page
 * sends them to the wizard instead, and the wizard needs no reminder).
 */
export default function SetupBanner() {
  const path = usePathname();
  if (path === "/workspace" || path.startsWith("/workspace/onboarding")) return null;
  return (
    <Link href="/workspace/onboarding" id="setup-banner" className="flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-3 text-sm transition-colors hover:bg-primary/10">
      <span>
        <span className="font-semibold text-foreground">Finish setting up your workspace</span>
        <span className="text-muted-foreground"> — company profile, departments, team invites and panels.</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-primary" />
    </Link>
  );
}
