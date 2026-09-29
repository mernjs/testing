import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { companyBaseUrl, createCompanyWithOwner, isSlugTaken, slugFormatError } from "@/lib/platform/tenancy/provisioning";
import { getSignupMode } from "@/lib/platform/settings";
import { sendEmail } from "@/lib/platform/email";
import { renderEmail } from "@/lib/platform/email/template";
import { hashPassword } from "@/lib/lms-auth";

/**
 * Self-serve company sign-up:
 *  1. `startSignup` validates, rate-limits and stores a PENDING sign-up (the
 *     password is hashed immediately; nothing else is created) and emails a
 *     verification link.
 *  2. `confirmSignup` (from that link, behind an explicit button so mail
 *     scanners that pre-fetch links can't consume it) creates the company,
 *     its owner and its subdomain, then issues a one-time hand-off token.
 *  3. The hand-off (`consumeHandoff`) runs on the new company's own host —
 *     cookies can't cross domains — and signs the owner in there.
 * In `approval` mode step 2 parks the sign-up for a platform admin instead.
 */

const PENDING = "pending_signups";
const ATTEMPTS = "signup_attempts";
const HANDOFFS = "login_handoffs";
const PENDING_TTL_MS = 24 * 60 * 60 * 1000;
const HANDOFF_TTL_MS = 2 * 60 * 1000;
const MAX_PER_IP_PER_HOUR = 5;
const MAX_PER_EMAIL_PER_HOUR = 3;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MIN_PASSWORD_LENGTH = 10;

interface PendingSignup {
  _id: string;
  tokenHash: string;
  email: string;
  name: string;
  companyName: string;
  slug: string;
  passwordHash: string;
  status: "pending" | "awaiting_approval";
  createdAt: Date;
  expiresAt: Date;
}

interface Handoff {
  _id: string; // sha256 of the token
  companyId: string;
  adminId: string;
  next: string;
  expiresAt: Date;
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

let indexesEnsured = false;
async function collections() {
  const db = await getPlatformDb();
  const pending = db.collection<PendingSignup>(PENDING);
  const attempts = db.collection<{ key: string; at: Date }>(ATTEMPTS);
  const handoffs = db.collection<Handoff>(HANDOFFS);
  if (!indexesEnsured) {
    indexesEnsured = true;
    await Promise.all([
      pending.createIndex({ tokenHash: 1 }, { unique: true }),
      pending.createIndex({ email: 1 }),
      pending.createIndex({ slug: 1 }),
      pending.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      attempts.createIndex({ key: 1, at: 1 }),
      attempts.createIndex({ at: 1 }, { expireAfterSeconds: 3600 }),
      handoffs.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]).catch((err) => console.error("[signup] index setup failed", err));
  }
  return { pending, attempts, handoffs };
}

export interface SignupInput {
  companyName: string;
  slug: string;
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

export type SignupFieldErrors = Partial<Record<keyof SignupInput | "form", string>>;

export function validateSignup(input: SignupInput): SignupFieldErrors {
  const errors: SignupFieldErrors = {};
  if (input.companyName.trim().length < 2) errors.companyName = "Enter your company name.";
  if (input.companyName.length > 100) errors.companyName = "Keep the company name under 100 characters.";
  const slugError = slugFormatError(input.slug);
  if (slugError) errors.slug = slugError;
  if (input.name.trim().length < 2) errors.name = "Enter your name.";
  if (!EMAIL_RE.test(input.email.trim())) errors.email = "Enter a valid email address.";
  if (input.password.length < MIN_PASSWORD_LENGTH) errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!input.acceptTerms) errors.acceptTerms = "Accept the terms to continue.";
  return errors;
}

/** Taken by a live company, or held by someone else's unexpired sign-up. */
export async function isSlugAvailable(slug: string, forEmail?: string): Promise<boolean> {
  if (slugFormatError(slug)) return false;
  if (await isSlugTaken(slug)) return false;
  const { pending } = await collections();
  const held = await pending.findOne({ slug, expiresAt: { $gt: new Date() } }, { projection: { email: 1 } });
  return !held || held.email === forEmail?.trim().toLowerCase();
}

async function rateLimited(keys: { key: string; max: number }[]): Promise<boolean> {
  const { attempts } = await collections();
  const since = new Date(Date.now() - 60 * 60 * 1000);
  for (const { key, max } of keys) {
    if ((await attempts.countDocuments({ key, at: { $gt: since } })) >= max) return true;
  }
  await attempts.insertMany(keys.map(({ key }) => ({ key, at: new Date() })));
  return false;
}

export type StartSignupResult = { ok: true; email: string } | { ok: false; errors: SignupFieldErrors };

/** `origin` = the platform site's origin the verification link points back to. */
export async function startSignup(input: SignupInput, ctx: { origin: string; clientKey: string }): Promise<StartSignupResult> {
  const mode = await getSignupMode();
  if (mode === "closed") return { ok: false, errors: { form: "New sign-ups are paused right now. Please try again later." } };

  const errors = validateSignup(input);
  if (Object.keys(errors).length) return { ok: false, errors };
  const email = input.email.trim().toLowerCase();

  if (await rateLimited([{ key: `ip:${ctx.clientKey}`, max: MAX_PER_IP_PER_HOUR }, { key: `email:${email}`, max: MAX_PER_EMAIL_PER_HOUR }])) {
    return { ok: false, errors: { form: "Too many sign-up attempts. Please wait an hour and try again." } };
  }
  if (!(await isSlugAvailable(input.slug, email))) return { ok: false, errors: { slug: "That workspace address is taken." } };

  const { pending } = await collections();
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  // One pending sign-up per email: starting again replaces the previous one (and its link).
  await pending.deleteMany({ email, status: "pending" });
  await pending.insertOne({
    _id: randomUUID(),
    tokenHash: sha256(token),
    email,
    name: input.name.trim(),
    companyName: input.companyName.trim(),
    slug: input.slug,
    passwordHash: hashPassword(input.password),
    status: "pending",
    createdAt: now,
    expiresAt: new Date(now.getTime() + PENDING_TTL_MS),
  });

  const link = `${ctx.origin}/signup/verify?token=${token}`;
  const { html, text } = renderEmail({
    brand: "YashOrbit",
    heading: `Confirm your email to create ${input.companyName.trim()}`,
    paragraphs: [`Hi ${input.name.trim()},`, "Confirm your email address and your workspace will be ready in seconds."],
    action: { label: "Confirm email & create workspace", url: link },
    footnote: "This link expires in 24 hours. If you didn't sign up, ignore this email — nothing will be created.",
  });
  const sent = await sendEmail({ to: email, subject: "Confirm your email to create your workspace", html, text });
  if (!sent.ok) {
    await pending.deleteMany({ email, status: "pending" });
    return { ok: false, errors: { form: "We couldn't send the verification email. Please try again in a few minutes." } };
  }
  return { ok: true, email };
}

export async function describePendingSignup(token: string): Promise<{ companyName: string; slug: string; email: string } | null> {
  const { pending } = await collections();
  const doc = await pending.findOne({ tokenHash: sha256(token), status: "pending", expiresAt: { $gt: new Date() } });
  return doc ? { companyName: doc.companyName, slug: doc.slug, email: doc.email } : null;
}

export type ConfirmResult = { ok: true; redirectTo: string } | { ok: true; awaitingApproval: true } | { ok: false; error: string };

export async function confirmSignup(token: string, ctx: { hostHint: string | null }): Promise<ConfirmResult> {
  const { pending, handoffs } = await collections();
  // Claim atomically: a double-click (or two tabs) can only create one company.
  const doc = await pending.findOneAndDelete({ tokenHash: sha256(token), status: "pending", expiresAt: { $gt: new Date() } });
  if (!doc) return { ok: false, error: "This link has expired or was already used. Start again to get a new one." };

  if ((await getSignupMode()) === "approval") {
    await pending.insertOne({ ...doc, status: "awaiting_approval", expiresAt: new Date(Date.now() + 30 * PENDING_TTL_MS) });
    return { ok: true, awaitingApproval: true };
  }

  const created = await createCompanyWithOwner({
    name: doc.companyName,
    slug: doc.slug,
    owner: { email: doc.email, name: doc.name, passwordHash: doc.passwordHash, mustChangePassword: false },
  });
  if (!created.ok) {
    // Put it back so the user can retry from the same link once they've been told why.
    await pending.insertOne(doc);
    return { ok: false, error: created.error };
  }

  const base = companyBaseUrl(doc.slug, ctx.hostHint);
  const { html, text } = renderEmail({
    brand: doc.companyName,
    heading: "Your workspace is ready",
    paragraphs: [`Hi ${doc.name},`, `${doc.companyName} is set up. Sign in any time at your workspace address:`, base],
    action: { label: "Open your workspace", url: `${base}/workspace/login` },
  });
  void sendEmail({ to: doc.email, subject: `Welcome — ${doc.companyName} is ready`, html, text });

  const handoff = randomBytes(32).toString("hex");
  await handoffs.insertOne({ _id: sha256(handoff), companyId: created.companyId, adminId: created.adminId, next: "/onboarding", expiresAt: new Date(Date.now() + HANDOFF_TTL_MS) });
  return { ok: true, redirectTo: `${base}/workspace/handoff?token=${handoff}` };
}

/** Single-use: returns who to sign in, only for the company the request is on. */
export async function consumeHandoff(token: string, companyId: string): Promise<{ adminId: string; next: string } | null> {
  const { handoffs } = await collections();
  const doc = await handoffs.findOneAndDelete({ _id: sha256(token), companyId, expiresAt: { $gt: new Date() } });
  return doc ? { adminId: doc.adminId, next: doc.next } : null;
}
