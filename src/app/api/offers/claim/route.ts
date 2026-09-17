import { NextRequest, NextResponse } from "next/server";
import { createLead, validateLeadInput } from "@/lib/leads";
import { provisionLeadAndAccount } from "@/lib/lead-management/provision";
import { CATEGORY_TO_SOURCE } from "@/lib/lead-management/types";
import { createPortalSession, setPortalSessionCookie } from "@/lib/portal-auth";
import { getCampaign } from "@/lib/offers/campaigns";
import { getOffer } from "@/lib/offers/offers";
import { validateCoupon, redeemCoupon } from "@/lib/offers/coupons";
import { createOfferClaim } from "@/lib/offers/claims";
import { validateClaimInput, formatClaimMessage } from "@/lib/offers/claim-validation";
import { isValidAudience, getCampaignEffectiveStatus, DEFAULT_CURRENCY } from "@/lib/offers/constants";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const campaignId = typeof body.campaignId === "string" ? body.campaignId : "";
  const offerId = typeof body.offerId === "string" ? body.offerId : "";
  const audience = body.audience;
  const couponCodeRaw = typeof body.couponCode === "string" ? body.couponCode.trim() : "";
  const fields = (body.fields ?? {}) as Record<string, unknown>;
  const utm = (body.utm ?? {}) as Record<string, unknown>;

  if (!isValidAudience(audience) || !["CLIENT", "STUDENT", "INTERN", "HIRING"].includes(audience)) {
    return NextResponse.json({ error: "Invalid audience." }, { status: 400 });
  }
  const claimAudience = audience as "CLIENT" | "STUDENT" | "INTERN" | "HIRING";

  // Re-resolve the campaign and offer server-side — never trust that what the
  // client displayed is still live. Expired/paused offers can't be claimed.
  const [campaign, offer] = await Promise.all([getCampaign(campaignId), getOffer(offerId)]);
  if (!campaign || !offer || offer.campaignId !== campaignId) {
    return NextResponse.json({ error: "This offer is no longer available." }, { status: 404 });
  }
  const now = new Date();
  const campaignLive = getCampaignEffectiveStatus(campaign.status, campaign.startDate, campaign.endDate, now) === "active";
  const offerLive = offer.status === "active" && offer.validFrom <= now && offer.validUntil >= now;
  if (!campaignLive || !offerLive) {
    return NextResponse.json({ error: "This offer has expired." }, { status: 410 });
  }

  const claimValidation = validateClaimInput(claimAudience, fields);
  if (!claimValidation.valid) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", fields: claimValidation.errors }, { status: 422 });
  }
  const { contact, audienceFields } = claimValidation;

  // Server-side pricing — always recomputed here, client-submitted price fields are never trusted.
  const originalPrice = offer.pricing.mode !== "custom_quote" ? offer.pricing.originalPrice : undefined;
  const currency = offer.pricing.currency ?? DEFAULT_CURRENCY;
  let offerDiscountAmount = 0;
  if (originalPrice) {
    if (offer.pricing.mode === "percentage" && offer.pricing.percentage) offerDiscountAmount = originalPrice * (offer.pricing.percentage / 100);
    else if (offer.pricing.mode === "flat" && offer.pricing.flatDiscountAmount) offerDiscountAmount = offer.pricing.flatDiscountAmount;
  }

  let couponDiscountAmount = 0;
  let redeemedCouponId: string | null = null;
  let couponCode: string | undefined;
  if (couponCodeRaw) {
    const result = await validateCoupon(couponCodeRaw, {
      campaignId,
      category: offer.category,
      subService: offer.subService,
      audience: claimAudience,
      orderValue: originalPrice,
      userEmail: contact.email,
    });
    if (!result.ok) return NextResponse.json({ error: result.error, fields: { couponCode: result.error } }, { status: 422 });
    couponDiscountAmount = result.discountAmount;
    redeemedCouponId = result.coupon._id;
    couponCode = result.coupon.code;

    const redemption = await redeemCoupon(result.coupon._id);
    if (!redemption.ok) return NextResponse.json({ error: redemption.error, fields: { couponCode: redemption.error } }, { status: 422 });
  }

  const totalDiscountApplied = originalPrice != null ? Math.min(offerDiscountAmount + couponDiscountAmount, originalPrice) : undefined;
  const finalPrice = originalPrice != null && totalDiscountApplied != null ? originalPrice - totalDiscountApplied : undefined;

  // Base contact record flows through the real leads pipeline unchanged — same
  // validation + UTM/ad-platform attribution every other public form uses.
  const leadValidation = validateLeadInput({
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    message: formatClaimMessage(offer.title, audienceFields),
    subService: offer.subService !== "all" ? offer.subService : undefined,
    source: "offer_claim",
    utmSource: utm.source,
    utmMedium: utm.medium,
    utmCampaign: utm.campaign,
    utmContent: utm.content,
    utmTerm: utm.term,
  });
  if (!leadValidation.valid) {
    return NextResponse.json({ error: "Validation failed.", fields: leadValidation.errors }, { status: 422 });
  }

  try {
    const lead = await createLead(offer.category, leadValidation.data);

    let portal: { redirect: string; isNewAccount: boolean; tempPassword: string | null } | undefined;
    try {
      const result = await provisionLeadAndAccount({
        source: CATEGORY_TO_SOURCE[offer.category],
        name: leadValidation.data.name,
        email: leadValidation.data.email as string,
        phone: leadValidation.data.phone,
        subService: leadValidation.data.subService ?? null,
        message: leadValidation.data.message ?? null,
        sourceRef: { kind: "category_lead", category: offer.category, id: String(lead._id) },
      });
      const { token } = await createPortalSession(result.externalUserId, false);
      await setPortalSessionCookie(token, false);
      portal = { redirect: "/portal", isNewAccount: result.isNewAccount, tempPassword: result.tempPassword };
    } catch (provErr) {
      console.error("Offer claim: lead provisioning failed (claim still saved)", provErr);
    }

    const claim = await createOfferClaim({
      leadId: String(lead._id),
      category: offer.category,
      leadEmail: contact.email,
      campaignId,
      offerId,
      couponCode,
      audience: claimAudience,
      audienceFields,
      pricing: { originalPrice, offerDiscountAmount: originalPrice ? offerDiscountAmount : undefined, couponDiscountAmount: redeemedCouponId ? couponDiscountAmount : undefined, totalDiscountApplied, finalPrice, currency },
    });

    return NextResponse.json(
      { data: { claimId: claim._id }, pricing: claim.pricing, portal },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to create offer claim", err);
    return NextResponse.json({ error: "Failed to save your claim. Please try again." }, { status: 500 });
  }
}
