"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarRange, X } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DATE_RANGE_PRESETS } from "@/lib/date-ranges";
import { formatDate } from "@/lib/utils";

export default function FmsDashboardFilters({
  range,
  dateFrom,
  dateTo,
  sourceModule = "",
  type = "",
  hasActiveFilters,
}: {
  range: string;
  dateFrom: string;
  dateTo: string;
  sourceModule?: string;
  type?: string;
  hasActiveFilters: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
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

  function openCustom() {
    setPendingFrom(dateFrom);
    setPendingTo(dateTo);
    setCustomOpen(true);
  }

  function applyCustom() {
    updateParams({ range: "custom", dateFrom: pendingFrom || undefined, dateTo: pendingTo || undefined });
    setCustomOpen(false);
  }

  return (
    <GlassCard interactive={false}>
      <CardContent className="p-3">
        <div className="flex flex-wrap items-end gap-2.5">
          {/* Date Range Preset */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">Date Period</label>
            <Select
              value={range || "thisYear"}
              onValueChange={(v) => {
                if (v === "custom") {
                  updateParams({ range: "custom" });
                  openCustom();
                } else {
                  setCustomOpen(false);
                  updateParams({ range: v ?? undefined, dateFrom: undefined, dateTo: undefined });
                }
              }}
            >
              <SelectTrigger className="h-8 w-36 sm:w-40 text-xs">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="text-xs">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range Popover */}
          {range === "custom" && (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-muted-foreground">Custom Dates</label>
              <Popover open={customOpen} onOpenChange={(open) => (open ? openCustom() : setCustomOpen(false))}>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline" size="sm" className="h-8 text-xs">
                      <CalendarRange className="size-3.5 mr-1" />
                      {formatDate(dateFrom)} – {formatDate(dateTo)}
                    </Button>
                  }
                />
                <PopoverContent align="start" className="w-auto p-3">
                  <div className="flex items-end gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-medium text-muted-foreground">From</label>
                      <Input type="date" value={pendingFrom} max={pendingTo || undefined} onChange={(e) => setPendingFrom(e.target.value)} className="h-8 w-auto text-xs" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-medium text-muted-foreground">To</label>
                      <Input type="date" value={pendingTo} min={pendingFrom || undefined} onChange={(e) => setPendingTo(e.target.value)} className="h-8 w-auto text-xs" />
                    </div>
                  </div>
                  <Button type="button" size="sm" onClick={applyCustom} disabled={!pendingFrom || !pendingTo} className="mt-2.5 w-full text-xs h-8">
                    Apply Custom Range
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Source Panel Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">Module Panel</label>
            <Select
              value={sourceModule || "all"}
              onValueChange={(v) => updateParams({ sourceModule: !v || v === "all" ? undefined : v })}
            >
              <SelectTrigger className="h-8 w-36 sm:w-40 text-xs">
                <SelectValue placeholder="All Panels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Panels</SelectItem>
                <SelectItem value="prms" className="text-xs">PRMS Procurement</SelectItem>
                <SelectItem value="pms" className="text-xs">PMS Projects</SelectItem>
                <SelectItem value="hrms" className="text-xs">HRMS Payroll</SelectItem>
                <SelectItem value="tms" className="text-xs">TMS Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">Flow Type</label>
            <Select
              value={type || "all"}
              onValueChange={(v) => updateParams({ type: !v || v === "all" ? undefined : v })}
            >
              <SelectTrigger className="h-8 w-32 sm:w-36 text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Types</SelectItem>
                <SelectItem value="income" className="text-xs">Money In (Income)</SelectItem>
                <SelectItem value="expense" className="text-xs">Money Out (Expense)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={() => router.replace(pathname)} className="h-8 text-xs text-muted-foreground hover:text-foreground">
              <X className="size-3.5 mr-1" />
              Reset Filters
            </Button>
          )}
        </div>
      </CardContent>
    </GlassCard>
  );
}
