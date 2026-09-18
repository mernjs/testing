import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { createPaymentLink, CreatePaymentLinkInput } from "@/lib/fms/payments/links";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sourceTransactionId, ...rest } = body;

    const input: CreatePaymentLinkInput = {
      title: rest.title,
      description: rest.description,
      amount: Number(rest.amount),
      currency: rest.currency || "INR",
      customerId: rest.customerId,
      customerName: rest.customerName || "Customer",
      customerEmail: rest.customerEmail,
      customerPhone: rest.customerPhone,
      sourceModule: rest.sourceModule || "DIRECT",
      sourceRecordId: rest.sourceRecordId,
      invoiceId: rest.invoiceId,
      expiresInDays: rest.expiresInDays ? Number(rest.expiresInDays) : 7,
    };

    if (!input.title || !input.amount || !input.customerEmail) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: title, amount, customerEmail" },
        { status: 400 }
      );
    }

    const res = await createPaymentLink(input);
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: res.reason }, { status: 400 });
    }

    // ── Stamp the source transaction with the generated link URL ──
    if (sourceTransactionId && res.publicUrl) {
      const db = await getDb();
      const now = new Date();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.collection("fms_transactions").updateOne(
        { _id: sourceTransactionId } as any,
        {
          $set: {
            paymentLink: res.publicUrl,
            paymentLinkToken: res.paymentLink?.token,
            paymentLinkSentAt: now,
            status: "link_sent",
            updatedAt: now,
          },
        }
      );
    }

    return NextResponse.json({
      ok: true,
      paymentLink: res.paymentLink,
      publicUrl: res.publicUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
