/**
 * Registration -> Workspace -> onboarding in the Workspace, against a real
 * MongoDB in a THROWAWAY database that is dropped at the end:
 *
 *   MONGODB_URI=mongodb://127.0.0.1:27099/flow_test_$(date +%s) EMAIL_PROVIDER=console PLATFORM_ROOT_DOMAIN=localhost \
 *     npx --yes tsx --require ./scripts/lib/next-server-shims.cjs scripts/test-signup-onboarding-flow.ts
 *
 * Checks:
 *  - a fresh sign-up (start -> e-mailed link -> confirm) creates the company and
 *    hands the owner off to /workspace (not a setup wizard);
 *  - an admin approval path creates the same company with the same fresh setup state;
 *  - the redirect decision (`onboardingGateTarget`, pure): an owner with setup
 *    open is sent to /workspace/onboarding from /workspace only; completed or
 *    skipped owners, invited employees and the platform owner's company never are;
 *    no redirect loop is possible;
 *  - the real onboarding state (`companies.onboarding`) drives it, including an
 *    invited employee accepting an invitation;
 *  - the sign-up form asks only for what creating the account needs.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { clientPromise, getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { COMPANIES_COLLECTION } from "@/lib/platform/tenancy/companies";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { approveSignup, confirmSignup, consumeHandoff, startSignup } from "@/lib/platform/signup";
import { setSignupMode } from "@/lib/platform/settings";
import { acceptInvitation, inviteTeammate } from "@/lib/platform/invitations";
import { getOnboarding, markOnboardingStep, skipOnboarding } from "@/lib/platform/onboarding/state";
import { ONBOARDING_STEPS } from "@/lib/platform/onboarding/catalog";
import { ONBOARDING_PATH, WORKSPACE_HOME, isOnboardingOwner, onboardingGateTarget, setupIsOpen, type OnboardingGateInput } from "@/lib/platform/onboarding/gate";
import { getDb } from "@/lib/mongodb";

const uri = process.env.MONGODB_URI ?? "";
const dbName = uri.split("/").pop()?.split("?")[0] ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost)[:/]/.test(uri) || !dbName.includes("test")) {
  console.error(`Refusing to run: MONGODB_URI must be a local throwaway database with "test" in its name (got "${dbName}").`);
  process.exit(1);
}
if (process.env.EMAIL_PROVIDER !== "console") {
  console.error("Refusing to run: set EMAIL_PROVIDER=console so no real email is sent.");
  process.exit(1);
}

let passed = 0;
const failures: string[] = [];
async function check(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures.push(name);
    console.log(`  ✗ ${name}\n      ${err instanceof Error ? err.message : String(err)}`);
  }
}

// Capture what the console e-mail adapter prints instead of sending.
const sentEmails: string[] = [];
const origLog = console.log;
console.log = (...args: unknown[]) => {
  const line = args.map(String).join(" ");
  if (line.includes("[email:console]")) sentEmails.push(line);
  else origLog(...args);
};
const emailsTo = (addr: string) => sentEmails.filter((e) => e.includes(`to=${addr}`));
const linkIn = (mail: string, re: RegExp) => mail.match(re)?.[1] ?? "";

const open = { completedAt: null, dismissedAt: null };
const decide = (over: Partial<OnboardingGateInput> = {}) => onboardingGateTarget({ pathname: WORKSPACE_HOME, isOwner: true, isPlatformOwnerCompany: false, state: open, ...over });

async function run() {
  const db = await getPlatformDb();
  await setSignupMode("open");

  console.log("sign-up form");
  await check("the sign-up form asks only for company, address, owner name, e-mail, password and terms - no setup steps", () => {
    const form = fs.readFileSync(path.join(process.cwd(), "src/app/(platform)/signup/SignupForm.tsx"), "utf8");
    const names = [...form.matchAll(/name="([A-Za-z]+)"/g)].map((m) => m[1]).sort();
    assert.deepEqual(names, ["acceptTerms", "companyName", "email", "name", "password", "slug"]);
    assert.ok(!/useState\(\s*(0|1)\s*\)[^\n]*step/i.test(form) && !/\bstep\b/i.test(form.replace(/\/\/.*$/gm, "")), "no multi-step flow in the form");
  });

  console.log("fresh sign-up -> handoff -> /workspace");
  let freshCompanyId = "";
  await check("confirming an e-mailed sign-up creates the company and a handoff whose next is /workspace", async () => {
    const started = await startSignup({ companyName: "Fresh Co", slug: "freshco", name: "Fiona Founder", email: "fiona@fresh.test", password: "correct-horse-battery", acceptTerms: true }, { origin: "http://localhost:3000", clientKey: "t1" });
    assert.ok(started.ok, JSON.stringify(started));
    const mail = emailsTo("fiona@fresh.test")[0];
    assert.ok(mail, "confirmation e-mail was sent");
    const token = linkIn(mail, /signup\/verify\?token=([a-f0-9]+)/);
    assert.ok(token, mail);
    const res = await confirmSignup(token, { hostHint: "localhost:3000" });
    assert.ok(res.ok && "redirectTo" in res, JSON.stringify(res));
    const url = new URL((res as { redirectTo: string }).redirectTo);
    assert.equal(url.host, "freshco.localhost:3000");
    assert.equal(url.pathname, "/workspace/handoff");
    const company = await db.collection(COMPANIES_COLLECTION).findOne({ slug: "freshco" });
    freshCompanyId = String(company!._id);
    const handoff = await consumeHandoff(url.searchParams.get("token")!, freshCompanyId);
    assert.ok(handoff, "handoff is valid on the new company");
    assert.equal(handoff!.next, "/workspace", "the handoff lands on the Workspace home, where onboarding takes over");
    assert.equal(await consumeHandoff(url.searchParams.get("token")!, freshCompanyId), null, "single use");
  });
  await check("the owner is a Super Admin and the new company's setup is open (nothing completed, not skipped)", async () => {
    const owner = await db.collection("admin_users").findOne({ companyId: freshCompanyId as never, email: "fiona@fresh.test" });
    assert.deepEqual(owner?.roles, ["super_admin"]);
    const { state, company } = await runAsCompany(freshCompanyId, () => getOnboarding());
    assert.equal(company.isPlatformOwner, false);
    assert.deepEqual(state, { completedSteps: [], completedAt: null, dismissedAt: null });
    assert.equal(onboardingGateTarget({ pathname: "/workspace", isOwner: isOnboardingOwner(owner!.roles), isPlatformOwnerCompany: company.isPlatformOwner === true, state }), ONBOARDING_PATH, "opening /workspace starts onboarding");
  });

  console.log("admin approval path");
  await check("an approved request creates the same company with the same open setup state and a sign-in link to the Workspace", async () => {
    await setSignupMode("approval");
    const started = await startSignup({ companyName: "Approved Co", slug: "approvedco", name: "Ann Approved", email: "ann@approved.test", password: "correct-horse-battery", acceptTerms: true }, { origin: "http://localhost:3000", clientKey: "t2" });
    assert.ok(started.ok);
    const token = linkIn(emailsTo("ann@approved.test")[0], /signup\/verify\?token=([a-f0-9]+)/);
    const parked = await confirmSignup(token, { hostHint: "localhost:3000" });
    assert.ok(parked.ok && "awaitingApproval" in parked);
    const pending = await db.collection("pending_signups").findOne({ slug: "approvedco", status: "awaiting_approval" });
    const res = await approveSignup(String(pending!._id), { hostHint: "localhost:3000" });
    assert.ok(res.ok, res.ok ? "" : res.error);
    const mail = emailsTo("ann@approved.test").find((m) => m.includes("/workspace/login"));
    assert.ok(mail, "the approval e-mail links to the Workspace sign-in");
    const { state } = await runAsCompany((res as { companyId: string }).companyId, () => getOnboarding());
    assert.equal(setupIsOpen({ isOwner: true, isPlatformOwnerCompany: false, state }), true);
    assert.equal(decide({ state }), ONBOARDING_PATH, "signing in lands on /workspace, which starts onboarding");
    await setSignupMode("open");
  });

  console.log("redirect decision (pure)");
  await check("owner + open setup: /workspace -> /workspace/onboarding", () => assert.equal(decide(), "/workspace/onboarding"));
  await check("trailing slash and the exact home path only; deep links are never intercepted", () => {
    assert.equal(decide({ pathname: "/workspace/" }), ONBOARDING_PATH);
    for (const p of ["/workspace/crm/leads", "/workspace/settings/billing", "/workspace/users", "/workspace/notifications", "/workspace/account/documents", "/workspace/onboarding", "/hrms", "/workspace/settings"]) assert.equal(decide({ pathname: p }), null, p);
  });
  await check("completed or skipped setup goes straight to the dashboard", () => {
    assert.equal(decide({ state: { completedAt: new Date(), dismissedAt: null } }), null);
    assert.equal(decide({ state: { completedAt: null, dismissedAt: new Date() } }), null);
  });
  await check("invited employees (any non-Super-Admin role) are never sent to company onboarding", () => {
    for (const roles of [["employee"], ["pms_employee", "workspace_member"], ["hr", "employee", "chat_hr"], []]) assert.equal(decide({ isOwner: isOnboardingOwner(roles) }), null, roles.join(","));
    assert.equal(isOnboardingOwner(["super_admin"]), true);
  });
  await check("the platform owner's own company has no setup", () => assert.equal(decide({ isPlatformOwnerCompany: true }), null));
  await check("no loops: following redirects from any start ends in at most one hop, and Skip/Finish end the wizard for good", () => {
    const follow = (start: string, input: Omit<OnboardingGateInput, "pathname">) => {
      let at = start;
      const trail = [at];
      for (let i = 0; i < 5; i++) {
        const next = onboardingGateTarget({ ...input, pathname: at });
        if (!next) return trail;
        at = next;
        trail.push(at);
      }
      throw new Error(`redirect loop: ${trail.join(" -> ")}`);
    };
    const base = { isOwner: true, isPlatformOwnerCompany: false };
    assert.deepEqual(follow("/workspace", { ...base, state: open }), ["/workspace", "/workspace/onboarding"]);
    assert.deepEqual(follow("/workspace/onboarding", { ...base, state: open }), ["/workspace/onboarding"]);
    assert.deepEqual(follow("/workspace", { ...base, state: { completedAt: new Date(), dismissedAt: null } }), ["/workspace"]);
    assert.deepEqual(follow("/workspace", { ...base, state: { completedAt: null, dismissedAt: new Date() } }), ["/workspace"]);
  });

  console.log("the real state drives the decision");
  await check("finishing the wizard's steps (or skipping) stops the redirect; partial progress keeps it", async () => {
    const decideFor = async () => {
      const { company, state } = await runAsCompany(freshCompanyId, () => getOnboarding());
      return onboardingGateTarget({ pathname: "/workspace", isOwner: true, isPlatformOwnerCompany: company.isPlatformOwner === true, state });
    };
    assert.equal(await decideFor(), ONBOARDING_PATH);
    for (const step of ONBOARDING_STEPS.slice(0, -1)) await runAsCompany(freshCompanyId, () => markOnboardingStep(step.key));
    assert.equal(await decideFor(), ONBOARDING_PATH, "one step to go: still open");
    await runAsCompany(freshCompanyId, () => markOnboardingStep(ONBOARDING_STEPS[ONBOARDING_STEPS.length - 1].key));
    assert.equal(await decideFor(), null, "all steps done: dashboard");
    await db.collection(COMPANIES_COLLECTION).updateOne({ slug: "approvedco" }, { $set: { "onboarding.dismissedAt": null } });
    const approved = await db.collection(COMPANIES_COLLECTION).findOne({ slug: "approvedco" });
    await runAsCompany(String(approved!._id), () => skipOnboarding());
    const { company, state } = await runAsCompany(String(approved!._id), () => getOnboarding());
    assert.equal(onboardingGateTarget({ pathname: "/workspace", isOwner: true, isPlatformOwnerCompany: company.isPlatformOwner === true, state }), null, "skipped: dashboard");
  });
  await check("an invitation accepted in the new company makes a teammate who is not routed to onboarding", async () => {
    await db.collection(COMPANIES_COLLECTION).updateOne({ _id: freshCompanyId as never }, { $set: { "onboarding.completedSteps": [], "onboarding.completedAt": null, "onboarding.dismissedAt": null } });
    const owner = await db.collection("admin_users").findOne({ companyId: freshCompanyId as never, email: "fiona@fresh.test" });
    const invited = await runAsCompany(freshCompanyId, () => inviteTeammate({ email: "dev@fresh.test", name: "Dev", preset: "developer" }, { id: String(owner!._id), email: "fiona@fresh.test" }, "http://freshco.localhost:3000"));
    assert.ok(invited.ok, invited.ok ? "" : invited.error);
    const token = linkIn(emailsTo("dev@fresh.test")[0], /workspace\/invite\?token=([a-f0-9]+)/);
    assert.ok(token);
    const accepted = await runAsCompany(freshCompanyId, () => acceptInvitation(token, { name: "Dev", password: "another-long-password" }));
    assert.ok(accepted.ok, accepted.ok ? "" : accepted.error);
    const user = await runAsCompany(freshCompanyId, async () => (await getDb()).collection("admin_users").findOne({ email: "dev@fresh.test" }));
    assert.ok(user && !isOnboardingOwner(user.roles as string[]), "teammate is not the owner");
    const { company, state } = await runAsCompany(freshCompanyId, () => getOnboarding());
    assert.equal(setupIsOpen({ isOwner: true, isPlatformOwnerCompany: false, state }), true, "the company's setup is still open for its owner");
    assert.equal(onboardingGateTarget({ pathname: "/workspace", isOwner: isOnboardingOwner(user.roles as string[]), isPlatformOwnerCompany: company.isPlatformOwner === true, state }), null, "but the teammate goes straight to the dashboard");
  });

  console.log("wiring");
  await check("the dashboard applies the gate; the wizard, settings and upgrade pages sit under /workspace; handoff and approval land in the Workspace", () => {
    const root = process.cwd();
    const read = (rel: string) => fs.readFileSync(path.join(root, rel), "utf8");
    assert.ok(read("src/app/workspace/(protected)/page.tsx").includes("onboardingGateTarget"));
    assert.ok(!read("src/app/workspace/(protected)/onboarding/page.tsx").includes('redirect("/workspace")') || read("src/app/workspace/(protected)/onboarding/page.tsx").includes("super_admin"), "the wizard only bounces non-owners");
    assert.ok(fs.existsSync(path.join(root, "src/app/workspace/(protected)/onboarding/OnboardingWizard.tsx")));
    assert.ok(!read("src/lib/platform/signup.ts").includes('next: "/onboarding"'));
    assert.ok(read("src/lib/platform/signup.ts").includes('next: "/workspace"'));
  });
}

async function main() {
  origLog(`Scratch database: ${dbName}\n`);
  const client = await clientPromise;
  try {
    await run();
  } finally {
    await client.db().dropDatabase();
    await client.close();
    origLog(`\nDropped ${dbName}.`);
  }
  origLog(`${passed} passed, ${failures.length} failed`);
  if (failures.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
