"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X, CalendarRange } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import { CAMPAIGN_PLATFORMS, CAMPAIGN_STATUSES } from "@/lib/campaign-platforms";
import { LEAD_SOURCES } from "@/lib/lead-sources";
import { DATE_RANGE_PRESETS } from "@/lib/date-ranges";
import { formatDate } from "@/lib/utils";

export interface CampaignFilterValues {
  platform: string;
  source: string;
  campaign: string;
  status: string;
  range: string;
  dateFrom: string;
  dateTo: string;
}

export default function CampaignFilters({
  values,
  campaignOptions,
  hasActiveFilters,
}: {
  values: CampaignFilterValues;
  campaignOptions: { key: string; name: string }[];
  hasActiveFilters: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [customOpen, setCustomOpen] = useState(false);
  const [pendingFrom, setPendingFrom] = useState(values.dateFrom);
  const [pendingTo, setPendingTo] = useState(values.dateTo);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  function openCustomPicker() {
    setPendingFrom(values.dateFrom);
    setPendingTo(values.dateTo);
    setCustomOpen(true);
  }

  function applyCustomRange() {
    updateParams({ range: "custom", dateFrom: pendingFrom || undefined, dateTo: pendingTo || undefined });
    setCustomOpen(false);
  }

  return (
    <GlassCard interactive={false}>
      <CardContent>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Platform">
            <Select value={values.platform || "all"} onValueChange={(v) => updateParams({ platform: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All platforms</SelectItem>
                {CAMPAIGN_PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.shortLabel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Campaign">
            <Select value={values.campaign || "all"} onValueChange={(v) => updateParams({ campaign: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All campaigns</SelectItem>
                {campaignOptions.map((c) => (
                  <SelectItem key={c.key} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Lead Source">
            <Select value={values.source || "all"} onValueChange={(v) => updateParams({ source: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any source</SelectItem>
                {LEAD_SOURCES.filter((s) => ["meta", "google", "linkedin"].includes(s.value)).map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Status">
            <Select value={values.status || "all"} onValueChange={(v) => updateParams({ status: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {CAMPAIGN_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Date Range">
            <Select
              value={values.range || "last30"}
              onValueChange={(v) => {
                if (v === "custom") {
                  updateParams({ range: "custom" });
                  openCustomPicker();
                } else {
                  setCustomOpen(false);
                  updateParams({ range: v ?? undefined, dateFrom: undefined, dateTo: undefined });
                }
              }}
            >
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DATE_RANGE_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {values.range === "custom" && (
            <Field label="Custom Dates">
              <Popover open={customOpen} onOpenChange={(open) => (open ? openCustomPicker() : setCustomOpen(false))}>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline" size="sm" className="h-8">
                      <CalendarRange className="size-3.5" data-icon="inline-start" />
                      {formatDate(values.dateFrom)} – {formatDate(values.dateTo)}
                    </Button>
                  }
                />
                <PopoverContent align="start" className="w-auto">
                  <PopoverHeader><PopoverTitle>Custom Range</PopoverTitle></PopoverHeader>
                  <div className="flex items-end gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">From</label>
                      <Input type="date" value={pendingFrom} max={pendingTo || undefined} onChange={(e) => setPendingFrom(e.target.value)} className="w-auto" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">To</label>
                      <Input type="date" value={pendingTo} min={pendingFrom || undefined} onChange={(e) => setPendingTo(e.target.value)} className="w-auto" />
                    </div>
                  </div>
                  <Button type="button" size="sm" onClick={applyCustomRange} disabled={!pendingFrom || !pendingTo}>Apply</Button>
                </PopoverContent>
              </Popover>
            </Field>
          )}

          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={() => router.replace(pathname)}>
              <X className="size-3.5" data-icon="inline-start" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </GlassCard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
