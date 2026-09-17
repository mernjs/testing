"use client";

import { useEffect } from "react";
import { useActiveCampaignDisplay } from "@/lib/useActiveCampaignDisplay";
import OfferTopStrip from "@/components/offers/OfferTopStrip";
import OfferPopup from "@/components/offers/OfferPopup";

/**
 * Single global mount point for the top strip + popup (rendered once, in
 * `(site)/layout.tsx`, before <Header/>) — one shared campaign-display fetch
 * feeds both, so there's exactly one strip and one popup ever on screen,
 * never stacked or duplicated. Renders nothing when no campaign is live or
 * the campaign API is unreachable — the rest of the site never depends on
 * this succeeding.
 */
export default function OfferPromotions() {
  const display = useActiveCampaignDisplay();

  // Keep the Header/`<main>` offset correct even while no strip is mounted
  // (e.g. between campaigns) — OfferTopStrip itself takes over this
  // property once it mounts.
  useEffect(() => {
    if (!display.strip) document.documentElement.style.setProperty("--offer-strip-h", "0px");
  }, [display.strip]);

  if (!display.active || !display.campaign) return null;

  return (
    <>
      {display.strip && <OfferTopStrip campaign={display.campaign} strip={display.strip} endDate={display.campaign.endDate} />}
      {display.popup && <OfferPopup campaign={display.campaign} popup={display.popup} endDate={display.campaign.endDate} />}
    </>
  );
}
