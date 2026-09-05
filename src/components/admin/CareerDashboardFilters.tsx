"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, CalendarRange } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import { CAREER_APPLICATION_STATUSES } from "@/lib/career-application-status";
import { DATE_RANGE_PRESETS } from "@/lib/date-ranges";
import { formatDate } from "@/lib/utils";

export default function CareerDashboardFilters({
  status,
  position,
  positions,
  experience,
  experienceOptions,
  location,
  locationOptions,
  search,
  range,
  dateFrom,
  dateTo,
  hasActiveFilters,
}: {
  status: string;
  position: string;
  positions: { slug: string; title: string }[];
  experience: string;
  experienceOptions: string[];
  location: string;
  locationOptions: string[];
  search: string;
  range: string;
  dateFrom: string;
  dateTo: string;
  hasActiveFilters: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(search);
  const [customOpen, setCustomOpen] = useState(false);
  const [pendingFrom, setPendingFrom] = useState(dateFrom);
  const [pendingTo, setPendingTo] = useState(dateTo);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) updateParams({ search: searchInput || undefined });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function openCustomPicker() {
    setPendingFrom(dateFrom);
    setPendingTo(dateTo);
    setCustomOpen(true);
  }

  function applyCustomRange() {
    updateParams({ range: "custom", dateFrom: pendingFrom || undefined, dateTo: pendingTo || undefined });
    setCustomOpen(false);
  }

  return (
    <GlassCard>
      <CardContent>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Name, email, or phone"
                className="h-8 w-48 pl-8"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={status || "all"} onValueChange={(v) => updateParams({ status: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {CAREER_APPLICATION_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Position</label>
            <Select value={position || "all"} onValueChange={(v) => updateParams({ position: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                {positions.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Experience</label>
            <Select value={experience || "all"} onValueChange={(v) => updateParams({ experience: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any experience</SelectItem>
                {experienceOptions.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <Select value={location || "all"} onValueChange={(v) => updateParams({ location: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any location</SelectItem>
                {locationOptions.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Date Range</label>
            <Select
              value={range || "last30"}
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
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {range === "custom" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Custom Dates</label>
              <Popover open={customOpen} onOpenChange={(open) => (open ? openCustomPicker() : setCustomOpen(false))}>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline" size="sm" className="h-8">
                      <CalendarRange className="size-3.5" data-icon="inline-start" />
                      {formatDate(dateFrom)} – {formatDate(dateTo)}
                    </Button>
                  }
                />
                <PopoverContent align="start" className="w-auto">
                  <PopoverHeader>
                    <PopoverTitle>Custom Range</PopoverTitle>
                  </PopoverHeader>
                  <div className="flex items-end gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">From</label>
                      <Input
                        type="date"
                        value={pendingFrom}
                        max={pendingTo || undefined}
                        onChange={(e) => setPendingFrom(e.target.value)}
                        className="w-auto"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">To</label>
                      <Input
                        type="date"
                        value={pendingTo}
                        min={pendingFrom || undefined}
                        onChange={(e) => setPendingTo(e.target.value)}
                        className="w-auto"
                      />
                    </div>
                  </div>
                  <Button type="button" size="sm" onClick={applyCustomRange} disabled={!pendingFrom || !pendingTo}>
                    Apply
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          )}
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={() => { setSearchInput(""); router.replace(pathname); }}>
              <X className="size-3.5" data-icon="inline-start" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </GlassCard>
  );
}
