"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import OptionSelect, { type Option } from "@/components/sop/OptionSelect";

export type FieldDef =
  | { key: string; label: string; type: "text"; placeholder?: string; hint?: string; maxLength?: number }
  | { key: string; label: string; type: "textarea"; placeholder?: string; hint?: string }
  | { key: string; label: string; type: "select"; options: Option[]; noneLabel?: string; hint?: string }
  | { key: string; label: string; type: "checkbox"; hint?: string }
  | { key: string; label: string; type: "color" };

type Values = Record<string, string | boolean>;

/** A small generic "edit these fields" dialog used by the structure / category / settings managers. `onSubmit` returns the server action result. */
export default function EditDialog({
  trigger,
  title,
  description,
  fields,
  initial,
  submitLabel = "Save",
  onSubmit,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  fields: FieldDef[];
  initial: Values;
  submitLabel?: string;
  onSubmit: (values: Values) => Promise<{ ok: boolean; error?: string }>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await onSubmit(values);
      if (!res.ok) {
        setError(res.error ?? "Could not save.");
        return;
      }
      toast.success("Saved");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setValues(initial);
          setError(null);
        }
      }}
    >
      <DialogTrigger render={<span className="contents" />}>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="space-y-3 px-4 pb-2">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                {f.type !== "checkbox" && <Label htmlFor={`f-${f.key}`}>{f.label}</Label>}
                {f.type === "text" && <Input id={`f-${f.key}`} value={String(values[f.key] ?? "")} maxLength={f.maxLength} placeholder={f.placeholder} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />}
                {f.type === "textarea" && <Textarea id={`f-${f.key}`} rows={3} value={String(values[f.key] ?? "")} placeholder={f.placeholder} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />}
                {f.type === "select" && <OptionSelect id={`f-${f.key}`} value={String(values[f.key] ?? "")} options={f.options} noneLabel={f.noneLabel} onChange={(x) => setValues((v) => ({ ...v, [f.key]: x }))} />}
                {f.type === "color" && <input id={`f-${f.key}`} type="color" value={String(values[f.key] || "#3b82f6")} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} className="h-8 w-16 cursor-pointer rounded-md border border-input bg-transparent p-0.5" />}
                {f.type === "checkbox" && (
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="size-4 accent-[var(--primary)]" checked={!!values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.checked }))} />
                    {f.label}
                  </label>
                )}
                {"hint" in f && f.hint && <p className="text-[11px] text-muted-foreground">{f.hint}</p>}
              </div>
            ))}
            {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
