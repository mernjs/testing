"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { assignSopAction } from "@/app/sop/(protected)/actions";
import { cn } from "@/lib/utils";

export interface AssignOptions {
  people: { id: string; label: string; sub: string }[];
  teams: { id: string; label: string; sub: string }[];
  departments: { id: string; label: string; sub: string }[];
  roles: { id: string; label: string; sub: string }[];
}

const TABS = [
  { key: "user", label: "Employees" },
  { key: "team", label: "Teams" },
  { key: "department", label: "Departments" },
  { key: "role", label: "Roles" },
] as const;
type Tab = (typeof TABS)[number]["key"];

/** Assign an SOP to employees, teams, departments or roles (job designations). Targets come from HRMS — nothing is created here. */
export default function AssignDialog({ sopId, options, defaultDueDate }: { sopId: string; options: AssignOptions; defaultDueDate: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("user");
  const [picked, setPicked] = useState<Record<Tab, string[]>>({ user: [], team: [], department: [], role: [] });
  const [search, setSearch] = useState("");
  const [due, setDue] = useState(defaultDueDate);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const list = tab === "user" ? options.people : tab === "team" ? options.teams : tab === "department" ? options.departments : options.roles;
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? list.filter((o) => `${o.label} ${o.sub}`.toLowerCase().includes(q)) : list;
  }, [list, search]);
  const selected = picked[tab];

  function toggle(id: string) {
    setPicked((p) => ({ ...p, [tab]: p[tab].includes(id) ? p[tab].filter((x) => x !== id) : [...p[tab], id] }));
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await assignSopAction(sopId, { type: tab, ids: selected, dueDate: due || null });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const extra = [res.existing ? `${res.existing} already assigned` : "", res.withoutLogin ? `${res.withoutLogin} have no login` : "", res.noAccess ? `${res.noAccess} can't open the SOP panel` : ""].filter(Boolean).join(", ");
      toast.success(`Assigned to ${res.created} ${res.created === 1 ? "person" : "people"}${extra ? ` (${extra})` : ""}`);
      setOpen(false);
      setPicked({ user: [], team: [], department: [], role: [] });
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" size="sm" />}>
        <UserPlus className="size-3.5" data-icon="inline-start" />
        Assign
      </DialogTrigger>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Assign this SOP</DialogTitle>
          <DialogDescription>Assignees are notified and must acknowledge the current version by the due date.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 px-4">
          <div className="flex gap-1 rounded-xl bg-muted/50 p-1" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => { setTab(t.key); setSearch(""); }}
                className={cn("flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors", tab === t.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                {t.label}
                {picked[t.key].length > 0 && <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-[10px] text-primary">{picked[t.key].length}</span>}
              </button>
            ))}
          </div>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${TABS.find((t) => t.key === tab)?.label.toLowerCase()}…`} aria-label="Search targets" />
          <ul className="max-h-56 space-y-0.5 overflow-y-auto rounded-xl border border-border/50 p-1">
            {filtered.length === 0 && <li className="px-2 py-4 text-center text-xs text-muted-foreground">Nothing to show.</li>}
            {filtered.map((o) => (
              <li key={o.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted/60">
                  <input type="checkbox" className="size-4 accent-[var(--primary)]" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} />
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{o.sub}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5">
            <Label htmlFor="assign-due">Due date</Label>
            <Input id="assign-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" onClick={submit} disabled={pending || selected.length === 0}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : `Assign${selected.length ? ` (${selected.length} ${tab === "user" ? "selected" : TABS.find((t) => t.key === tab)?.label.toLowerCase()})` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
