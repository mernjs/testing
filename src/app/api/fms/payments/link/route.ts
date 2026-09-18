import { NextResponse } from "next/server";
import { createPaymentLink, CreatePaymentLinkInput } from "@/lib/fms/payments/links";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const input: CreatePaymentLinkInput = {
      title: body.title,
      description: body.description,
      amount: Number(body.amount),
      currency: body.currency || "INR",
      customerId: body.customerId,
      customerName: body.customerName || "Customer",
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      sourceModule: body.sourceModule || "DIRECT",
      sourceRecordId: body.sourceRecordId,
      invoiceId: body.invoiceId,
      expiresInDays: body.expiresInDays ? Number(body.expiresInDays) : 7,
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
