import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Salary payout disbursement providers. `manual` (HR records the UTR after
 * paying through their own bank) is the default; `razorpay` (RazorpayX Payouts)
 * is a real integration, activated by env config.
 */

export interface BeneficiaryInput {
  contactName: string;
  contactEmail: string;
  contactReference: string; // employeeId
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
}

export interface CreatePayoutInput {
  payoutId: string; // our internal id — used as the idempotency key
  amountPaise: number;
  fundAccountId: string;
  referenceId: string; // e.g. "SAL-2026-09-YO-0001"
  narration: string;
}

export interface WebhookResult {
  providerPayoutId: string;
  status: "paid" | "failed" | "reversed";
  utr?: string;
  failureReason?: string;
}

export interface PayoutProvider {
  key: "manual" | "razorpay";
  ensureBeneficiary(input: BeneficiaryInput): Promise<{ providerContactId: string; providerFundAccountId: string }>;
  createPayout(input: CreatePayoutInput): Promise<{ providerPayoutId: string; status: "processing" | "paid" }>;
  verifyWebhook(rawBody: string, signature: string | null): boolean;
  parseWebhook(json: unknown): WebhookResult | null;
}

// ---------------------------------------------------------------------------
// Manual
// ---------------------------------------------------------------------------

const manualProvider: PayoutProvider = {
  key: "manual",
  async ensureBeneficiary() {
    return { providerContactId: "", providerFundAccountId: "" };
  },
  async createPayout() {
    throw new Error("MANUAL_PROVIDER");
  },
  verifyWebhook() {
    return false;
  },
  parseWebhook() {
    return null;
  },
};

// ---------------------------------------------------------------------------
// RazorpayX Payouts — https://razorpay.com/docs/api/x/
// ---------------------------------------------------------------------------

const RZP_BASE = "https://api.razorpay.com/v1";

function rzpAuthHeader(): string {
  const id = process.env.RAZORPAY_KEY_ID ?? "";
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

async function rzpFetch(path: string, init: RequestInit & { idempotencyKey?: string } = {}): Promise<Record<string, unknown>> {
  const { idempotencyKey, ...rest } = init;
  const res = await fetch(`${RZP_BASE}${path}`, {
    ...rest,
    headers: {
      Authorization: rzpAuthHeader(),
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "X-Payout-Idempotency": idempotencyKey } : {}),
      ...(rest.headers ?? {}),
    },
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const errObj = body.error as { description?: string } | undefined;
    throw new Error(`RazorpayX ${res.status}: ${errObj?.description ?? JSON.stringify(body)}`);
  }
  return body;
}

const razorpayProvider: PayoutProvider = {
  key: "razorpay",

  async ensureBeneficiary(input) {
    const contact = await rzpFetch("/contacts", {
      method: "POST",
      body: JSON.stringify({
        name: input.contactName,
        email: input.contactEmail || undefined,
        type: "employee",
        reference_id: input.contactReference,
      }),
    });
    const contactId = String(contact.id);

    const fundAccount = await rzpFetch("/fund_accounts", {
      method: "POST",
      body: JSON.stringify({
        contact_id: contactId,
        account_type: "bank_account",
        bank_account: {
          name: input.accountHolderName,
          ifsc: input.ifsc,
          account_number: input.accountNumber,
        },
      }),
    });
    return { providerContactId: contactId, providerFundAccountId: String(fundAccount.id) };
  },

  async createPayout(input) {
    const sourceAccount = process.env.RAZORPAY_ACCOUNT_NUMBER;
    if (!sourceAccount) throw new Error("RAZORPAY_ACCOUNT_NUMBER is not set.");
    const body = await rzpFetch("/payouts", {
      method: "POST",
      idempotencyKey: input.payoutId,
      body: JSON.stringify({
        account_number: sourceAccount,
        fund_account_id: input.fundAccountId,
        amount: input.amountPaise,
        currency: "INR",
        mode: "IMPS",
        purpose: "salary",
        queue_if_low_balance: true,
        reference_id: input.referenceId,
        narration: input.narration.slice(0, 30),
      }),
    });
    const status = String(body.status);
    return {
      providerPayoutId: String(body.id),
      status: status === "processed" ? "paid" : "processing",
    };
  },

  verifyWebhook(rawBody, signature) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret || !signature) return false;
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  },

  parseWebhook(json) {
    const payload = json as {
      event?: string;
      payload?: { payout?: { entity?: { id?: string; utr?: string; status_details?: { description?: string } } } };
    };
    const payout = payload.payload?.payout?.entity;
    if (!payout?.id) return null;
    const map: Record<string, WebhookResult["status"]> = {
      "payout.processed": "paid",
      "payout.failed": "failed",
      "payout.reversed": "reversed",
      "payout.rejected": "failed",
    };
    const status = map[payload.event ?? ""];
    if (!status) return null;
    return {
      providerPayoutId: payout.id,
      status,
      utr: payout.utr,
      failureReason: payout.status_details?.description,
    };
  },
};

export function getPayoutProvider(): PayoutProvider {
  if (process.env.HRMS_PAYOUT_PROVIDER === "razorpay" && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return razorpayProvider;
  }
  return manualProvider;
}
