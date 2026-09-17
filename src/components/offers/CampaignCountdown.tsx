"use client";

import { useEffect, useState } from "react";

function diff(endDate: string) {
  const total = Math.max(new Date(endDate).getTime() - Date.now(), 0);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { total, days, hours, minutes, seconds };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-muted/30 border border-border/50 px-4 py-3 min-w-[64px]">
      <span className="text-2xl font-black tabular-nums text-foreground sm:text-3xl">{String(value).padStart(2, "0")}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}

/** Live countdown driven entirely by `campaign.endDate` — never hardcoded. */
export default function CampaignCountdown({ endDate }: { endDate: string }) {
  const [time, setTime] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser clock only exists client-side; avoids an SSR/hydration mismatch
    setTime(diff(endDate));
    const interval = setInterval(() => setTime(diff(endDate)), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!time) return null; // avoid SSR/client mismatch — renders after mount only

  if (time.total <= 0) {
    return <p className="text-sm font-semibold text-muted-foreground">This offer has just ended.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Offer Ends In</p>
      <div className="flex items-center gap-2 sm:gap-3" role="timer" aria-live="off">
        <Unit value={time.days} label="Days" />
        <Unit value={time.hours} label="Hours" />
        <Unit value={time.minutes} label="Minutes" />
        <Unit value={time.seconds} label="Seconds" />
      </div>
    </div>
  );
}
