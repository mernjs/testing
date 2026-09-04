"use client";

import { useState, useTransition } from "react";
import { LEAD_STATUSES } from "@/lib/lead-status";
import { updateStatusAction } from "./actions";

export default function StatusSelect({ category, id, initialStatus }: { category: string; id: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const previous = status;
    setStatus(next);
    setError(null);
    startTransition(async () => {
      const result = await updateStatusAction(category, id, next);
      if (result.error) {
        setStatus(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-1.5">
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm disabled:opacity-60"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
