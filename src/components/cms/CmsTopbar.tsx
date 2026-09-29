"use client";

import { ExternalLink } from "lucide-react";
import CmsMobileSidebar from "@/components/cms/CmsMobileSidebar";
import CmsCommandSearch from "@/components/cms/CmsCommandSearch";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { primaryCmsRoleLabel } from "@/lib/cms-roles";
import type { CmsNavFlags } from "@/components/cms/CmsSidebar";

export default function CmsTopbar({ roles, flags }: { roles: string[]; flags: CmsNavFlags }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <CmsMobileSidebar flags={flags} />
      <div className="hidden min-w-0 lg:block">
        <p className="truncate text-sm font-semibold text-foreground">Website CMS</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryCmsRoleLabel(roles)}</p>
      </div>
      <div className="flex min-w-0 flex-1 justify-center">
        <CmsCommandSearch />
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:inline-flex"
        >
          <ExternalLink className="size-3.5" /> View website
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
