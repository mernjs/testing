"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2, Tag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LeadSuccessState from "@/components/sections/LeadSuccessState";
import { useClaimOfferSubmit, SUCCESS_AUTO_HIDE_MS, type ClaimOfferFields } from "@/lib/useClaimOfferSubmit";
import { useOfferTracking } from "@/lib/useOfferTracking";
import { formatOfferBadge } from "@/lib/offers/constants";
import { formatCurrency } from "@/lib/utils";
import type { SerializedOffer } from "@/lib/offers/offers";
import type { Audience } from "@/lib/offers/constants";

function claimAudienceFor(offer: SerializedOffer): Extract<Audience, "CLIENT" | "STUDENT" | "INTERN" | "HIRING"> {
  if (offer.category === "internship-program") return "INTERN";
  if (offer.category === "resource-augmentation") return "HIRING";
  if (offer.category === "industrial-training") return "STUDENT";
  return "CLIENT";
}

const EMPTY_FIELDS: ClaimOfferFields = { name: "", email: "", phone: "" };

export default function ClaimOfferModal({
  offer,
  campaignId,
  onOpenChange,
}: {
  offer: SerializedOffer | null;
  campaignId: string;
  onOpenChange: (open: boolean) => void;
}) {
  const { status, error, fieldErrors, submit, reset } = useClaimOfferSubmit();
  const [fields, setFields] = useState<ClaimOfferFields>(EMPTY_FIELDS);
  const [couponCode, setCouponCode] = useState("");
  const [couponPreview, setCouponPreview] = useState<{ ok: boolean; message: string } | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const track = useOfferTracking(campaignId);
  const formStartFired = useRef<string | null>(null);

  const open = Boolean(offer);
  const audience = offer ? claimAudienceFor(offer) : "CLIENT";

  useEffect(() => {
    if (!offer || formStartFired.current === offer._id) return;
    formStartFired.current = offer._id;
    track("form_start", { offerId: offer._id, category: offer.category, audience });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer?._id]);

  function set<K extends keyof ClaimOfferFields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  async function checkCoupon() {
    if (!offer || !couponCode.trim()) return;
    track("coupon_apply", { offerId: offer._id, category: offer.category, audience });
    setCheckingCoupon(true);
    setCouponPreview(null);
    try {
      const res = await fetch("/api/offers/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, offerId: offer._id, audience, couponCode }),
      });
      const json = await res.json();
      if (!res.ok) setCouponPreview({ ok: false, message: json?.error ?? "That coupon isn't valid." });
      else setCouponPreview({ ok: true, message: `Applies! Estimated extra savings: ${formatCurrency(json.discountAmount, offer.pricing.currency)}` });
    } catch {
      setCouponPreview({ ok: false, message: "Couldn't check that coupon right now." });
    } finally {
      setCheckingCoupon(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!offer) return;
    await submit({ campaignId, offerId: offer._id, audience, couponCode: couponCode.trim() || undefined, fields });
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setFields(EMPTY_FIELDS);
        setCouponCode("");
        setCouponPreview(null);
        reset();
      }, 200);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0">
        <SheetHeader className="border-b border-border/50">
          <SheetTitle>{offer ? offer.title : "Claim this offer"}</SheetTitle>
          {offer && <SheetDescription>{offer.badgeText || formatOfferBadge(offer.pricing)} — claim this festival offer</SheetDescription>}
        </SheetHeader>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <LeadSuccessState
                key="success"
                title="Offer claimed!"
                description="Our team will reach out shortly with your confirmed discount and next steps."
                onDismiss={reset}
                autoHideMs={SUCCESS_AUTO_HIDE_MS}
              />
            ) : (
              <form key="form" onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input value={fields.name} onChange={(e) => set("name", e.target.value)} required />
                  {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" value={fields.email} onChange={(e) => set("email", e.target.value)} required />
                    {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input value={fields.phone} onChange={(e) => set("phone", e.target.value)} required />
                    {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
                  </div>
                </div>

                {(audience === "CLIENT" || audience === "HIRING") && (
                  <>
                    <div className="space-y-1.5">
                      <Label>Company (optional)</Label>
                      <Input value={fields.company ?? ""} onChange={(e) => set("company", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Budget range (optional)</Label>
                      <Input value={fields.budgetRange ?? ""} onChange={(e) => set("budgetRange", e.target.value)} placeholder="e.g. ₹1L–3L" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Message (optional)</Label>
                      <textarea
                        value={fields.message ?? ""}
                        onChange={(e) => set("message", e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
                      />
                    </div>
                  </>
                )}

                {audience === "STUDENT" && (
                  <>
                    <div className="space-y-1.5">
                      <Label>College / University</Label>
                      <Input value={fields.college ?? ""} onChange={(e) => set("college", e.target.value)} required />
                      {fieldErrors.college && <p className="text-xs text-destructive">{fieldErrors.college}</p>}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Graduation year (optional)</Label>
                        <Input value={fields.graduationYear ?? ""} onChange={(e) => set("graduationYear", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Experience level (optional)</Label>
                        <Input value={fields.experienceLevel ?? ""} onChange={(e) => set("experienceLevel", e.target.value)} placeholder="Fresher / 1-2 yrs" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Program interested in (optional)</Label>
                      <Input value={fields.program ?? ""} onChange={(e) => set("program", e.target.value)} />
                    </div>
                  </>
                )}

                {audience === "INTERN" && (
                  <>
                    <div className="space-y-1.5">
                      <Label>College / University</Label>
                      <Input value={fields.college ?? ""} onChange={(e) => set("college", e.target.value)} required />
                      {fieldErrors.college && <p className="text-xs text-destructive">{fieldErrors.college}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Internship track (optional)</Label>
                      <Input value={fields.track ?? ""} onChange={(e) => set("track", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Skills (optional)</Label>
                      <Input value={fields.skills ?? ""} onChange={(e) => set("skills", e.target.value)} />
                    </div>
                  </>
                )}

                <div className="space-y-1.5 rounded-xl border border-dashed border-border/60 p-3">
                  <Label className="flex items-center gap-1.5"><Tag className="size-3.5" /> Coupon code (optional)</Label>
                  <div className="flex gap-2">
                    <Input value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponPreview(null); }} placeholder="FESTIVE90" className="font-mono" />
                    <Button type="button" variant="outline" size="sm" onClick={checkCoupon} disabled={checkingCoupon || !couponCode.trim()}>
                      {checkingCoupon ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                  {couponPreview && (
                    <p className={`text-xs ${couponPreview.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>{couponPreview.message}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground">Final pricing and coupon eligibility are always re-checked when you submit.</p>
                </div>

                <Button type="submit" className="w-full" disabled={status === "submitting"}>
                  {status === "submitting" ? <Loader2 className="size-4 animate-spin" /> : "Claim Offer"}
                </Button>
                <p className="text-center text-[11px] text-muted-foreground">
                  By submitting, you agree to be contacted about this offer. See our{" "}
                  <a href="/about/terms-and-conditions" className="underline">terms</a>.
                </p>
              </form>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
