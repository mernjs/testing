import { NextResponse } from "next/server";
import { processPaymentWebhook } from "@/lib/fms/payments/webhooks";
import { PaymentProviderId } from "@/lib/fms/payments/provider";

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
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
