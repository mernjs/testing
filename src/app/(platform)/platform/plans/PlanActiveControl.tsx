"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { setPlanActiveAction } from "./actions";

/** Archive / restore a plan, behind a confirm step. The default plan can't be archived. */
export default function PlanActiveControl({ planId, planName, active, isDefault, companies }: { planId: string; planName: string; active: boolean; isDefault: boolean; companies: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (active && isDefault) {
    return <p className="text-xs text-muted-foreground">The default plan can&apos;t be archived.</p>;
  }

  function confirm() {
    setError(null);
    start(async () => {
      const res = await setPlanActiveAction(planId, !active);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  const onIt = companies === 1 ? "1 company is" : `${companies} companies are`;
  return (
    <div className="space-y-1">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          render={
            <Button type="button" variant="ghost" size="sm" aria-label={`${active ? "Archive" : "Restore"} ${planName}`}>
              {active ? <Archive className="size-3.5" data-icon="inline-start" /> : <ArchiveRestore className="size-3.5" data-icon="inline-start" />}
              {active ? "Archive" : "Restore"}
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{active ? `Archive ${planName}?` : `Restore ${planName}?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {active
                ? `It stops being offered to new subscriptions.${companies > 0 ? ` ${onIt} on it and keep it, with the same panels and limits.` : ""} Plans are never deleted; you can restore it at any time.`
                : "It can be chosen for new subscriptions again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirm} disabled={pending}>
              {pending ? "Saving…" : active ? "Archive" : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {error && !open && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
