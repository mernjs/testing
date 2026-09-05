"use client";

import Link from "next/link";
import { Bell, AlertTriangle, Sparkles } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/admin/StatusBadge";
import CareerStatusBadge from "@/components/admin/CareerStatusBadge";
import { getCategoryLabel, type CategorySlug } from "@/lib/categories";
import { STALE_DAYS } from "@/lib/stale-days";
import { formatDateTime } from "@/lib/utils";
import type { SerializedLead, SerializedCareerApplication } from "@/components/admin/types";

function LeadRow({ lead, icon: Icon }: { lead: SerializedLead; icon: typeof AlertTriangle }) {
  return (
    <Link
      href={`/admin/submissions/${lead.category}/${lead._id}`}
      className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5 text-sm hover:bg-muted/60"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="size-3.5 shrink-0 text-amber-500" />
        <div className="min-w-0">
          <p className="truncate font-medium">{lead.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {getCategoryLabel(lead.category as CategorySlug)} · {formatDateTime(lead.createdAt)}
          </p>
        </div>
      </div>
      <StatusBadge status={lead.status} />
    </Link>
  );
}

function ApplicationRow({ application, icon: Icon }: { application: SerializedCareerApplication; icon: typeof AlertTriangle }) {
  return (
    <Link
      href={`/admin/careers/applicants/${application._id}`}
      className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5 text-sm hover:bg-muted/60"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="size-3.5 shrink-0 text-amber-500" />
        <div className="min-w-0">
          <p className="truncate font-medium">{application.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {application.positionTitle} · {formatDateTime(application.createdAt)}
          </p>
        </div>
      </div>
      <CareerStatusBadge status={application.status} />
    </Link>
  );
}

function Group({ title, count, itemCount, children }: { title: string; count: number; itemCount: number; children: React.ReactNode }) {
  if (itemCount === 0) return null;
  return (
    <div>
      <p className="mb-1 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title} {count > itemCount ? `(${count})` : ""}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default function NotificationsBell({
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
  const attentionTotal = staleLeadsCount + staleApplicationsCount;
  const hasRecent = recentLeads.length > 0 || recentApplications.length > 0;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button type="button" variant="ghost" size="icon" aria-label={`Notifications${attentionTotal > 0 ? ` (${attentionTotal} pending)` : ""}`} className="relative">
            <Bell className="size-4.5" />
            {attentionTotal > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                {attentionTotal > 9 ? "9+" : attentionTotal}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="end" className="max-h-[28rem] w-80 overflow-y-auto">
        <PopoverHeader>
          <PopoverTitle>Needs Attention</PopoverTitle>
        </PopoverHeader>
        {attentionTotal === 0 ? (
          <p className="py-2 text-xs text-muted-foreground">Nothing open past {STALE_DAYS}+ days — you&apos;re all caught up.</p>
        ) : (
          <div className="space-y-3">
            <Group title="Leads" count={staleLeadsCount} itemCount={staleLeads.length}>
              {staleLeads.map((lead) => (
                <LeadRow key={lead._id} lead={lead} icon={AlertTriangle} />
              ))}
            </Group>
            <Group title="Applications" count={staleApplicationsCount} itemCount={staleApplications.length}>
              {staleApplications.map((application) => (
                <ApplicationRow key={application._id} application={application} icon={AlertTriangle} />
              ))}
            </Group>
          </div>
        )}

        <PopoverHeader className="mt-3 border-t border-border/60 pt-3">
          <PopoverTitle>Recent Activity</PopoverTitle>
        </PopoverHeader>
        {!hasRecent ? (
          <p className="py-2 text-xs text-muted-foreground">No new leads or applications in the last couple of days.</p>
        ) : (
          <div className="space-y-3">
            <Group title="New Leads" count={recentLeads.length} itemCount={recentLeads.length}>
              {recentLeads.map((lead) => (
                <LeadRow key={lead._id} lead={lead} icon={Sparkles} />
              ))}
            </Group>
            <Group title="New Applications" count={recentApplications.length} itemCount={recentApplications.length}>
              {recentApplications.map((application) => (
                <ApplicationRow key={application._id} application={application} icon={Sparkles} />
              ))}
            </Group>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
