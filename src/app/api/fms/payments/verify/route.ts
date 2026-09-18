import { NextResponse } from "next/server";
import { getPaymentIntent, markPaymentIntentSuccessful, markPaymentIntentFailed } from "@/lib/fms/payments/intents";
import { getPaymentProvider } from "@/lib/fms/payments/provider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { intentId, gatewayPaymentId, gatewaySignature, utr, paymentMethod } = body;

    if (!intentId) {
      return NextResponse.json({ ok: false, error: "Missing intentId" }, { status: 400 });
    }

    const intent = await getPaymentIntent(intentId);
    if (!intent) {
      return NextResponse.json({ ok: false, error: "Payment intent not found" }, { status: 404 });
    }

    if (intent.status === "SUCCESS") {
      return NextResponse.json({ ok: true, intent, message: "Payment already verified as successful" });
    }

    const provider = getPaymentProvider(intent.paymentProvider);
    if (gatewayPaymentId) {
      const statusRes = await provider.getPaymentStatus(gatewayPaymentId);
      if (statusRes.ok && statusRes.status === "SUCCESS") {
        const markRes = await markPaymentIntentSuccessful(intentId, {
          gatewayPaymentId,
          gatewaySignature,
          utr: utr || statusRes.utr,
          paymentMethod: paymentMethod || (statusRes.paymentMethod as any),
        });
        return NextResponse.json({ ok: markRes.ok, intent: markRes.intent });
      } else if (statusRes.ok && statusRes.status === "FAILED") {
        await markPaymentIntentFailed(intentId, statusRes.failureReason || "Payment verification failed");
        return NextResponse.json({ ok: false, error: "Payment failed at gateway" });
      }
    }

    if (intent.paymentProvider === "mock" || intent.paymentProvider === "offline") {
      const markRes = await markPaymentIntentSuccessful(intentId, {
        gatewayPaymentId: gatewayPaymentId || `mock_${Date.now()}`,
        utr: utr || `UTR_MOCK_${Date.now()}`,
        paymentMethod: paymentMethod || "UPI",
      });
      return NextResponse.json({ ok: markRes.ok, intent: markRes.intent });
    }

    return NextResponse.json({ ok: false, status: intent.status, message: "Payment pending completion" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
