import "server-only";
import { createHmac } from "node:crypto";
import {
  PaymentProvider,
  CreateProviderIntentParams,
  ProviderIntentResult,
  CreateProviderLinkParams,
  ProviderLinkResult,
  ProviderPaymentStatusResult,
  ProviderRefundParams,
  ProviderRefundResult,
  registerPaymentProvider,
} from "../provider";

export const RazorpayProvider: PaymentProvider = {
  id: "razorpay",
  name: "Razorpay Payment Gateway",

  async createPaymentIntent(params: CreateProviderIntentParams): Promise<ProviderIntentResult> {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return { ok: false, error: "Razorpay credentials not configured in environment." };
    }

    try {
      const amountInPaisa = Math.round(params.amountInRupees * 100);
      const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaisa,
          currency: params.currency || "INR",
          receipt: params.paymentNumber,
          notes: {
            intentId: params.intentId,
            customerEmail: params.customerEmail,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error?.description || "Razorpay Order Creation Failed" };
      }

      return {
        ok: true,
        providerOrderId: data.id,
        rawPayload: data,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  },

  async createPaymentLink(params: CreateProviderLinkParams): Promise<ProviderLinkResult> {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return { ok: false, error: "Razorpay API keys not configured." };
    }

    try {
      const amountInPaisa = Math.round(params.amount * 100);
      const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

      const res = await fetch("https://api.razorpay.com/v1/payment_links", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaisa,
          currency: params.currency || "INR",
          accept_partial: false,
          description: params.description,
          customer: {
            name: params.customerName,
            email: params.customerEmail,
            contact: params.customerPhone,
          },
          notify: {
            sms: true,
            email: true,
          },
          reminder_enable: true,
          notes: {
            linkId: params.linkId,
            token: params.token,
          },
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/pay/${params.token}`,
          callback_method: "get",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error?.description || "Failed to create Razorpay Payment Link" };
      }

      return {
        ok: true,
        providerLinkId: data.id,
        shortUrl: data.short_url,
        rawPayload: data,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, error: message };
    }
  },

  async getPaymentStatus(providerPaymentId: string): Promise<ProviderPaymentStatusResult> {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return { ok: false, status: "FAILED", failureReason: "API credentials missing" };
    }

    try {
      const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
      const res = await fetch(`https://api.razorpay.com/v1/payments/${providerPaymentId}`, {
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, status: "FAILED", failureReason: data.error?.description };
      }

      const status = data.status === "captured" ? "SUCCESS" : data.status === "failed" ? "FAILED" : "PENDING";
      return {
        ok: true,
        status,
        providerPaymentId: data.id,
        providerOrderId: data.order_id,
        paymentMethod: data.method,
        utr: data.acquirer_data?.rrn || data.acquirer_data?.upi_transaction_id,
        rawPayload: data,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, status: "FAILED", failureReason: message };
    }
  },

  async refundPayment(params: ProviderRefundParams): Promise<ProviderRefundResult> {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return { ok: false, status: "FAILED", error: "API credentials missing" };
    }

    try {
      const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
      const amountInPaisa = Math.round(params.refundAmount * 100);

      const res = await fetch(`https://api.razorpay.com/v1/payments/${params.providerPaymentId}/refund`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaisa,
          notes: { reason: params.reason || "Customer refund" },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { ok: false, status: "FAILED", error: data.error?.description || "Refund failed" };
      }

      return {
        ok: true,
        providerRefundId: data.id,
        status: "PROCESSED",
        rawPayload: data,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, status: "FAILED", error: message };
    }
  },

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    if (!signature || !secret) return false;
    const expectedSignature = createHmac("sha256", secret).update(payload).digest("hex");
    return expectedSignature === signature;
  },
};

registerPaymentProvider(RazorpayProvider);
