"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import BotAvatar from "@/components/aibots/BotAvatar";
import type { BotSummary } from "@/lib/aibots/bots";

/** Generate Chat → pick any bot the viewer may use → its workspace opens on a fresh chat. */
export default function BotPicker({ bots }: { bots: BotSummary[] }) {
  const [q, setQ] = useState("");
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle ? bots.filter((b) => `${b.name} ${b.description} ${b.category}`.toLowerCase().includes(needle)) : bots;
    const map = new Map<string, BotSummary[]>();
    for (const b of list) map.set(b.category || "General", [...(map.get(b.category || "General") ?? []), b]);
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [bots, q]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bots by name, purpose or category" className="pl-9" aria-label="Search bots" />
      </div>
      {groups.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No bot matches “{q}”.</p>}
      {groups.map(([category, list]) => (
        <section key={category} className="space-y-2">
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{category}</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((b) => (
              <Link
                key={b._id}
                href={`/aibots/b/${b._id}`}
                className="group lms-surface flex items-start gap-3 rounded-2xl border border-border/40 bg-background/80 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:bg-card/70"
              >
                <BotAvatar icon={b.icon} color={b.color} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 font-semibold text-foreground">
                    <span className="truncate">{b.name}</span>
                    {b.status === "inactive" && <span className="rounded bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">Inactive</span>}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{b.description || "No description."}</p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
