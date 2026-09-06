"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarRange, X } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DATE_RANGE_PRESETS } from "@/lib/date-ranges";
import { formatDate } from "@/lib/utils";

export default function HrmsDashboardFilters({
  range,
  dateFrom,
  dateTo,
  hasActiveFilters,
}: {
  range: string;
  dateFrom: string;
  dateTo: string;
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
      <CardContent>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Date Range</label>
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
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {range === "custom" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Custom Dates</label>
              <Popover open={customOpen} onOpenChange={(open) => (open ? openCustom() : setCustomOpen(false))}>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline" size="sm" className="h-8">
                      <CalendarRange className="size-3.5" data-icon="inline-start" />
                      {formatDate(dateFrom)} – {formatDate(dateTo)}
                    </Button>
                  }
                />
                <PopoverContent align="start" className="w-auto">
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
                  <Button type="button" size="sm" onClick={applyCustom} disabled={!pendingFrom || !pendingTo}>
                    Apply
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
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
