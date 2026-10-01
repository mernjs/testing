"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Date range for /platform/revenue: preset chips (one row, wraps on phones)
 * plus a custom month-to-month range. The range lives in the URL
 * (`?range=6m` or `?from=2026-01&to=2026-06`) so it survives reloads, can be
 * shared, and drives the CSV export too.
 */
export default function RevenueRangePicker({
  presets,
  preset,
  from,
  to,
  maxMonth,
}: {
  presets: readonly { id: string; label: string }[];
  preset: string;
  from: string;
  to: string;
  /** The current month ("YYYY-MM"); nothing later can be picked. */
  maxMonth: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [custom, setCustom] = useState(preset === "custom");
  const [fromValue, setFromValue] = useState(from);
  const [toValue, setToValue] = useState(to);

  const go = (query: string) => startTransition(() => router.replace(`${pathname}?${query}`, { scroll: false }));
  const chip = (active: boolean) =>
    cn(
      "h-8 rounded-full border px-3 text-xs font-medium transition-colors",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-background text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="space-y-2" data-testid="revenue-range">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Date range">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            className={chip(!custom && preset === p.id)}
            aria-pressed={!custom && preset === p.id}
            onClick={() => {
              setCustom(false);
              go(`range=${p.id}`);
            }}
          >
            {p.label}
          </button>
        ))}
        <button type="button" className={chip(custom)} aria-pressed={custom} onClick={() => setCustom(true)}>
          Custom
        </button>
        {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Loading" />}
      </div>
      {custom && (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (fromValue && toValue) go(`range=custom&from=${fromValue}&to=${toValue}`);
          }}
        >
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            From month
            <Input id="revenue-from" type="month" value={fromValue} max={maxMonth} required onChange={(e) => setFromValue(e.target.value)} className="h-9 w-40 rounded-xl border-border/50 bg-background" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            To month
            <Input id="revenue-to" type="month" value={toValue} max={maxMonth} required onChange={(e) => setToValue(e.target.value)} className="h-9 w-40 rounded-xl border-border/50 bg-background" />
          </label>
          <Button type="submit" size="sm" className="h-9 rounded-xl" disabled={pending}>
            Apply
          </Button>
        </form>
      )}
    </div>
  );
}
