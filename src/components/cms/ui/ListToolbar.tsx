"use client";

import { Search, X, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Search box with a clear button — the first control of every CMS list toolbar. */
export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full min-w-0 sm:w-64 sm:flex-none lg:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input aria-label={placeholder} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-9 rounded-full pl-9 pr-8" />
      {value && (
        <button type="button" aria-label="Clear search" onClick={() => onChange("")} className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

/** Segmented status filter with counts (All / Published / Draft …). */
export function FilterChips<T extends string>({ options, value, onChange }: { options: { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full border border-border/60 bg-muted/30 p-1" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
            value === o.value ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
          {o.count !== undefined && <span className={cn("rounded-full px-1.5 text-[10px] tabular-nums", value === o.value ? "bg-primary/10 text-primary" : "bg-muted")}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** A compact native select for sort / secondary filters (keeps keyboard + mobile behaviour). */
export function ToolbarSelect({ label, value, onChange, options, icon = true }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; icon?: boolean }) {
  return (
    <label className="relative flex items-center">
      <span className="sr-only">{label}</span>
      {icon && <ArrowUpDown className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("h-9 appearance-none rounded-full border border-border/60 bg-background pr-8 text-xs font-medium text-foreground outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/50", icon ? "pl-8" : "pl-3")}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 text-[10px] text-muted-foreground">▾</span>
    </label>
  );
}
