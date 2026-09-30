/**
 * Razorpay subscriptions & payments checks against a throwaway database
 * (dropped at the end) and a MOCKED Razorpay HTTP layer — `globalThis.fetch`
 * is replaced, nothing touches the network.
 *
 *   MONGODB_URI=mongodb://127.0.0.1:27099/subs_test_$(date +%s) \
 *     npx --yes tsx --require ./scripts/lib/next-server-shims.cjs scripts/test-subscriptions.ts
 */
import assert from "node:assert/strict";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { clientPromise, getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { getRazorpayConfigView, getRazorpayCredentials, saveRazorpayConfig } from "@/lib/platform/billing/razorpay-config";
import { testRazorpayConnection, verifyWebhookSignature } from "@/lib/platform/billing/razorpay";
import { getCompanySubscription, startTrial } from "@/lib/platform/billing/subscription";
import { getBillingSettings, saveBillingSettings } from "@/lib/platform/billing/settings";
import {
  __setInvoiceIssuerForTests,
  cancelSubscription,
  changePlan,
  confirmCheckout,
  handleWebhook,
  priceSubscription,
  runDunningSweep,
  saveBillingDetails,
  startCheckout,
  type RazorpayWebhookPayload,
} from "@/lib/platform/billing/subscriptions";
import { adminExtendTrial, adminSetComplimentary, adminSuspend, adminUnsuspend, adminReactivate, listSubscriptions } from "@/lib/platform/billing/subscriptions-admin";
import type { IssueSaasInvoiceInput } from "@/lib/platform/billing/invoices";
import { POST as webhookPOST } from "@/app/(platform)/api/platform/billing/webhook/route";

// ── Mock Razorpay ──────────────────────────────────────────────────────────────
type Json = Record<string, unknown>;
const calls: { method: string; path: string; body: Json | null; auth: string | null }[] = [];
const remoteSubs = new Map<string, Json>();
let seq = 0;
let rejectAuth = false;
const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
  if (url.hostname !== "api.razorpay.com") throw new Error(`unexpected network call to ${url.hostname}`);
  const method = init?.method ?? "GET";
  const path = url.pathname.replace(/^\/v1/, "");
  const body = init?.body ? (JSON.parse(String(init.body)) as Json) : null;
  const auth = new Headers(init?.headers).get("authorization");
  calls.push({ method, path, body, auth });
  const json = (status: number, data: unknown) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
  if (rejectAuth) return json(401, { error: { code: "BAD_REQUEST_ERROR", description: "Authentication failed" } });
  let m: RegExpMatchArray | null;
  if (method === "GET" && path === "/plans") return json(200, { count: 0, items: [] });
  if (method === "POST" && path === "/customers") return json(200, { id: "cust_1" });
  if (method === "POST" && path === "/plans") return json(200, { id: `plan_${++seq}` });
  if (method === "POST" && path === "/subscriptions") {
    const id = `sub_${++seq}`;
    const sub = { id, plan_id: body!.plan_id, customer_id: body!.customer_id ?? null, status: "created", current_start: null, current_end: null, start_at: body!.start_at ?? null, notes: body!.notes };
    remoteSubs.set(id, sub);
    return json(200, sub);
  }
  if ((m = path.match(/^\/subscriptions\/([^/]+)$/))) {
    const sub = remoteSubs.get(m[1]);
    if (!sub) return json(404, { error: { description: "not found" } });
    if (method === "PATCH") Object.assign(sub, { plan_id: body!.plan_id });
    return json(200, sub);
  }
  if ((m = path.match(/^\/subscriptions\/([^/]+)\/cancel$/))) {
    const sub = remoteSubs.get(m[1])!;
    if (!body!.cancel_at_cycle_end) sub.status = "cancelled";
    return json(200, sub);
  }
  if ((m = path.match(/^\/subscriptions\/([^/]+)\/cancel_scheduled_changes$/))) return json(200, remoteSubs.get(m[1]));
  if ((m = path.match(/^\/payments\/([^/]+)\/refund$/))) return json(200, { id: `rfnd_${++seq}`, amount: body!.amount });
  return json(404, { error: { description: `no mock for ${method} ${path}` } });
}) as typeof fetch;

// ── Helpers ───────────────────────────────────────────────────────────────────
const KEY_ID = "rzp_test_AbCdEf123456";
const KEY_SECRET = "secretSECRET1234wxyz";
const WEBHOOK_SECRET = "whsec_test_123";
const invoices: IssueSaasInvoiceInput[] = [];
const unix = (d: Date) => Math.floor(d.getTime() / 1000);
const sign = (raw: string, secret = WEBHOOK_SECRET) => createHmac("sha256", secret).update(raw).digest("hex");

function payload(event: string, sub: Json, payment?: Json): RazorpayWebhookPayload {
  return { event, payload: { subscription: { entity: sub as never }, ...(payment ? { payment: { entity: payment as never } } : {}) } };
}

async function main() {
  const db = await getPlatformDb();
  if (!/test/.test(db.databaseName)) throw new Error(`Refusing to run against "${db.databaseName}"`);
  process.env.EMAIL_PROVIDER = "console";
  process.env.PLATFORM_ENCRYPTION_KEY = randomBytes(32).toString("base64");
  delete process.env.RAZORPAY_KEY_ID;
  delete process.env.RAZORPAY_KEY_SECRET;
  process.env.RAZORPAY_BILLING_WEBHOOK_SECRET = WEBHOOK_SECRET;
  __setInvoiceIssuerForTests(async (input) => {
    invoices.push(input);
    return { id: `inv_${invoices.length}`, number: `SAAS/${invoices.length}` };
  });
  let checks = 0;
  const ok = (cond: unknown, msg: string) => {
    assert.ok(cond, msg);
    checks++;
  };
  const eq = <T>(a: T, b: T, msg: string) => {
    assert.deepEqual(a, b, msg);
    checks++;
  };

  const now = new Date();
  const owner = randomUUID();
  const a = randomUUID();
  const b = randomUUID();
  await db.collection("companies").insertMany([
    { _id: owner as never, slug: "owner", name: "Owner", status: "active", isPlatformOwner: true, createdAt: now, updatedAt: now },
    { _id: a as never, slug: "alpha", name: "Alpha", status: "active", isPlatformOwner: false, createdAt: now, updatedAt: now },
    { _id: b as never, slug: "beta", name: "Beta", status: "active", isPlatformOwner: false, createdAt: now, updatedAt: now },
  ]);
  await startTrial(a, "growth");
  await startTrial(b, "starter");

  // ── Razorpay configuration ──
  eq(await getRazorpayCredentials(), null, "nothing configured");
  const beforeCfg = await startCheckout(a, { planId: "growth", interval: "monthly" });
  ok(!beforeCfg.ok && /isn't configured/.test(beforeCfg.error), "checkout refused while unconfigured");
  process.env.RAZORPAY_KEY_ID = "rzp_test_EnvKey0001";
  process.env.RAZORPAY_KEY_SECRET = "envsecret99";
  eq((await getRazorpayCredentials())?.source, "env", "env fallback while nothing saved");
  eq((await getRazorpayConfigView()).source, "env", "view reports env source");
  const badMode = await saveRazorpayConfig({ keyId: KEY_ID, keySecret: KEY_SECRET, mode: "live" }, "admin1");
  ok(!badMode.ok && "keyId" in badMode.errors, "test key rejected in live mode");
  const noSecret = await saveRazorpayConfig({ keyId: KEY_ID, keySecret: "", mode: "test" }, "admin1");
  ok(!noSecret.ok && "keySecret" in noSecret.errors, "first save needs the secret");
  ok((await saveRazorpayConfig({ keyId: KEY_ID, keySecret: KEY_SECRET, mode: "test" }, "admin1")).ok, "keys saved");
  const stored = await db.collection("platform_settings").findOne({ _id: "billing_razorpay" as never });
  ok(stored && !JSON.stringify(stored).includes(KEY_SECRET), "secret not stored in plain text");
  const view = await getRazorpayConfigView();
  eq([view.source, view.keyId, view.secretLast4, view.webhookSecretSet], ["db", KEY_ID, "wxyz", true], "view: db source, last4 only, webhook secret flag");
  ok(!JSON.stringify(view).includes(KEY_SECRET), "view never carries the secret");
  eq((await getRazorpayCredentials())?.keySecret, KEY_SECRET, "saved credentials win over env");
  ok((await saveRazorpayConfig({ keyId: KEY_ID, keySecret: "", mode: "test" }, "admin1")).ok, "blank secret keeps the saved one");
  eq((await getRazorpayCredentials())?.keySecret, KEY_SECRET, "secret kept");
  const test1 = await testRazorpayConnection();
  ok(test1.ok, "test connection ok");
  eq(calls.at(-1)!.auth, `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64")}`, "calls use the saved keys");
  rejectAuth = true;
  ok(!(await testRazorpayConnection()).ok, "test connection reports rejected keys");
  rejectAuth = false;
  ok(await db.collection("platform_audit_log").findOne({ action: "settings.razorpay.update" }), "config change audited");

  // ── Signatures ──
  ok(verifyWebhookSignature('{"a":1}', sign('{"a":1}'), WEBHOOK_SECRET), "valid webhook signature");
  ok(!verifyWebhookSignature('{"a":2}', sign('{"a":1}'), WEBHOOK_SECRET), "tampered body rejected");
  ok(!verifyWebhookSignature('{"a":1}', null, WEBHOOK_SECRET), "missing signature rejected");

  // ── Pricing through quoteCheckout + GST settings ──
  const priced = await priceSubscription({ companyId: a, planId: "growth", interval: "monthly" });
  ok(priced.ok, "priced");
  if (!priced.ok) return;
  eq([priced.pricing.net, priced.pricing.gst, priced.pricing.total], [199_900, 35_982, 235_882], "growth monthly + 18% GST");
  const withCoupon = await priceSubscription({ companyId: a, planId: "growth", interval: "monthly", couponCode: "NOPE" });
  ok(withCoupon.ok && withCoupon.summary.couponError, "coupon error surfaced from the quote");
  const settings = await getBillingSettings();
  await saveBillingSettings({ ...settings, seller: { ...settings.seller, legalName: "Owner Pvt Ltd", stateCode: "33" }, billing: { ...settings.billing, graceDays: 5 } }, "admin1");

  // ── Checkout ──
  const noDetails = await startCheckout(a, { planId: "growth", interval: "monthly" });
  ok(!noDetails.ok && /billing details/.test(noDetails.error), "billing details required");
  const badDetails = await saveBillingDetails(a, { legalName: "A", address: "x", state: "Nowhere", email: "bad" });
  ok(!badDetails.ok, "invalid billing details rejected");
  ok((await saveBillingDetails(a, { legalName: "Alpha Pvt Ltd", gstin: "", address: "1 Main Road, Chennai", state: "Tamil Nadu", email: "billing@alpha.test" })).ok, "billing details saved");
  const couponCheckout = await startCheckout(a, { planId: "growth", interval: "monthly", couponCode: "NOPE" });
  ok(!couponCheckout.ok, "checkout refuses an invalid coupon code");
  const co = await startCheckout(a, { planId: "growth", interval: "monthly" }, "user-a");
  ok(co.ok, "checkout started");
  if (!co.ok) return;
  eq(co.checkout.amount, 235_882, "checkout amount is the quote total");
  eq(co.checkout.key, KEY_ID, "public key id handed to the browser");
  ok(co.checkout.startsAt, "trialing company: first charge at trial end");
  const planCall = calls.find((c) => c.method === "POST" && c.path === "/plans");
  eq((planCall!.body!.item as Json).amount, 235_882, "Razorpay plan created for the exact quote total");
  const subId = co.checkout.subscriptionId;
  const plansBefore = calls.filter((c) => c.path === "/plans" && c.method === "POST").length;

  // Confirm with a forged signature → refused; valid → adopted (authenticated, still trialing).
  ok(!(await confirmCheckout(a, { razorpay_payment_id: "pay_auth", razorpay_subscription_id: subId, razorpay_signature: "forged" })).ok, "forged checkout signature refused");
  remoteSubs.get(subId)!.status = "authenticated";
  const conf = await confirmCheckout(a, { razorpay_payment_id: "pay_auth", razorpay_subscription_id: subId, razorpay_signature: createHmac("sha256", KEY_SECRET).update(`pay_auth|${subId}`).digest("hex") }, "user-a");
  ok(conf.ok, "checkout confirmed");
  let sa = (await getCompanySubscription(a))!;
  eq([sa.status, sa.provider?.subscriptionId, sa.pricing?.total, sa.checkout ?? null], ["trialing", subId, 235_882, null], "adopted: trialing, provider id, pricing stored");
  const again = await startCheckout(a, { planId: "growth", interval: "monthly" });
  ok(!again.ok && /change your plan/.test(again.error), "no second subscription while one is live");

  // ── Webhooks through the route (signature + idempotency) ──
  const start = new Date();
  const end = new Date(start.getTime() + 30 * 86_400_000);
  const active = { ...remoteSubs.get(subId)!, status: "active", current_start: unix(start), current_end: unix(end) };
  const post = async (p: RazorpayWebhookPayload, eventId: string, secret = WEBHOOK_SECRET) => {
    const raw = JSON.stringify(p);
    const res = await webhookPOST(new Request("http://localhost/api/platform/billing/webhook", { method: "POST", body: raw, headers: { "x-razorpay-signature": sign(raw, secret), "x-razorpay-event-id": eventId } }) as never);
    return { status: res.status, body: (await res.json()) as Json };
  };
  eq((await post(payload("subscription.activated", active), "evt_1", "wrong")).status, 401, "webhook with a bad signature → 401");
  const r1 = await post(payload("subscription.activated", active), "evt_1");
  eq([r1.status, r1.body.status], [200, "processed"], "activated processed");
  sa = (await getCompanySubscription(a))!;
  eq([sa.status, sa.currentPeriodEnd?.getTime()], ["active", unix(end) * 1000], "trial → active with the Razorpay period");
  const charge = payload("subscription.charged", active, { id: "pay_1", amount: 235_882, currency: "INR", status: "captured", subscription_id: subId });
  eq((await post(charge, "evt_2")).body.detail, "charged", "charged processed");
  eq((await post(charge, "evt_2")).body.status, "duplicate", "redelivered event id → duplicate, no effect");
  eq(invoices.length, 1, "one invoice for one charge");
  eq([invoices[0].amount, invoices[0].paymentRef, invoices[0].planId, invoices[0].interval, invoices[0].currency], [235_882, "pay_1", "growth", "monthly", "INR"], "invoice gets the charged amount + payment id");
  sa = (await getCompanySubscription(a))!;
  eq(sa.lastPayment?.id, "pay_1", "last payment remembered");

  // Lifecycle: active → past_due → grace → suspended → reactivated.
  await handleWebhook("evt_3", { event: "payment.failed", payload: { payment: { entity: { id: "pay_f", amount: 235_882, currency: "INR", status: "failed", subscription_id: subId, error_description: "Insufficient funds" } } } });
  sa = (await getCompanySubscription(a))!;
  eq([sa.status, sa.dunning?.failedPayments], ["past_due", 1], "payment.failed → past_due");
  await handleWebhook("evt_4", payload("subscription.pending", { ...active, status: "pending" }));
  eq((await getCompanySubscription(a))!.status, "past_due", "pending keeps past_due");
  await handleWebhook("evt_5", payload("subscription.halted", { ...active, status: "halted" }));
  sa = (await getCompanySubscription(a))!;
  ok(sa.status === "grace" && Math.abs(sa.graceEndsAt!.getTime() - Date.now() - 5 * 86_400_000) < 60_000, "halted → grace for settings.graceDays (5)");
  const sweep = await runDunningSweep(new Date(Date.now() + 6 * 86_400_000));
  ok(sweep.suspended >= 1, "cron: grace expired → suspended");
  eq((await getCompanySubscription(a))!.status, "suspended", "suspended");
  const end2 = new Date(end.getTime() + 30 * 86_400_000);
  await handleWebhook("evt_6", payload("subscription.charged", { ...active, current_start: unix(end), current_end: unix(end2) }, { id: "pay_2", amount: 235_882, currency: "INR", status: "captured", subscription_id: subId }));
  sa = (await getCompanySubscription(a))!;
  eq([sa.status, sa.graceEndsAt, sa.dunning ?? null], ["active", null, null], "charge after suspension → active, dunning cleared");
  eq(invoices.length, 2, "second invoice");

  const events = await db.collection("subscription_events").find({ companyId: a }).sort({ at: 1 }).toArray();
  eq(
    events.map((e) => e.type),
    ["activated", "past_due", "grace", "suspended", "reactivated"],
    "every transition recorded as a subscription event",
  );
  eq(events[0].mrr, 199_900, "MRR from the stored quote (pre-tax)");
  const sysAudit = await db.collection("platform_audit_log").countDocuments({ companyId: a, actorId: "system" });
  ok(sysAudit >= 6, "webhook/cron transitions audited as system");

  // ── Plan change: upgrade immediate (pro-rata refund), downgrade at cycle end ──
  Object.assign(remoteSubs.get(subId)!, { status: "active", current_start: unix(end), current_end: unix(end2) });
  const up = await changePlan(a, { planId: "business", interval: "monthly" }, "user-a");
  ok(up.ok, "upgrade ok");
  sa = (await getCompanySubscription(a))!;
  eq([sa.planId, sa.pendingChange ?? null], ["business", null], "upgrade applied immediately");
  const patch = calls.filter((c) => c.method === "PATCH").at(-1)!;
  eq(patch.body!.schedule_change_at, "now", "Razorpay switched now");
  ok(calls.some((c) => c.path === "/payments/pay_2/refund" && (c.body!.amount as number) > 0), "unused part of last payment refunded");
  ok(calls.filter((c) => c.path === "/plans" && c.method === "POST").length > plansBefore, "new Razorpay plan for the new amount");
  const down = await changePlan(a, { planId: "starter", interval: "monthly" }, "user-a");
  ok(down.ok, "downgrade ok");
  sa = (await getCompanySubscription(a))!;
  eq([sa.planId, sa.pendingChange?.planId], ["business", "starter"], "downgrade scheduled for period end");
  eq(calls.filter((c) => c.method === "PATCH").at(-1)!.body!.schedule_change_at, "cycle_end", "Razorpay change at cycle end");
  const starterRzp = calls.filter((c) => c.method === "PATCH").at(-1)!.body!.plan_id as string;
  await handleWebhook("evt_7", payload("subscription.charged", { ...active, plan_id: starterRzp, current_start: unix(end2), current_end: unix(new Date(end2.getTime() + 30 * 86_400_000)) }, { id: "pay_3", amount: 117_882, currency: "INR", status: "captured", subscription_id: subId }));
  sa = (await getCompanySubscription(a))!;
  eq([sa.planId, sa.pendingChange ?? null, sa.pricing?.planId], ["starter", null, "starter"], "scheduled downgrade applied on the renewal charge");

  // ── Cancel at period end, then Razorpay's cancelled event ──
  ok((await cancelSubscription(a, { when: "period_end" }, "user-a")).ok, "cancel at period end");
  sa = (await getCompanySubscription(a))!;
  eq([sa.status, sa.cancelAtPeriodEnd], ["active", true], "still active until period end");
  await handleWebhook("evt_8", payload("subscription.cancelled", { ...active, status: "cancelled" }));
  eq((await getCompanySubscription(a))!.status, "canceled", "cancelled → canceled");
  eq((await handleWebhook("evt_9", payload("subscription.charged", { ...active, id: "sub_unknown", notes: {} }))).status, "ignored", "unknown subscription ignored");

  // ── Platform Panel owner actions ──
  ok((await adminExtendTrial(b, 10, "admin1")).ok, "extend trial");
  const sb = (await getCompanySubscription(b))!;
  ok(sb.trialEndsAt!.getTime() > Date.now() + 39 * 86_400_000, "trial extended by 10 days");
  ok((await adminSuspend(b, "admin1")).ok, "suspend billing");
  eq((await getCompanySubscription(b))!.status, "suspended", "suspended");
  ok((await adminUnsuspend(b, "admin1")).ok, "unsuspend");
  eq((await getCompanySubscription(b))!.status, "trialing", "back to the running trial");
  ok((await adminSetComplimentary(b, true, "admin1")).ok, "complimentary on");
  eq([(await getCompanySubscription(b))!.status, (await getCompanySubscription(b))!.complimentary], ["internal", true], "complimentary = internal");
  const compCheckout = await startCheckout(b, { planId: "growth", interval: "monthly" });
  ok(!compCheckout.ok && /complimentary/.test(compCheckout.error), "complimentary companies aren't charged");
  ok((await adminSetComplimentary(b, false, "admin1")).ok, "complimentary off");
  eq((await getCompanySubscription(b))!.status, "trialing", "complimentary off → fresh trial");
  ok((await adminReactivate(a, 30, "admin1")).ok, "reactivate canceled with a manual 30-day period");
  sa = (await getCompanySubscription(a))!;
  eq([sa.status, sa.provider?.subscriptionId ?? null], ["active", null], "manual active period");
  ok(!(await adminExtendTrial(owner, 5, "admin1")).ok, "owner can't be touched");
  ok(await db.collection("platform_audit_log").findOne({ companyId: b, actorId: "admin1", action: "subscription.admin.complimentary_on" }), "owner action audited");

  // ── Listing ──
  const list = await listSubscriptions({});
  eq(list.total, 3, "every company listed (owner included as internal)");
  eq((await listSubscriptions({ status: "trialing" })).rows.map((r) => r.companyId), [b], "status filter");
  eq((await listSubscriptions({ q: "alph" })).rows.map((r) => r.companyId), [a], "search");
  eq((await listSubscriptions({ planId: "starter" })).rows.length, 2, "plan filter");
  ok(list.totals.mrr > 0, "total MRR");

  console.log(`subscriptions: all ${checks} checks passed`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    globalThis.fetch = realFetch;
    const c = await clientPromise;
    await c.db().dropDatabase();
    await c.close();
  });
