import "server-only";

/**
 * SaaS invoices the platform issues to its customer companies (platform-level
 * `saas_invoices`). CONTRACT ONLY — implemented by the invoices workstream.
 * The subscriptions workstream calls `issueSaasInvoice` on every successful
 * charge; it must be idempotent on `paymentRef`.
 */

export interface IssueSaasInvoiceInput {
  companyId: string;
  planId: string;
  interval: "monthly" | "yearly";
  periodStart: Date;
  periodEnd: Date;
  /** Amount charged, smallest currency unit, tax-inclusive. */
  amount: number;
  currency: string;
  /** Provider payment id — the idempotency key. */
  paymentRef: string;
}

export interface SaasInvoiceRef {
  id: string;
  number: string;
}

export async function issueSaasInvoice(input: IssueSaasInvoiceInput): Promise<SaasInvoiceRef | null> {
  void input;
  return null;
}
