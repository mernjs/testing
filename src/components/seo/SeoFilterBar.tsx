"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OptionSelect from "@/components/sop/OptionSelect";

export type FilterField =
  | { key: string; label: string; type: "search"; placeholder?: string }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; allLabel?: string; required?: boolean }
  | { key: string; label: string; type: "date" };

/** URL-driven filter bar (same look as the audit-log filters) for pages whose filters aren't a single table. */
export default function SeoFilterBar({ fields, values }: { fields: FilterField[]; values: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [text, setText] = useState<Record<string, string>>(() => Object.fromEntries(fields.filter((f) => f.type === "search").map((f) => [f.key, values[f.key] ?? ""])));

  function set(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    next.delete("page");
    startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  const active = fields.some((f) => values[f.key] && !(f.type === "select" && f.required));
  return (
    <div className="rounded-2xl border border-border/40 bg-card/90 p-4 shadow-sm backdrop-blur-md">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          set(text);
        }}
      >
        {fields.map((f) => (
          <div key={f.key} className={f.type === "select" ? "w-40 space-y-1.5" : "space-y-1.5"}>
            <Label htmlFor={`flt-${f.key}`} className="text-xs text-muted-foreground">{f.label}</Label>
            {f.type === "search" && (
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input id={`flt-${f.key}`} value={text[f.key] ?? ""} onChange={(e) => setText((t) => ({ ...t, [f.key]: e.target.value }))} onBlur={() => set({ [f.key]: text[f.key] ?? "" })} placeholder={f.placeholder} className="h-9 w-52 rounded-xl pl-8" />
              </div>
            )}
            {f.type === "select" && <OptionSelect id={`flt-${f.key}`} value={values[f.key] ?? ""} onChange={(v) => set({ [f.key]: v })} options={f.options} noneLabel={f.required ? undefined : f.allLabel ?? "All"} aria-label={f.label} />}
            {f.type === "date" && <Input id={`flt-${f.key}`} type="date" defaultValue={values[f.key] ?? ""} onChange={(e) => set({ [f.key]: e.target.value })} className="h-9 w-40 rounded-xl" />}
          </div>
        ))}
        {active && (
          <button type="button" onClick={() => { setText({}); router.replace(pathname); }} className="ml-auto flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20 dark:text-rose-400">
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        )}
      </form>
    </div>
  );
}
