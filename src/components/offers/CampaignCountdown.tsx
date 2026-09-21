"use client";

import LiveCountdown from "@/components/offers/LiveCountdown";

/** Hero / deal-of-the-day countdown — thin wrapper over the shared `LiveCountdown` (server-accurate clock, urgency states, progress bar). */
export default function CampaignCountdown({
  endDate,
  startDate,
  label,
  onExpire,
}: {
  endDate: string;
  startDate?: string;
  label?: string;
  onExpire?: () => void;
}) {
  return <LiveCountdown endDate={endDate} startDate={startDate} label={label} onExpire={onExpire} variant="boxes" />;
}
