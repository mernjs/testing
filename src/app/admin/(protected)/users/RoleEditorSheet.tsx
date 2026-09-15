"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ROLE_GROUPS } from "@/lib/admin/role-catalog";
import { updateAdminUserRolesAction } from "./actions";

export default function RoleEditorSheet({
  userId,
  userEmail,
  initialRoles,
  currentAdminId,
  open,
  onOpenChange,
}: {
  userId: string | null;
  userEmail: string | null;
  initialRoles: string[];
  currentAdminId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [isPending, startTransition] = useTransition();

  const isSelf = userId === currentAdminId;
  const superAdmin = roles.includes("super_admin");

  function toggle(role: string) {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  }

  function handleSave() {
    if (!userId) return;
    startTransition(async () => {
      const result = await updateAdminUserRolesAction(userId, roles);
      if (!result.ok) toast.error(result.error ?? "Could not update roles.");
      else {
        toast.success("Roles updated");
        onOpenChange(false);
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{userEmail ?? "Roles"}</SheetTitle>
          <SheetDescription>Grant or revoke access across every module.</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 overflow-y-auto px-4 pb-4">
          <label className="flex items-start gap-2.5 rounded-lg border border-border/60 p-2.5">
            <Checkbox checked={superAdmin} onCheckedChange={() => toggle("super_admin")} disabled={isSelf && superAdmin} />
            <div>
              <p className="text-sm font-medium text-foreground">Super Admin</p>
              <p className="text-xs text-muted-foreground">Full access to every module, including this Command Center.</p>
            </div>
          </label>
          {isSelf && (
            <p className="text-xs text-muted-foreground">You can&apos;t remove your own Super Admin role.</p>
          )}

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
        </div>
        <SheetFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving…" : "Save roles"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
