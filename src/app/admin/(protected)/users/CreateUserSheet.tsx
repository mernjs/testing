"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE_GROUPS } from "@/lib/admin/role-catalog";
import { createAdminUserAction } from "./actions";

export default function CreateUserSheet({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (email: string, tempPassword: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggle(role: string) {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  }

  function reset() {
    setEmail("");
    setRoles([]);
    setError(null);
  }

  function handleCreate() {
    setError(null);
    if (roles.length === 0) {
      setError("Select at least one role.");
      return;
    }
    startTransition(async () => {
      const result = await createAdminUserAction(email, roles);
      if (!result.ok || !result.tempPassword) {
        setError(result.error ?? "Could not create account.");
        return;
      }
      toast.success("Account created");
      onCreated(email.trim().toLowerCase(), result.tempPassword);
      reset();
      onOpenChange(false);
    });
  }

  const superAdmin = roles.includes("super_admin");

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New admin account</SheetTitle>
          <SheetDescription>Creates a login with a one-time temporary password.</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@yashorbit.com" />
          </div>

          <label className="flex items-start gap-2.5 rounded-lg border border-border/60 p-2.5">
            <Checkbox checked={superAdmin} onCheckedChange={() => toggle("super_admin")} />
            <div>
              <p className="text-sm font-medium text-foreground">Super Admin</p>
              <p className="text-xs text-muted-foreground">Full access to every module, including this Command Center.</p>
            </div>
          </label>

          {!superAdmin && (
            <div className="space-y-4">
              {ROLE_GROUPS.map((g) => (
                <div key={g.module}>
                  <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{g.module}</p>
                  <div className="space-y-1.5">
                    {g.roles.map((r) => (
                      <label key={r.value} className="flex items-start gap-2.5 rounded-lg border border-border/60 p-2.5">
                        <Checkbox checked={roles.includes(r.value)} onCheckedChange={() => toggle(r.value)} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.label}</p>
                          <p className="text-xs text-muted-foreground">{r.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <SheetFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCreate} disabled={isPending || !email.trim()}>
            {isPending ? "Creating…" : "Create account"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
