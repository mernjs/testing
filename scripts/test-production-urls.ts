/**
 * Production addressing: the workspace address must never come out as `localhost` on a deployed server, the platform's own
 * hosts (yashorbit.com, www.yashorbit.com) must route to the platform owner, every company's `<slug>.<root>` must route to
 * that company only, and with a wildcard domain nothing is attached per company. Runs against a throwaway LOCAL database
 * (dropped at the end); the hosting provider is never called.
 *
 *   MONGODB_URI=mongodb://127.0.0.1:27099/produrl_test_$(date +%s) \
 *     npx --yes tsx --require ./scripts/lib/next-server-shims.cjs scripts/test-production-urls.ts
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { clientPromise, getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { COMPANIES_COLLECTION, COMPANY_DOMAINS_COLLECTION, forgetCompanyRouting, isPlatformHost, resolveCompanyIdByHost, type Company, type CompanyDomain } from "@/lib/platform/tenancy/companies";
import { companyBaseUrl, companySubdomain, createCompanyWithOwner, platformRootDomain, wildcardSubdomainsEnabled } from "@/lib/platform/tenancy/provisioning";
import { isSubdomainOfRoot, productionRootDomain, rootDomainFromHost } from "@/lib/platform/tenancy/root-domain";
import { bustIntegrationsCache } from "@/lib/platform/integrations/store";

const uri = process.env.MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/[\w-]*test[\w-]*$/i.test(uri)) {
  console.error("Refusing to run: MONGODB_URI must be a local throwaway database whose name contains 'test'.");
  process.exit(1);
}

const KEYS = ["PLATFORM_ROOT_DOMAIN", "PLATFORM_HOSTS", "VERCEL_ENV", "VERCEL_URL", "VERCEL_BRANCH_URL", "VERCEL_PROJECT_PRODUCTION_URL", "NODE_ENV", "DOMAIN_PROVIDER", "VERCEL_API_TOKEN", "VERCEL_PROJECT_ID", "PLATFORM_WILDCARD_SUBDOMAINS"] as const;
const saved: Record<string, string | undefined> = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
const env = process.env as Record<string, string | undefined>;
function setEnv(values: Partial<Record<(typeof KEYS)[number], string | null>>) {
  for (const k of KEYS) delete env[k];
  for (const [k, v] of Object.entries(values)) if (v != null) env[k] = v;
  bustIntegrationsCache();
  forgetCompanyRouting();
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

async function main() {
  const db = await getPlatformDb();
  const now = new Date();

  console.log("root domain from the Vercel production URL");
  await check("www.yashorbit.com → yashorbit.com; only on Vercel production; never a *.vercel.app address", () => {
    assert.equal(productionRootDomain({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "www.yashorbit.com" }), "yashorbit.com");
    assert.equal(productionRootDomain({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "https://yashorbit.com/" }), "yashorbit.com");
    assert.equal(productionRootDomain({ VERCEL_ENV: "preview", VERCEL_PROJECT_PRODUCTION_URL: "www.yashorbit.com" }), null);
    assert.equal(productionRootDomain({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "site-abc.vercel.app" }), null);
    assert.equal(productionRootDomain({}), null);
  });
  await check("a last-resort guess from the request host", () => {
    assert.equal(rootDomainFromHost("www.yashorbit.com"), "yashorbit.com");
    assert.equal(rootDomainFromHost("yashorbit.com:443"), "yashorbit.com");
    assert.equal(rootDomainFromHost("app.example.co.in"), "example.co.in");
    for (const h of ["localhost:3000", "127.0.0.1", "acme.localhost:3001", "x-y.vercel.app", "", null, undefined]) assert.equal(rootDomainFromHost(h as string), null, String(h));
  });
  await check("isSubdomainOfRoot: exactly one label under the root", () => {
    assert.equal(isSubdomainOfRoot("acme.yashorbit.com", "yashorbit.com"), true);
    for (const h of ["yashorbit.com", "a.b.yashorbit.com", "acme.com", "notyashorbit.com"]) assert.equal(isSubdomainOfRoot(h, "yashorbit.com"), false, h);
    assert.equal(isSubdomainOfRoot("acme.localhost", "localhost"), false);
  });

  console.log("workspace addresses are never localhost in production");
  await check("PLATFORM_ROOT_DOMAIN set → https://<slug>.<root>", () => {
    setEnv({ PLATFORM_ROOT_DOMAIN: "yashorbit.com", NODE_ENV: "production" });
    assert.equal(platformRootDomain(), "yashorbit.com");
    assert.equal(companySubdomain("acme"), "acme.yashorbit.com");
    assert.equal(companyBaseUrl("acme", "www.yashorbit.com"), "https://acme.yashorbit.com");
  });
  await check("nothing configured on Vercel production → the root still comes from the production URL", () => {
    setEnv({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "www.yashorbit.com", NODE_ENV: "production" });
    assert.equal(platformRootDomain(), "yashorbit.com");
    assert.equal(companyBaseUrl("acme", "www.yashorbit.com"), "https://acme.yashorbit.com");
  });
  await check("nothing configured at all in production → derived from the request host, never http://…localhost", () => {
    setEnv({ NODE_ENV: "production" });
    const url = companyBaseUrl("acme", "www.yashorbit.com");
    assert.equal(url, "https://acme.yashorbit.com");
    assert.ok(!url.includes("localhost"));
  });
  await check("development keeps *.localhost with the request's port", () => {
    setEnv({ NODE_ENV: "development" });
    assert.equal(companyBaseUrl("acme", "localhost:3001"), "http://acme.localhost:3001");
  });

  console.log("host → company routing");
  const owner = randomUUID();
  const acme = randomUUID();
  const beta = randomUUID();
  const suspended = randomUUID();
  await db.collection<Company>(COMPANIES_COLLECTION).insertMany([
    { _id: owner, slug: "yashorbit", name: "YashOrbit", status: "active", isPlatformOwner: true, createdAt: now, updatedAt: now },
    { _id: acme, slug: "acme", name: "Acme", status: "active", isPlatformOwner: false, createdAt: now, updatedAt: now },
    { _id: beta, slug: "beta", name: "Beta", status: "active", isPlatformOwner: false, createdAt: now, updatedAt: now },
    { _id: suspended, slug: "gone", name: "Gone", status: "suspended", isPlatformOwner: false, createdAt: now, updatedAt: now },
  ]);
  await db.collection<CompanyDomain>(COMPANY_DOMAINS_COLLECTION).insertOne({ _id: "acme-corp.com", companyId: acme, status: "verified", verificationToken: "t", isPrimary: false, kind: "custom", createdAt: now, verifiedAt: now });
  await check("with only the root domain configured (no PLATFORM_HOSTS): apex and www → platform owner; <slug>.root → that company only", async () => {
    setEnv({ PLATFORM_ROOT_DOMAIN: "yashorbit.com", NODE_ENV: "production" });
    assert.equal(await resolveCompanyIdByHost("yashorbit.com"), owner);
    assert.equal(await resolveCompanyIdByHost("www.yashorbit.com"), owner);
    assert.equal(await resolveCompanyIdByHost("acme.yashorbit.com"), acme);
    assert.equal(await resolveCompanyIdByHost("BETA.yashorbit.com:443"), beta);
  });
  await check("same on Vercel production with only the production URL set", async () => {
    setEnv({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "www.yashorbit.com", NODE_ENV: "production" });
    assert.equal(await resolveCompanyIdByHost("www.yashorbit.com"), owner);
    assert.equal(await resolveCompanyIdByHost("acme.yashorbit.com"), acme);
  });
  await check("a verified custom domain → its company (with or without www)", async () => {
    setEnv({ PLATFORM_ROOT_DOMAIN: "yashorbit.com", NODE_ENV: "production" });
    assert.equal(await resolveCompanyIdByHost("acme-corp.com"), acme);
    assert.equal(await resolveCompanyIdByHost("www.acme-corp.com"), acme);
  });
  await check("no fallback: unknown, reserved, nested, suspended and foreign hosts resolve to no company", async () => {
    setEnv({ PLATFORM_ROOT_DOMAIN: "yashorbit.com", NODE_ENV: "production" });
    for (const h of ["nobody.yashorbit.com", "api.yashorbit.com", "a.b.yashorbit.com", "gone.yashorbit.com", "evil.com", "yashorbit.com.evil.com", "acme.evil.com"]) {
      assert.equal(await resolveCompanyIdByHost(h), null, h);
    }
  });
  await check("the root and www.<root> count as platform hosts (never a company's own domain)", () => {
    setEnv({ PLATFORM_ROOT_DOMAIN: "yashorbit.com", NODE_ENV: "production" });
    assert.equal(isPlatformHost("yashorbit.com"), true);
    assert.equal(isPlatformHost("www.yashorbit.com"), true);
    assert.equal(isPlatformHost("acme.yashorbit.com"), true);
    assert.equal(isPlatformHost("acme-corp.com"), false);
  });

  console.log("automatic subdomain at registration");
  const owner2 = { email: "o@wild.test", name: "Owner", passwordHash: "x", mustChangePassword: false };
  await check("wildcard on: the subdomain is recorded and verified, the hosting provider is never called, no error", async () => {
    // A Vercel provider with credentials: if it were called it would hit the network and fail.
    setEnv({ PLATFORM_ROOT_DOMAIN: "yashorbit.com", NODE_ENV: "production", DOMAIN_PROVIDER: "vercel", VERCEL_API_TOKEN: "tok_test", VERCEL_PROJECT_ID: "prj_test", PLATFORM_WILDCARD_SUBDOMAINS: "1" });
    assert.equal(wildcardSubdomainsEnabled(), true);
    const res = await createCompanyWithOwner({ name: "Wild Co", slug: "wildco", owner: owner2 });
    assert.ok(res.ok, res.ok ? "" : res.error);
    if (!res.ok) return;
    assert.equal(res.host, "wildco.yashorbit.com");
    assert.equal(res.hostingError, null);
    const rec = await db.collection<CompanyDomain>(COMPANY_DOMAINS_COLLECTION).findOne({ _id: "wildco.yashorbit.com" });
    assert.equal(rec?.status, "verified");
    assert.equal(rec?.kind, "subdomain");
    assert.equal(rec?.provider?.id, "wildcard");
    assert.equal(rec?.provider?.attached, true);
    assert.equal(await resolveCompanyIdByHost("wildco.yashorbit.com"), res.companyId, "routes right after registration");
  });
  await check("wildcard off: the manual provider records the address, routing still works", async () => {
    setEnv({ PLATFORM_ROOT_DOMAIN: "yashorbit.com", NODE_ENV: "production", DOMAIN_PROVIDER: "manual" });
    assert.equal(wildcardSubdomainsEnabled(), false);
    const res = await createCompanyWithOwner({ name: "Manual Co", slug: "manualco", owner: { ...owner2, email: "o@manual.test" } });
    assert.ok(res.ok, res.ok ? "" : res.error);
    if (!res.ok) return;
    const rec = await db.collection<CompanyDomain>(COMPANY_DOMAINS_COLLECTION).findOne({ _id: "manualco.yashorbit.com" });
    assert.equal(rec?.provider?.id, "manual");
    assert.equal(await resolveCompanyIdByHost("manualco.yashorbit.com"), res.companyId);
  });
}

main()
  .catch((err) => {
    failures.push(`unexpected: ${err instanceof Error ? err.stack : String(err)}`);
    console.error(err);
  })
  .finally(async () => {
    for (const k of KEYS) {
      if (saved[k] === undefined) delete env[k];
      else env[k] = saved[k];
    }
    try {
      await (await getPlatformDb()).dropDatabase();
      console.log("\nDropped the scratch database.");
    } catch {}
    await (await clientPromise).close();
    console.log(`${passed} passed, ${failures.length} failed`);
    process.exit(failures.length ? 1 : 0);
  });
