import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { getDb } from "@/lib/mongodb";
import { currentCompanyId, isPlatformOwnerContext } from "@/lib/platform/tenancy/context";
import { companySiteUrl } from "@/lib/platform/tenancy/site-url";

/**
 * A company's own payment & payout account (Razorpay + RazorpayX), used to
 * collect its customers' payments (FMS payment intents/links, webhooks) and
 * pay its employees' salaries (HRMS payouts, payroll webhook).
 *
 * Credential resolution — `resolveRazorpayCredentials(purpose)`:
 *  1. the company's own connected account (Settings → Payments & payouts)
 *  2. else, for the platform owner ONLY, the platform-wide env credentials
 *     (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`,
 *     `RAZORPAY_ACCOUNT_NUMBER`, `HRMS_PAYOUT_PROVIDER`) — exactly what it
 *     used before per-company accounts existed
 *  3. else null: "not connected". Other companies never see env credentials.
 *
 * Secrets (key secret, webhook secret, RazorpayX account number) are
 * encrypted at rest with AES-256-GCM keyed by `PLATFORM_ENCRYPTION_KEY`
 * (base64, 32 bytes — `openssl rand -base64 32`), with the company id bound in
 * as additional authenticated data so a ciphertext can't be replayed into
 * another company's record. Plaintext only ever leaves this module through
 * `resolveRazorpayCredentials` (server-side callers); views carry the last 4
 * characters only. Nothing here logs a secret.
 *
 * Key rotation: keep the old key, decrypt every `platform_payment_accounts`
 * row and re-encrypt with the new key, then swap `PLATFORM_ENCRYPTION_KEY`.
 */

export const PAYMENT_ACCOUNTS_COLLECTION = "platform_payment_accounts"; // keyed: _id = provider
const RAZORPAY = "razorpay";
const RZP_API = "https://api.razorpay.com/v1";

export const NOT_CONNECTED_MESSAGE = "Connect your Razorpay account in Settings → Payments to collect online.";

// ---------------------------------------------------------------------------
// Encryption (PLATFORM_ENCRYPTION_KEY)
// ---------------------------------------------------------------------------

interface EncryptedValue {
  c: string; // ciphertext (base64)
  iv: string; // 12-byte nonce (base64)
  t: string; // GCM auth tag (base64)
}

const ALGO = "aes-256-gcm";

function getKey(): Buffer | null {
  const raw = process.env.PLATFORM_ENCRYPTION_KEY;
  if (!raw) return null;
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("PLATFORM_ENCRYPTION_KEY must be a base64-encoded 32-byte key (openssl rand -base64 32).");
  return key;
}

export function isPlatformEncryptionConfigured(): boolean {
  try {
    return getKey() !== null;
  } catch {
    return false;
  }
}

function aad(companyId: string, field: string): Buffer {
  return Buffer.from(`payments:${RAZORPAY}:${companyId}:${field}`, "utf8");
}

function encrypt(plain: string, companyId: string, field: string): EncryptedValue {
  const key = getKey();
  if (!key) throw new Error("MISSING_ENCRYPTION_KEY");
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  cipher.setAAD(aad(companyId, field));
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return { c: ciphertext.toString("base64"), iv: iv.toString("base64"), t: cipher.getAuthTag().toString("base64") };
}

/** Never throws — a missing/wrong key or tampered data returns null (and logs the failure, never the value). */
function decrypt(value: EncryptedValue | null | undefined, companyId: string, field: string): string | null {
  if (!value) return null;
  try {
    const key = getKey();
    if (!key) return null;
    const decipher = createDecipheriv(ALGO, key, Buffer.from(value.iv, "base64"));
    decipher.setAAD(aad(companyId, field));
    decipher.setAuthTag(Buffer.from(value.t, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(value.c, "base64")), decipher.final()]).toString("utf8");
  } catch {
    console.error(`platform/payments: failed to decrypt the stored ${field}`);
    return null;
  }
}

function last4(value: string): string {
  return value.length <= 4 ? value : value.slice(-4);
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

interface StoredRazorpayAccount {
  _id: string; // "razorpay"
  keyId: string;
  keySecret: EncryptedValue;
  keySecretLast4: string;
  webhookSecret: EncryptedValue | null;
  webhookSecretLast4: string | null;
  accountNumber: EncryptedValue | null;
  accountNumberLast4: string | null;
  payoutsEnabled: boolean;
  lastTest: { ok: boolean; at: Date; message: string } | null;
  connectedAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
}

async function collection() {
  const db = await getDb();
  return db.collection<StoredRazorpayAccount>(PAYMENT_ACCOUNTS_COLLECTION);
}

async function readStored(): Promise<StoredRazorpayAccount | null> {
  return (await collection()).findOne({ _id: RAZORPAY });
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

export type RazorpayPurpose = "payments" | "payouts";

export interface RazorpayCredentials {
  /** "company" = the company's own connected account; "platform_env" = the owner's env credentials. */
  source: "company" | "platform_env";
  keyId: string;
  keySecret: string;
  /** Secret Razorpay signs webhooks with; null = webhooks are rejected. */
  webhookSecret: string | null;
  /** RazorpayX source account (payouts). */
  accountNumber: string | null;
}

/** The platform owner's env credentials — unchanged from before per-company accounts. */
function envCredentials(purpose: RazorpayPurpose): RazorpayCredentials | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  const accountNumber = process.env.RAZORPAY_ACCOUNT_NUMBER || null;
  if (purpose === "payouts") {
    if (process.env.HRMS_PAYOUT_PROVIDER !== "razorpay") return null;
    return { source: "platform_env", keyId, keySecret, webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || null, accountNumber };
  }
  // FMS webhooks historically fell back to the key secret when no webhook secret was set.
  return { source: "platform_env", keyId, keySecret, webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || keySecret, accountNumber };
}

/**
 * The Razorpay credentials the current company collects payments / pays
 * salaries with, or null when it has none ("not connected"). A company that
 * connected an account uses it exclusively (even the platform owner); a stored
 * account that can't be decrypted resolves to null rather than falling back.
 */
export async function resolveRazorpayCredentials(purpose: RazorpayPurpose): Promise<RazorpayCredentials | null> {
  const stored = await readStored();
  if (stored) {
    const companyId = await currentCompanyId();
    const keySecret = decrypt(stored.keySecret, companyId, "keySecret");
    if (!keySecret) return null;
    const webhookSecret = decrypt(stored.webhookSecret, companyId, "webhookSecret");
    const accountNumber = decrypt(stored.accountNumber, companyId, "accountNumber");
    if (purpose === "payouts" && (!stored.payoutsEnabled || !accountNumber)) return null;
    return { source: "company", keyId: stored.keyId, keySecret, webhookSecret, accountNumber };
  }
  if (!(await isPlatformOwnerContext())) return null;
  return envCredentials(purpose);
}

// ---------------------------------------------------------------------------
// View (what the settings page may see — never a secret)
// ---------------------------------------------------------------------------

export interface PaymentAccountView {
  status: "not_connected" | "connected" | "unreadable";
  keyId: string | null;
  mode: "test" | "live" | null;
  keySecretLast4: string | null;
  webhookSecretLast4: string | null;
  accountNumberLast4: string | null;
  payoutsEnabled: boolean;
  lastTest: { ok: boolean; at: string; message: string } | null;
  connectedAt: string | null;
  encryptionConfigured: boolean;
  /** Platform owner, nothing connected here, env credentials present. */
  usingPlatformEnv: { payments: boolean; payouts: boolean };
  webhookUrls: { payments: string; payouts: string };
}

function modeOf(keyId: string | null): "test" | "live" | null {
  const m = keyId?.match(/^rzp_(test|live)_/);
  return m ? (m[1] as "test" | "live") : null;
}

export async function getPaymentAccountView(): Promise<PaymentAccountView> {
  const [stored, siteUrl, companyId] = await Promise.all([readStored(), companySiteUrl(), currentCompanyId()]);
  const encryptionConfigured = isPlatformEncryptionConfigured();
  const webhookUrls = { payments: `${siteUrl}/api/fms/webhooks/razorpay`, payouts: `${siteUrl}/api/hrms/payroll/webhook` };

  if (!stored) {
    const owner = await isPlatformOwnerContext();
    return {
      status: "not_connected",
      keyId: null,
      mode: null,
      keySecretLast4: null,
      webhookSecretLast4: null,
      accountNumberLast4: null,
      payoutsEnabled: false,
      lastTest: null,
      connectedAt: null,
      encryptionConfigured,
      usingPlatformEnv: { payments: owner && envCredentials("payments") !== null, payouts: owner && envCredentials("payouts") !== null },
      webhookUrls,
    };
  }
  const readable = decrypt(stored.keySecret, companyId, "keySecret") !== null;
  return {
    status: readable ? "connected" : "unreadable",
    keyId: stored.keyId,
    mode: modeOf(stored.keyId),
    keySecretLast4: stored.keySecretLast4,
    webhookSecretLast4: stored.webhookSecretLast4,
    accountNumberLast4: stored.accountNumberLast4,
    payoutsEnabled: stored.payoutsEnabled,
    lastTest: stored.lastTest ? { ok: stored.lastTest.ok, at: stored.lastTest.at.toISOString(), message: stored.lastTest.message } : null,
    connectedAt: stored.connectedAt.toISOString(),
    encryptionConfigured,
    usingPlatformEnv: { payments: false, payouts: false },
    webhookUrls,
  };
}

// ---------------------------------------------------------------------------
// Save / test / disconnect
// ---------------------------------------------------------------------------

export interface PaymentAccountInput {
  keyId: string;
  /** Blank keeps the stored secret (required when connecting for the first time). */
  keySecret: string;
  /** Blank keeps the stored webhook secret. */
  webhookSecret: string;
  payoutsEnabled: boolean;
  /** Blank keeps the stored account number. */
  accountNumber: string;
}

export type PaymentAccountResult =
  | { ok: true; account: PaymentAccountView; message?: string }
  | { ok: false; error: string; errors?: Partial<Record<keyof PaymentAccountInput, string>>; account?: PaymentAccountView };

export const KEY_ID_PATTERN = /^rzp_(test|live)_[A-Za-z0-9]{8,32}$/;
const SECRET_PATTERN = /^\S{8,128}$/;
const ACCOUNT_NUMBER_PATTERN = /^[A-Za-z0-9]{6,32}$/;

export function validateKeyId(keyId: string): string | null {
  if (!keyId) return "Enter your Razorpay Key ID.";
  if (!KEY_ID_PATTERN.test(keyId)) return "That doesn't look like a Razorpay Key ID — it starts with rzp_test_ or rzp_live_.";
  return null;
}

export async function savePaymentAccount(raw: PaymentAccountInput, actorId: string | null): Promise<PaymentAccountResult> {
  const input = {
    keyId: String(raw?.keyId ?? "").trim(),
    keySecret: String(raw?.keySecret ?? "").trim(),
    webhookSecret: String(raw?.webhookSecret ?? "").trim(),
    payoutsEnabled: raw?.payoutsEnabled === true,
    accountNumber: String(raw?.accountNumber ?? "").replace(/\s+/g, ""),
  };
  if (!isPlatformEncryptionConfigured()) {
    return { ok: false, error: "PLATFORM_ENCRYPTION_KEY isn't set on the server, so payment credentials can't be stored safely. Ask your platform administrator to configure it." };
  }

  const companyId = await currentCompanyId();
  const stored = await readStored();
  // A record whose secrets can't be decrypted (key changed) must be re-entered in full.
  const storedReadable = stored ? decrypt(stored.keySecret, companyId, "keySecret") !== null : false;
  const existing = storedReadable ? stored : null;

  const errors: Partial<Record<keyof PaymentAccountInput, string>> = {};
  const keyIdError = validateKeyId(input.keyId);
  if (keyIdError) errors.keyId = keyIdError;
  if (!input.keySecret && !existing) errors.keySecret = "Enter your Razorpay Key Secret.";
  else if (input.keySecret && !SECRET_PATTERN.test(input.keySecret)) errors.keySecret = "The Key Secret should be 8–128 characters with no spaces.";
  if (input.webhookSecret && !SECRET_PATTERN.test(input.webhookSecret)) errors.webhookSecret = "The webhook secret should be 8–128 characters with no spaces.";
  if (input.accountNumber && !ACCOUNT_NUMBER_PATTERN.test(input.accountNumber)) errors.accountNumber = "Enter the RazorpayX account number (letters and digits only).";
  if (input.payoutsEnabled && !input.accountNumber && !existing?.accountNumber) errors.accountNumber = "Enter your RazorpayX account number to enable salary payouts.";
  if (Object.keys(errors).length) return { ok: false, error: "Please fix the highlighted fields.", errors };

  // Keys from a different Razorpay account invalidate the kept secrets too.
  const sameAccount = existing?.keyId === input.keyId;
  if (existing && !sameAccount && !input.keySecret) {
    return { ok: false, error: "Please fix the highlighted fields.", errors: { keySecret: "Enter the Key Secret for this new Key ID." } };
  }

  const now = new Date();
  const doc: Omit<StoredRazorpayAccount, "_id"> = {
    keyId: input.keyId,
    keySecret: input.keySecret ? encrypt(input.keySecret, companyId, "keySecret") : existing!.keySecret,
    keySecretLast4: input.keySecret ? last4(input.keySecret) : existing!.keySecretLast4,
    webhookSecret: input.webhookSecret ? encrypt(input.webhookSecret, companyId, "webhookSecret") : sameAccount ? existing!.webhookSecret : null,
    webhookSecretLast4: input.webhookSecret ? last4(input.webhookSecret) : sameAccount ? existing!.webhookSecretLast4 : null,
    accountNumber: input.accountNumber ? encrypt(input.accountNumber, companyId, "accountNumber") : sameAccount ? existing!.accountNumber : null,
    accountNumberLast4: input.accountNumber ? last4(input.accountNumber) : sameAccount ? existing!.accountNumberLast4 : null,
    payoutsEnabled: input.payoutsEnabled,
    // New secrets haven't been tested yet.
    lastTest: sameAccount && !input.keySecret && !input.accountNumber ? existing!.lastTest : null,
    connectedAt: stored?.connectedAt ?? now,
    updatedAt: now,
    updatedBy: actorId,
  };
  await (await collection()).replaceOne({ _id: RAZORPAY }, doc as StoredRazorpayAccount, { upsert: true });
  return { ok: true, account: await getPaymentAccountView(), message: stored ? "Razorpay settings saved." : "Razorpay connected. Run “Test connection” to check the keys." };
}

async function rzpGet(path: string, creds: RazorpayCredentials): Promise<{ status: number } | { error: string }> {
  try {
    const res = await fetch(`${RZP_API}${path}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64")}` },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    return { status: res.status };
  } catch {
    return { error: "Couldn't reach Razorpay. Please try again in a minute." };
  }
}

/** A cheap authenticated read against Razorpay (and RazorpayX, when payouts are on). Records the outcome. */
export async function testPaymentAccount(): Promise<PaymentAccountResult> {
  const stored = await readStored();
  if (!stored) return { ok: false, error: "Connect a Razorpay account first." };
  const creds = await resolveRazorpayCredentials("payments");
  if (!creds || creds.source !== "company") return { ok: false, error: "The stored credentials can't be read. Enter your keys again and save." };

  let result: { ok: boolean; message: string };
  const payments = await rzpGet("/payments?count=1", creds);
  if ("error" in payments) result = { ok: false, message: payments.error };
  else if (payments.status === 401) result = { ok: false, message: "Razorpay rejected these keys. Check the Key ID and Key Secret." };
  else if (payments.status !== 200) result = { ok: false, message: `Razorpay answered with an unexpected status (${payments.status}).` };
  else result = { ok: true, message: `Connected to Razorpay (${modeOf(creds.keyId) === "live" ? "live" : "test"} mode).` };

  if (result.ok && stored.payoutsEnabled && creds.accountNumber) {
    const payouts = await rzpGet(`/transactions?account_number=${encodeURIComponent(creds.accountNumber)}&count=1`, creds);
    if ("error" in payouts) result = { ok: false, message: payouts.error };
    else if (payouts.status !== 200) result = { ok: false, message: "Payments work, but RazorpayX didn't accept the account number. Check it, and that RazorpayX is activated for these keys." };
    else result = { ok: true, message: `${result.message} RazorpayX payouts account verified.` };
  }

  await (await collection()).updateOne({ _id: RAZORPAY }, { $set: { lastTest: { ...result, at: new Date() } } });
  const account = await getPaymentAccountView();
  return result.ok ? { ok: true, account, message: result.message } : { ok: false, error: result.message, account };
}

export async function disconnectPaymentAccount(): Promise<PaymentAccountResult> {
  await (await collection()).deleteOne({ _id: RAZORPAY });
  return { ok: true, account: await getPaymentAccountView(), message: "Razorpay disconnected. Stored keys were deleted." };
}
