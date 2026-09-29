import "server-only";
import { randomUUID } from "node:crypto";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { slugFormatError } from "@/lib/platform/tenancy/slug";
import { COMPANIES_COLLECTION, COMPANY_DOMAINS_COLLECTION, forgetCompanyRouting, type Company, type CompanyDomain } from "@/lib/platform/tenancy/companies";
import { activeDomainProvider, type DomainStatus } from "@/lib/platform/domains";
import { getDb } from "@/lib/mongodb";

/**
 * Creating a company (tenant): the one code path shared by self-serve sign-up
 * and the `db:create-company` script, so both produce identical workspaces.
 */

export { slugFormatError, slugFromName } from "@/lib/platform/tenancy/slug";

export async function isSlugTaken(slug: string): Promise<boolean> {
  const db = await getPlatformDb();
  return (await db.collection<Company>(COMPANIES_COLLECTION).countDocuments({ slug }, { limit: 1 })) > 0;
}

/** The root domain company subdomains live under (`PLATFORM_ROOT_DOMAIN`, first entry), or `localhost` in development. */
export function platformRootDomain(): string {
  return (process.env.PLATFORM_ROOT_DOMAIN ?? "").split(",")[0].trim().toLowerCase() || "localhost";
}

/** `<slug>.<root>` — every company's automatic address. */
export function companySubdomain(slug: string): string {
  return `${slug}.${platformRootDomain()}`;
}

/**
 * Absolute base URL for a company's workspace. On `localhost` it keeps the
 * port of the request the link is being built from (`hostHint`), since
 * `*.localhost` resolves to the same machine.
 */
export function companyBaseUrl(slug: string, hostHint?: string | null): string {
  const root = platformRootDomain();
  if (root === "localhost") {
    const port = hostHint?.match(/:(\d+)$/)?.[1] ?? process.env.PORT ?? "3000";
    return `http://${slug}.localhost:${port}`;
  }
  return `https://${slug}.${root}`;
}

export interface NewCompany {
  name: string;
  slug: string;
  owner: { email: string; name: string; passwordHash: string; mustChangePassword: boolean };
}

export type ProvisionResult = { ok: true; companyId: string; adminId: string; host: string; hostingError: string | null } | { ok: false; error: string };

export async function createCompanyWithOwner(input: NewCompany): Promise<ProvisionResult> {
  const slugError = slugFormatError(input.slug);
  if (slugError) return { ok: false, error: slugError };
  const host = companySubdomain(input.slug);

  const platform = await getPlatformDb();
  const companies = platform.collection<Company>(COMPANIES_COLLECTION);
  const domains = platform.collection<CompanyDomain>(COMPANY_DOMAINS_COLLECTION);
  await companies.createIndex({ slug: 1 }, { unique: true });

  const now = new Date();
  const company: Company = { _id: randomUUID(), slug: input.slug, name: input.name.trim(), status: "active", isPlatformOwner: false, createdAt: now, updatedAt: now };
  try {
    await companies.insertOne(company);
  } catch (err) {
    // The unique index settles two sign-ups racing for the same address.
    if ((err as { code?: number }).code === 11000) return { ok: false, error: "That workspace address was just taken. Choose another." };
    throw err;
  }

  const adminId = await runAsCompany(company._id, async () => {
    const users = (await getDb()).collection("admin_users");
    await users.createIndex({ email: 1 }, { unique: true });
    const res = await users.insertOne({
      email: input.owner.email.trim().toLowerCase(),
      name: input.owner.name.trim(),
      passwordHash: input.owner.passwordHash,
      roles: ["super_admin"],
      permissionOverrides: {},
      userType: "system",
      notes: `Founding Super Admin of ${company.name}`,
      employeeId: null,
      mustChangePassword: input.owner.mustChangePassword,
      failedLoginAttempts: 0,
      lockedUntil: null,
      createdAt: now,
      updatedAt: now,
    });
    return String(res.insertedId);
  });

  // The automatic subdomain. Routing works from the slug alone; this record is
  // what the Domains settings list, and the provider attach is what gives it TLS.
  await domains.updateOne(
    { _id: host },
    { $setOnInsert: { companyId: company._id, status: "verified", verificationToken: randomUUID(), isPrimary: true, kind: "subdomain", createdAt: now, verifiedAt: now } },
    { upsert: true },
  );
  const hostingError = await attachAtProvider(host);
  forgetCompanyRouting();

  return { ok: true, companyId: company._id, adminId, host, hostingError };
}

/**
 * Attaches a host at the hosting provider and records the outcome on its
 * domain record. Never throws — a provider outage mustn't fail a sign-up; the
 * Domains settings page shows the error and retries.
 */
export async function attachAtProvider(host: string): Promise<string | null> {
  return (await syncAtProvider(host, "add")).error;
}

export interface ProviderSync {
  providerId: string;
  /** null when the call failed (see `error`) or nothing needed attaching. */
  status: DomainStatus | null;
  error: string | null;
}

/**
 * One provider call for a host — `add` attaches it, `status` reads it,
 * `verify` asks the provider to re-check ownership now — with the outcome
 * stored on the domain record's `provider` field. Never throws.
 */
export async function syncAtProvider(host: string, op: "add" | "status" | "verify"): Promise<ProviderSync> {
  const platform = await getPlatformDb();
  const domains = platform.collection<CompanyDomain>(COMPANY_DOMAINS_COLLECTION);
  // A *.localhost address needs nothing attached anywhere.
  if (host.endsWith(".localhost")) return { providerId: "none", status: null, error: null };
  const provider = activeDomainProvider();
  let error: string | null = null;
  let status: DomainStatus | null = null;
  try {
    const res = await provider[op](host);
    if (res.ok) status = res.value;
    else error = res.error;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }
  const state = status ?? { attached: false, verified: false, dnsConfigured: false, records: [] };
  // Once the provider has demanded its own ownership proof (a TXT challenge),
  // that stays on record: it's what lets custom.ts trust a later "verified".
  const previous = await domains.findOne({ _id: host }, { projection: { provider: 1 } });
  const challenged = Boolean(previous?.provider?.challenged) || (!state.verified && state.records.some((r) => r.type === "TXT"));
  await domains.updateOne({ _id: host }, { $set: { provider: { id: provider.id, ...state, error, checkedAt: new Date(), challenged } } });
  if (error) console.error(`[domains] ${op} ${host} at ${provider.id} failed`, error);
  return { providerId: provider.id, status, error };
}
