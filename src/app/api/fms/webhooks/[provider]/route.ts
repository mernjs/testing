import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { processPaymentWebhook } from "@/lib/fms/payments/webhooks";
import { PaymentProviderId } from "@/lib/fms/payments/provider";

/**
 * Payment-gateway webhooks. Each company registers this URL on its OWN host
 * (Settings → Payments & payouts shows it), so the company comes from the Host
 * header like any request, and the signature is checked against that
 * company's webhook secret. An unknown host is a 404.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const providerId = provider as PaymentProviderId;
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || req.headers.get("stripe-signature") || "";

    const res = await processPaymentWebhook(providerId, rawBody, signature);
    return NextResponse.json({ ok: res.ok, message: res.message }, { status: res.status });
  } catch (err: unknown) {
    // notFound() from an unknown host must stay a 404, not become a 500.
    unstable_rethrow(err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
