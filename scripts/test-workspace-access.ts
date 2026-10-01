/**
 * Workspace access checks: the navigation each kind of user gets, that the
 * page guard agrees with it for every nav key, that the Workspace session
 * opens the Command Center only for the roles that allow it, and that the
 * company pages' loaders never read another company's data. Runs against a
 * throwaway database that is dropped at the end.
 *
 *   MONGODB_URI=mongodb://127.0.0.1:27099/ws_test_$(date +%s) \
 *     npx --yes tsx --require ./scripts/lib/next-server-shims.cjs scripts/test-workspace-access.ts
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { clientPromise, getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { getDb } from "@/lib/mongodb";
import { listPlans } from "@/lib/platform/billing/plans";
import { recordUsage } from "@/lib/platform/billing/usage";
import { meterStorage } from "@/lib/platform/billing/enforce";
import { rolesForPreset } from "@/lib/platform/onboarding/catalog";
import { createHubSession, getSessionHubUser } from "@/lib/hub-auth";
import { createAdminSession, resolveAdminUser } from "@/lib/admin-auth";
import { NAV_KEYS, NAV_SECTIONS } from "@/lib/workspace/nav";
import { checkWorkspaceAccess, resolveWorkspaceNav, type WorkspaceUser } from "@/lib/workspace/access";
import { getCompanyBillingHistory, getCompanySecurity, getCompanyUsage, listCompanyIntegrations, paymentsFromInvoices } from "@/lib/workspace/company";
import { ALL_KNOWN_ROLES } from "@/lib/workspace/role-catalog";
import { ALL_PERMISSION_KEYS } from "@/lib/workspace/permission-catalog";

let passed = 0;
async function check(name: string, fn: () => Promise<void> | void) {
  await fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

const ADMIN_KEYS = NAV_KEYS.filter((k) => k.startsWith("admin."));
const COMPANY_KEYS = NAV_KEYS.filter((k) => k.startsWith("company."));

async function main() {
  const db = await getPlatformDb();
  if (!/test/.test(db.databaseName)) throw new Error(`Refusing to run against "${db.databaseName}"`);

  const now = new Date();
  const owner = randomUUID(); // runs the platform: no plan, every panel
  const acme = randomUUID(); // Growth plan
  const small = randomUUID(); // Starter plan: no Finance
  const beta = randomUUID(); // a second tenant with nothing in it
  const company = (id: string, slug: string, isPlatformOwner = false) => ({ _id: id as never, slug, name: slug[0].toUpperCase() + slug.slice(1), status: "active", isPlatformOwner, createdAt: now, updatedAt: now });
  await db.collection("companies").insertMany([company(owner, "owner", true), company(acme, "acme"), company(small, "small"), company(beta, "beta")]);
  await listPlans(); // seeds the default catalogue
  const sub = (planId: string) => ({ planId, status: "active", interval: "monthly", trialEndsAt: null, currentPeriodStart: now, currentPeriodEnd: null, cancelAtPeriodEnd: false, graceEndsAt: null, provider: null, updatedAt: now });
  for (const [id, plan] of [[acme, "growth"], [small, "starter"], [beta, "growth"]] as const) await db.collection("companies").updateOne({ _id: id as never }, { $set: { subscription: sub(plan) } });

  /** Creates an account in a company and returns it as the Workspace sees it (through a real session). */
  async function account(companyId: string, email: string, roles: string[], extra: Record<string, unknown> = {}): Promise<{ user: WorkspaceUser & { email: string }; hubToken: string; _id: ObjectId }> {
    return runAsCompany(companyId, async () => {
      const _id = new ObjectId();
      await (await getDb()).collection("admin_users").insertOne({ _id, email, passwordHash: "x", failedLoginAttempts: 0, lockedUntil: null, createdAt: now, lastLoginAt: now, roles, ...extra });
      const hubToken = await createHubSession(_id);
      const user = await getSessionHubUser(hubToken);
      assert.ok(user, `session for ${email}`);
      return { user, hubToken, _id };
    });
  }
  const preset = (p: string) => rolesForPreset(p)!;

  const admin = await account(acme, "admin@acme.test", ["super_admin"]);
  const hr = await account(acme, "hr@acme.test", preset("hr"));
  const dev = await account(acme, "dev@acme.test", preset("developer"));
  const finance = await account(acme, "fin@acme.test", preset("finance"));
  const sales = await account(acme, "sales@acme.test", preset("sales"));
  // A developer the Super Admin gave two single capabilities, and took one away.
  const tuned = await account(acme, "tuned@acme.test", preset("developer"), { permissionOverrides: { "lms.canViewAnalytics": true, "portal.isPortalAdmin": true, "workspace.canViewAnalytics": false } });
  const noRoles = await account(acme, "nobody@acme.test", []);
  const smallAdmin = await account(small, "admin@small.test", ["super_admin"]);
  const smallFinance = await account(small, "fin@small.test", preset("finance"));
  const betaAdmin = await account(beta, "admin@beta.test", ["super_admin"]);
  const ownerAdmin = await account(owner, "root@owner.test", ["super_admin"]);
  const ownerRevoked = await account(owner, "revoked@owner.test", ["super_admin"], { platformRevokedAt: now });
  const ownerHr = await account(owner, "hr@owner.test", preset("hr"));

  const everyone: [string, string, { user: WorkspaceUser }][] = [
    ["acme super admin", acme, admin],
    ["acme HR manager", acme, hr],
    ["acme PMS employee", acme, dev],
    ["acme finance", acme, finance],
    ["acme sales", acme, sales],
    ["acme developer with overrides", acme, tuned],
    ["acme account without roles", acme, noRoles],
    ["starter-plan super admin", small, smallAdmin],
    ["starter-plan finance", small, smallFinance],
    ["second tenant super admin", beta, betaAdmin],
    ["platform owner", owner, ownerAdmin],
    ["owner-company super admin, platform access revoked", owner, ownerRevoked],
    ["owner-company HR", owner, ownerHr],
  ];
  const navOf = (companyId: string, u: { user: WorkspaceUser }) => runAsCompany(companyId, () => resolveWorkspaceNav(u.user));
  const allowed = async (companyId: string, u: { user: WorkspaceUser }) => new Set((await navOf(companyId, u)).allowed);

  console.log("catalogs");
  await check("the nav uses only roles and permissions that exist in the catalogs", () => {
    for (const p of ["hr", "developer", "finance", "sales"]) for (const r of preset(p)) assert.ok(ALL_KNOWN_ROLES.includes(r), `role ${r}`);
    for (const k of ["lms.canViewAnalytics", "portal.isPortalAdmin", "workspace.canViewAnalytics"]) assert.ok(ALL_PERMISSION_KEYS.includes(k), `permission ${k}`);
    assert.equal(new Set(NAV_KEYS).size, NAV_KEYS.length, "nav keys are unique");
  });

  console.log("navigation = guard");
  for (const [name, companyId, u] of everyone) {
    await check(`${name}: the guard agrees with the navigation for all ${NAV_KEYS.length} keys`, async () => {
      const nav = await navOf(companyId, u);
      const shown = new Set(nav.sections.flatMap((s) => s.items.map((i) => i.key)));
      assert.deepEqual([...shown].sort(), [...nav.allowed].sort(), "sections contain exactly the allowed items");
      for (const key of NAV_KEYS) {
        const guard = await runAsCompany(companyId, () => checkWorkspaceAccess(u.user, key));
        assert.equal(guard, shown.has(key), `${key}: shown=${shown.has(key)} guard=${guard}`);
      }
      assert.ok(nav.sections.every((s) => s.items.length > 0), "no empty section");
      const order = NAV_SECTIONS.map((s) => s.key);
      assert.deepEqual(nav.sections.map((s) => s.key), order.filter((k) => nav.sections.some((s) => s.key === k)), "section order");
      assert.equal(await runAsCompany(companyId, () => checkWorkspaceAccess(u.user, "no.such.key")), false);
    });
  }

  console.log("who sees what");
  await check("company super admin: every company and admin item, the plan's panels, no Platform link", async () => {
    const a = await allowed(acme, admin);
    for (const k of [...COMPANY_KEYS, ...ADMIN_KEYS, "dashboard", "account.notifications", "account.password"]) assert.ok(a.has(k), k);
    for (const k of ["panel.hrms", "panel.pms", "panel.fms", "panel.lms", "panel.messenger", "analytics.fms", "analytics.portal", "analytics.workspace"]) assert.ok(a.has(k), k);
    assert.ok(!a.has("platform.panel"), "tenant never sees the Platform link");
    const nav = await navOf(acme, admin);
    assert.deepEqual(nav.sections.map((s) => s.key), ["dashboard", "panels", "analytics", "admin", "company", "account"]);
    // Growth has no Training / Social / AI Bots: locked on the hub, absent from the nav.
    assert.ok(!a.has("panel.tms") && nav.lockedPanels.includes("tms"));
    assert.ok(!a.has("analytics.tms"));
  });
  await check("HR manager: HR panel and analytics, nothing of company admin or company settings", async () => {
    const a = await allowed(acme, hr);
    for (const k of ["panel.hrms", "panel.lms", "panel.messenger", "panel.sop", "panel.ots", "analytics.hrms", "analytics.messenger", "analytics.workspace"]) assert.ok(a.has(k), k);
    for (const k of [...COMPANY_KEYS, ...ADMIN_KEYS, "panel.pms", "panel.fms", "analytics.fms", "analytics.pms", "analytics.lms", "analytics.portal", "platform.panel"]) assert.ok(!a.has(k), k);
    assert.deepEqual((await navOf(acme, hr)).sections.map((s) => s.key), ["dashboard", "panels", "analytics", "account"]);
  });
  await check("PMS employee: own panels only; lead and portal analytics are not theirs", async () => {
    const a = await allowed(acme, dev);
    for (const k of ["panel.pms", "panel.hrms", "panel.prms", "panel.dlms", "analytics.pms", "analytics.hrms", "analytics.prms"]) assert.ok(a.has(k), k);
    for (const k of ["panel.fms", "analytics.fms", "analytics.lms", "analytics.portal", "admin.dashboard", "company.billing", "company.users"]) assert.ok(!a.has(k), k);
  });
  await check("finance user: Finance panel and analytics", async () => {
    const a = await allowed(acme, finance);
    assert.ok(a.has("panel.fms") && a.has("analytics.fms"));
    assert.ok(!a.has("panel.pms") && !a.has("company.invoices") && !a.has("admin.prms.payments"));
  });
  await check("sales manager: lead analytics through the LMS role", async () => {
    assert.ok((await allowed(acme, sales)).has("analytics.lms"));
  });
  await check("permission overrides add and remove single items", async () => {
    const a = await allowed(acme, tuned);
    const base = await allowed(acme, dev);
    assert.ok(a.has("analytics.lms") && !base.has("analytics.lms"), "granted lms.canViewAnalytics");
    assert.ok(a.has("analytics.portal") && !base.has("analytics.portal"), "granted portal.isPortalAdmin");
    assert.ok(!a.has("analytics.workspace") && base.has("analytics.workspace"), "denied workspace.canViewAnalytics");
    assert.ok(!a.has("admin.dashboard") && !a.has("company.billing"), "overrides never open company admin");
  });
  await check("an account without roles gets the dashboard, the open CRM and its own account pages", async () => {
    const a = await allowed(acme, noRoles);
    assert.deepEqual([...a].sort(), ["account.notifications", "account.password", "dashboard", "panel.lms"]);
  });
  await check("plan without Finance: the panel is locked, its analytics hidden — for the finance user and the super admin", async () => {
    for (const u of [smallFinance, smallAdmin]) {
      const nav = await navOf(small, u);
      assert.ok(nav.lockedPanels.includes("fms"), "locked tile");
      assert.ok(!nav.allowed.includes("panel.fms") && !nav.allowed.includes("analytics.fms"));
      assert.equal(await runAsCompany(small, () => checkWorkspaceAccess(u.user, "analytics.fms")), false);
    }
    assert.ok((await allowed(small, smallAdmin)).has("panel.hrms"));
    assert.ok(!(await allowed(small, smallAdmin)).has("analytics.portal"), "portal is not in Starter");
    assert.ok((await allowed(small, smallAdmin)).has("company.billing"), "the company still manages its plan");
  });
  await check("a panel the company switched off disappears (not locked)", async () => {
    await db.collection("companies").updateOne({ _id: beta as never }, { $set: { enabledModules: ["workspace", "admin", "messenger", "hrms"] } });
    const nav = await navOf(beta, betaAdmin);
    assert.ok(nav.allowed.includes("panel.hrms") && !nav.allowed.includes("panel.pms") && !nav.allowed.includes("analytics.pms"));
    assert.ok(!nav.lockedPanels.includes("pms"));
    await db.collection("companies").updateOne({ _id: beta as never }, { $unset: { enabledModules: "" } });
  });

  console.log("platform boundary");
  await check("Platform link: only owner company + platform access", async () => {
    assert.ok((await allowed(owner, ownerAdmin)).has("platform.panel"), "platform owner");
    assert.ok(!(await allowed(owner, ownerRevoked)).has("platform.panel"), "revoked");
    assert.ok(!(await allowed(owner, ownerHr)).has("platform.panel"), "no platform role");
    for (const [, companyId, u] of everyone.filter(([, c]) => c !== owner)) assert.ok(!(await allowed(companyId, u)).has("platform.panel"));
  });
  await check("a platform role gives the link without any Workspace permission, and Workspace roles don't give the link", async () => {
    await runAsCompany(owner, async () => (await getDb()).collection("admin_users").updateOne({ _id: ownerHr._id }, { $set: { platformRoleId: "owner" } }));
    const a = await allowed(owner, ownerHr);
    assert.ok(a.has("platform.panel"));
    assert.ok(!a.has("company.billing") && !a.has("admin.dashboard"), "platform access is not company admin");
    await runAsCompany(owner, async () => (await getDb()).collection("admin_users").updateOne({ _id: ownerHr._id }, { $unset: { platformRoleId: "" } }));
    assert.ok((await allowed(owner, ownerRevoked)).has("company.billing"), "revoked platform access keeps company admin");
  });
  await check("the nav never contains a Platform Panel page other than the single link", async () => {
    const nav = await navOf(owner, ownerAdmin);
    const platformLinks = nav.sections.flatMap((s) => s.items).filter((i) => i.href.startsWith("/platform"));
    assert.deepEqual(platformLinks.map((i) => i.href), ["/platform"]);
  });

  console.log("Command Center with the Workspace session");
  await check("super admin: the hub session opens /admin; other roles are refused", async () => {
    const a = await runAsCompany(acme, () => resolveAdminUser(null, admin.hubToken));
    assert.equal(a?.email, "admin@acme.test");
    assert.deepEqual(a?.roles, ["super_admin"]);
    for (const u of [hr, dev, finance, tuned, noRoles]) assert.equal(await runAsCompany(acme, () => resolveAdminUser(null, u.hubToken)), null);
    assert.equal(await runAsCompany(acme, () => resolveAdminUser(null, null)), null);
    assert.equal(await runAsCompany(acme, () => resolveAdminUser("bogus", "bogus")), null);
  });
  await check("the admin session still works on its own", async () => {
    const token = await runAsCompany(acme, () => createAdminSession(admin._id));
    assert.equal((await runAsCompany(acme, () => resolveAdminUser(token, null)))?.email, "admin@acme.test");
  });
  await check("a session of one company opens nothing in another", async () => {
    assert.equal(await runAsCompany(beta, () => resolveAdminUser(null, admin.hubToken)), null);
    assert.equal(await runAsCompany(beta, () => getSessionHubUser(admin.hubToken)), null);
  });
  await check("losing super_admin closes /admin for the existing session at once", async () => {
    const temp = await account(acme, "temp@acme.test", ["super_admin"]);
    assert.ok(await runAsCompany(acme, () => resolveAdminUser(null, temp.hubToken)));
    await runAsCompany(acme, async () => (await getDb()).collection("admin_users").updateOne({ _id: temp._id }, { $set: { roles: preset("hr") } }));
    assert.equal(await runAsCompany(acme, () => resolveAdminUser(null, temp.hubToken)), null);
    const fresh = await runAsCompany(acme, () => getSessionHubUser(temp.hubToken));
    assert.equal(await runAsCompany(acme, () => checkWorkspaceAccess(fresh!, "company.billing")), false);
    await runAsCompany(acme, async () => (await getDb()).collection("admin_users").deleteOne({ _id: temp._id }));
  });

  console.log("tenant isolation of the company pages");
  const invoice = (companyId: string, over: Record<string, unknown>) => ({
    _id: randomUUID() as never,
    kind: "invoice",
    companyId,
    financialYear: "26-27",
    status: "paid",
    paymentRef: null,
    refundRef: null,
    currency: "INR",
    total: 118000,
    taxTotal: 18000,
    issuedAt: now,
    paidAt: now,
    original: null,
    ...over,
  });
  await db.collection("saas_invoices").insertMany([
    invoice(acme, { number: "YO/26-27/00001", paymentRef: "pay_acme_1", paidAt: new Date(now.getTime() - 86_400_000) }),
    invoice(acme, { number: "YO/26-27/00002", status: "unpaid", paidAt: null }),
    invoice(acme, { number: "CN/26-27/00001", kind: "credit_note", status: "issued", refundRef: "rfnd_acme_1", total: 50000, paidAt: null, original: { id: "x", number: "YO/26-27/00001", issuedAt: now } }),
  ]);
  await runAsCompany(acme, async () => {
    await recordUsage("ai_tokens", 1234);
    await meterStorage(3 * 1024 * 1024);
    const d = await getDb();
    await d.collection("workflows").insertOne({ _id: randomUUID() as never, name: "Hook", enabled: true, trigger: "lead.created", conditions: [], actions: [{ type: "webhook", url: "https://example.com/hook" }], secret: "s", lastRun: null, createdAt: now, updatedAt: now });
    await d.collection("admin_users").updateOne({ _id: dev._id }, { $set: { mustChangePassword: true } });
    await d.collection("admin_users").updateOne({ _id: hr._id }, { $set: { lockedUntil: new Date(now.getTime() + 600_000) } });
  });
  await db.collection("company_domains").insertMany([
    { _id: "acme.localhost" as never, companyId: acme, status: "verified", verificationToken: "t", isPrimary: true, kind: "subdomain", createdAt: now, verifiedAt: now },
    { _id: "app.acme.example" as never, companyId: acme, status: "verified", verificationToken: "t", isPrimary: false, kind: "custom", createdAt: now, verifiedAt: now },
  ]);

  await check("usage: own seats, AI tokens and storage against the plan's limits", async () => {
    const u = await runAsCompany(acme, () => getCompanyUsage());
    assert.equal(u.planName, "Growth");
    assert.deepEqual([u.seats.used, u.seats.limit], [6, 50], "six accounts with roles");
    assert.deepEqual([u.aiTokens.used, u.aiTokens.limit], [1234, 1_000_000]);
    assert.deepEqual([u.storageMb.used, u.storageMb.limit], [3, 25_000]);
    const b = await runAsCompany(beta, () => getCompanyUsage());
    assert.deepEqual([b.seats.used, b.aiTokens.used, b.storageMb.used], [1, 0, 0], "the second company sees only its own usage");
    const o = await runAsCompany(owner, () => getCompanyUsage());
    assert.deepEqual([o.status, o.seats.limit, o.aiTokens.limit, o.storageMb.limit], ["internal", null, null, null]);
  });
  await check("usage levels: near and over the limit", async () => {
    await runAsCompany(small, () => recordUsage("ai_tokens", 170_000));
    assert.equal((await runAsCompany(small, () => getCompanyUsage())).aiTokens.level, "near");
    await runAsCompany(small, () => recordUsage("ai_tokens", 40_000));
    assert.equal((await runAsCompany(small, () => getCompanyUsage())).aiTokens.level, "over");
  });
  await check("payments: paid invoices and credit notes of this company only", async () => {
    const a = await runAsCompany(acme, () => getCompanyBillingHistory());
    assert.equal(a.invoices.length, 3);
    assert.deepEqual(a.payments.map((p) => [p.kind, p.documentNumber, p.reference, p.amount]), [
      ["refund", "CN/26-27/00001", "rfnd_acme_1", 50000],
      ["payment", "YO/26-27/00001", "pay_acme_1", 118000],
    ]);
    for (const other of [beta, small, owner]) {
      const b = await runAsCompany(other, () => getCompanyBillingHistory());
      assert.deepEqual([b.invoices.length, b.payments.length], [0, 0]);
    }
    assert.deepEqual(paymentsFromInvoices([]), []);
  });
  await check("integrations: status from the company's own gateway, webhooks and domains", async () => {
    const a = await runAsCompany(acme, () => listCompanyIntegrations());
    assert.deepEqual(a.map((i) => [i.key, i.connected]), [["razorpay", false], ["webhooks", true], ["domain", true]]);
    assert.deepEqual(a.map((i) => i.href), ["/settings/payments", "/settings/automations", "/settings/domains"]);
    const b = await runAsCompany(beta, () => listCompanyIntegrations());
    assert.deepEqual(b.map((i) => i.connected), [false, false, false], "the second company sees none of the first's integrations");
  });
  await check("security: own accounts and own sessions only", async () => {
    const a = await runAsCompany(acme, () => getCompanySecurity(admin.user.id));
    assert.deepEqual(a, { accounts: 6, superAdmins: 1, mustChangePassword: 1, locked: 1, ownSessions: 1 });
    const b = await runAsCompany(beta, () => getCompanySecurity(betaAdmin.user.id));
    assert.deepEqual(b, { accounts: 1, superAdmins: 1, mustChangePassword: 0, locked: 0, ownSessions: 1 });
    // Another company's user id finds no sessions here.
    assert.equal((await runAsCompany(beta, () => getCompanySecurity(admin.user.id))).ownSessions, 0);
  });

  console.log(`workspace access: all ${passed} checks passed`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    const c = await clientPromise;
    await c.db().dropDatabase();
    await c.close();
  });
