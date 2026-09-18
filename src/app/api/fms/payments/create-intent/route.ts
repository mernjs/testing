import { NextResponse } from "next/server";
import { createPaymentIntent, CreatePaymentIntentData } from "@/lib/fms/payments/intents";
import { acquireIdempotencyLock, releaseIdempotencyLock } from "@/lib/fms/payments/idempotency";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idempotencyKey = req.headers.get("x-idempotency-key") || body.idempotencyKey;

    if (idempotencyKey) {
      const lock = await acquireIdempotencyLock(idempotencyKey, "create_payment_intent");
      if (!lock.acquired && lock.cachedResponse) {
        return NextResponse.json(lock.cachedResponse);
      }
    }

    const input: CreatePaymentIntentData = {
      sourceModule: body.sourceModule,
      sourceType: body.sourceType,
      sourceId: body.sourceId,
      customerId: body.customerId,
      customerName: body.customerName || "Customer",
      customerEmail: body.customerEmail || "customer@yashorbit.com",
      customerPhone: body.customerPhone,
      invoiceId: body.invoiceId,
      amount: Number(body.amount),
      walletCreditsUsed: body.walletCreditsUsed ? Number(body.walletCreditsUsed) : 0,
      offerDiscountAmount: body.offerDiscountAmount ? Number(body.offerDiscountAmount) : 0,
      currency: body.currency || "INR",
      paymentMethod: body.paymentMethod || "UPI",
      paymentProvider: body.paymentProvider || "mock",
      idempotencyKey,
      metadata: body.metadata,
    };

    if (!input.sourceModule || !input.sourceType || !input.sourceId || !input.amount) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: sourceModule, sourceType, sourceId, amount" },
        { status: 400 }
      );
    }

    const res = await createPaymentIntent(input);
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: res.reason }, { status: 400 });
    }

    const responseData = {
      ok: true,
      paymentIntent: res.intent,
      checkoutUrl: res.intent.checkoutUrl,
      clientSecret: res.intent.paymentSessionId,
      gatewayOrderId: res.intent.gatewayOrderId,
    };

    if (idempotencyKey) {
      await releaseIdempotencyLock(idempotencyKey, responseData);
    }

    return NextResponse.json(responseData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
