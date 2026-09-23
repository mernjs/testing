"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OptionSelect from "@/components/sop/OptionSelect";
import { buttonVariants } from "@/components/ui/button";

/** URL-driven filter bar for the audit log. */
export default function AuditFilters({
  values,
  actions,
  entities,
  exportHref,
}: {
  values: { search: string; action: string; entity: string; from: string; to: string; sop: string };
  actions: { value: string; label: string }[];
  entities: { value: string; label: string }[];
  exportHref: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(values.search);

  function set(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(updates)) (v ? next.set(k, v) : next.delete(k));
    next.delete("page");
    startTransition(() => router.replace(`${pathname}?${next.toString()}`));
  }

  const active = Object.values(values).some(Boolean);
  const qs = params.toString();
  return (
    <div className="rounded-2xl border border-border/40 bg-card/90 p-4 shadow-sm backdrop-blur-md">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          set({ search });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="audit-search" className="text-xs text-muted-foreground">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input id="audit-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Actor, SOP or details" className="h-9 w-56 rounded-xl pl-8" />
          </div>
        </div>
        <div className="w-40 space-y-1.5">
          <Label className="text-xs text-muted-foreground">Action</Label>
          <OptionSelect value={values.action} onChange={(v) => set({ action: v })} options={actions} noneLabel="All actions" aria-label="Action" />
        </div>
        <div className="w-40 space-y-1.5">
          <Label className="text-xs text-muted-foreground">Entity</Label>
          <OptionSelect value={values.entity} onChange={(v) => set({ entity: v })} options={entities} noneLabel="All entities" aria-label="Entity" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="audit-from" className="text-xs text-muted-foreground">From</Label>
          <Input id="audit-from" type="date" defaultValue={values.from} onChange={(e) => set({ from: e.target.value })} className="h-9 w-40 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="audit-to" className="text-xs text-muted-foreground">To</Label>
          <Input id="audit-to" type="date" defaultValue={values.to} onChange={(e) => set({ to: e.target.value })} className="h-9 w-40 rounded-xl" />
        </div>
        <div className="ml-auto flex gap-2">
          {active && (
            <button type="button" onClick={() => { setSearch(""); router.replace(pathname); }} className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20 dark:text-rose-400">
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          )}
          {exportHref && (
            <a href={`${exportHref}?format=csv&${qs}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Download className="size-3.5" data-icon="inline-start" />
              CSV
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
