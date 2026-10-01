"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

const selectClass =
  "h-9 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-48 dark:bg-input/30";

type Initial = { type: string; actor: string; from: string; to: string };

export default function ActivityFilterBar({ initial, types, actors }: { initial: Initial; types: { value: string; label: string }[]; actors: { id: string; email: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(updates: Partial<Initial>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }

  const field = (id: string, label: string, control: React.ReactNode) => (
    <div className="flex w-full flex-col gap-1.5 sm:w-auto">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {control}
    </div>
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      {field(
        "activity-type",
        "What happened",
        <select id="activity-type" className={selectClass} value={initial.type} onChange={(e) => update({ type: e.target.value })}>
          <option value="">Everything</option>
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>,
      )}
      {field(
        "activity-actor",
        "Who",
        <select id="activity-actor" className={selectClass} value={initial.actor} onChange={(e) => update({ actor: e.target.value })}>
          <option value="">Anyone</option>
          {actors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.email}
            </option>
          ))}
        </select>,
      )}
      {field("activity-from", "From", <Input id="activity-from" type="date" value={initial.from} onChange={(e) => update({ from: e.target.value })} className="h-9 w-full rounded-xl border-border/50 bg-background sm:w-40" />)}
      {field("activity-to", "To", <Input id="activity-to" type="date" value={initial.to} onChange={(e) => update({ to: e.target.value })} className="h-9 w-full rounded-xl border-border/50 bg-background sm:w-40" />)}
    </div>
  );
}
