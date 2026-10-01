"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

/**
 * The "Complete setup" strip: shown to a company owner on every Workspace page
 * (the dashboard included) until setup is completed, whether or not it was
 * skipped. Not on the wizard itself.
 */
export default function SetupBanner({ done, total }: { done: number; total: number }) {
  const path = usePathname();
  if (path.startsWith("/workspace/onboarding")) return null;
  return (
    <div id="setup-banner" role="status" className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-3 text-sm">
      <span>
        <span className="font-semibold text-foreground">Your workspace setup isn&apos;t finished</span>
        <span className="text-muted-foreground"> — {done} of {total} steps done: company profile, departments, team invites, branding and panels.</span>
      </span>
      <Link href="/workspace/onboarding" id="setup-banner-link" className="inline-flex items-center gap-1 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90">
        Complete setup <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}
