"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CampaignCountdown from "@/components/offers/CampaignCountdown";
import { useOfferClaim } from "@/components/offers/OfferClaimProvider";
import { isClaimHref } from "@/lib/offers/constants";
import { useOfferTracking } from "@/lib/useOfferTracking";
import { popupMayShow, markPopupShown, markPopupClosed } from "@/lib/offers/popup-frequency";
import type { ActiveDisplayPopup } from "@/lib/useActiveCampaignDisplay";

export default function OfferPopup({
  campaign,
  popup,
  endDate,
}: {
  campaign: { id: string; slug: string; name: string; startDate?: string };
  popup: ActiveDisplayPopup;
  endDate: string;
}) {
  const [open, setOpen] = useState(false);
  const track = useOfferTracking(campaign.id);
  const { openClaim, isClaimOpen } = useOfferClaim();

  useEffect(() => {
    // Deliberately no "already armed" ref guard here — React (Strict Mode,
    // dev only) runs this effect through mount→cleanup→mount once, and a
    // ref-based guard would survive that cleanup and block the second real
    // arm, silently killing the trigger in dev while working by accident in
    // production. The effect's own cleanup (clearTimeout/removeEventListener
    // below) is what actually prevents double-arming — trust it instead.
    if (!popupMayShow(campaign.id, popup.frequency)) return;

    function show() {
      // Never open on top of the claim form (or vice versa) — two stacked modals steal each other's focus and one of them closes.
      if (isClaimOpen()) return;
      setOpen(true);
      markPopupShown(campaign.id, popup.frequency);
      track("popup_view", {});
    }

    if (popup.trigger.type === "immediate") {
      show();
      return;
    }

    if (popup.trigger.type === "delay") {
      const timer = setTimeout(show, Math.max(popup.trigger.value, 0) * 1000);
      return () => clearTimeout(timer);
    }

    if (popup.trigger.type === "scroll") {
      const threshold = Math.min(Math.max(popup.trigger.value, 1), 100) / 100;
      function onScroll() {
        const doc = document.documentElement;
        const scrolled = doc.scrollTop / Math.max(doc.scrollHeight - doc.clientHeight, 1);
        if (scrolled >= threshold) {
          show();
          window.removeEventListener("scroll", onScroll);
        }
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    if (popup.trigger.type === "exit_intent") {
      if (window.matchMedia?.("(pointer: coarse)").matches) return; // touch device — no reliable exit signal
      function onMouseLeave(e: MouseEvent) {
        if (e.clientY > 0) return;
        show();
        document.removeEventListener("mouseleave", onMouseLeave);
      }
      document.addEventListener("mouseleave", onMouseLeave);
      return () => document.removeEventListener("mouseleave", onMouseLeave);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign.id]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      markPopupClosed(campaign.id);
      track("popup_close", {});
    }
  }

  /**
   * "Claim Offer": close this popup on purpose, THEN open the claim sheet once the dialog's exit animation has
   * finished. Navigating away instead (the old behaviour) left the dialog mounted on top of the destination page.
   */
  function handleCta(e: React.MouseEvent) {
    track("popup_click", {});
    setOpen(false);
    markPopupClosed(campaign.id);
    if (isClaimHref(popup.ctaHref)) {
      e.preventDefault();
      setTimeout(() => openClaim({ offerId: popup.offerId }), 220);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="text-center">
        <div className="px-6 pt-10 pb-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl shadow-lg shadow-primary/20" aria-hidden="true">
            {popup.emoji}
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">{popup.heading}</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">{campaign.name}</h2>
          <p className="mt-2 text-lg font-black text-primary">{popup.offerBadge}</p>
          <p className="mt-1 text-sm text-muted-foreground">{popup.offerTitle}</p>

          {popup.showCountdown && (
            <div className="mt-5 flex justify-center">
              <CampaignCountdown endDate={endDate} startDate={campaign.startDate} />
            </div>
          )}

          <Link
            href={popup.ctaHref}
            onClick={handleCta}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            {popup.ctaText}
          </Link>
          <button type="button" onClick={() => handleOpenChange(false)} className="mt-3 text-xs text-muted-foreground hover:text-foreground hover:underline">
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
