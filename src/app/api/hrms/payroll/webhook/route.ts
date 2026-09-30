import { NextRequest, NextResponse } from "next/server";
import { getPayoutProvider } from "@/lib/hrms/payout-provider";
import { applyWebhookResult } from "@/lib/hrms/salary-payouts";

/**
 * Payout-provider webhook (RazorpayX). Each company registers this URL on its
 * OWN host (Settings → Payments & payouts), so the company comes from the Host
 * header and the signature is checked with that company's webhook secret; a
 * company without payouts connected gets 404, one without a webhook secret 400.
 * The raw body is needed for signature verification, so it is read as text
 * before parsing.
 */
export async function POST(req: NextRequest) {
  const provider = await getPayoutProvider();
  if (provider.key === "manual") {
    return NextResponse.json({ error: "No payout provider configured." }, { status: 404 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  if (!provider.verifyWebhook(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }

  const result = provider.parseWebhook(json);
  if (result) {
    await applyWebhookResult(result);
  }
  // Always 200 so the provider stops retrying handled events.
  return NextResponse.json({ ok: true });
}
