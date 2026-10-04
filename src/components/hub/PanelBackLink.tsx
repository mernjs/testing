"use client";

import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

const NAMES: Record<string, string> = {
  aibots: "AI Bots", cms: "Website CMS", dlms: "Digi Locker", fms: "Finance", hrms: "HR", intelligence: "Intelligence", lms: "Leads / CRM",
  messenger: "Messenger", ots: "Online Tests", pms: "Projects", prms: "Procurement", seo: "SEO", smms: "Social Media", sop: "SOPs", tms: "Training",
};

/** A full-page navigation on purpose: the Workspace is a separate shell, and a soft navigation from a panel left stale client state and fired a prefetch of /workspace from every panel page. */
export default function PanelBackLink() {
  const segment = usePathname().split("/")[1] ?? "";
  const name = NAMES[segment];
  return (
    <nav aria-label="Back to Workspace" className="flex shrink-0 items-center gap-3 px-1">
      <a
        href="/workspace"
        className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 py-1.5 pl-2 pr-4 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-all hover:border-primary/40 hover:bg-primary/8 hover:text-primary"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/12 text-primary transition-transform group-hover:-translate-x-0.5">
          <ArrowLeft className="size-3.5" />
        </span>
        Back to Workspace
      </a>
      {name && (
        <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
          Workspace <ChevronRight className="size-3" /> <span className="font-medium text-foreground">{name}</span>
        </span>
      )}
    </nav>
  );
}
