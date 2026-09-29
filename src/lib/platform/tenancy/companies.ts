import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { RESERVED_SLUGS } from "@/lib/platform/tenancy/slug";

/**
 * The company (tenant) registry and host → company routing. Both
 * collections are platform-level (see GLOBAL_COLLECTIONS) and are only ever
 * read through `getPlatformDb()`.
 *
 * A request is routed to a company by its Host header:
 *  1. a platform host (localhost, the Vercel deployment/preview URLs, and
 *     anything in PLATFORM_HOSTS) → the platform-owner company
 *  2. a verified custom domain in `company_domains` (with or without `www.`)
 *  3. `<slug>.<root>` for any root in PLATFORM_ROOT_DOMAINS (plus
 *     `<slug>.localhost` in development) → the company with that slug
 * Anything else resolves to no company at all — never a fallback.
 */

export const COMPANIES_COLLECTION = "companies";
export const COMPANY_DOMAINS_COLLECTION = "company_domains";

export type CompanyStatus = "active" | "suspended";

export interface Company {
  _id: string;
  /** Lowercase, URL-safe; also the platform subdomain `<slug>.<root>`. */
  slug: string;
  name: string;
  status: CompanyStatus;
  /** The company that owns and runs the platform itself (YashOrbit). Exactly one. */
  isPlatformOwner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyDomain {
  /** The hostname itself, lowercase, no port. */
  _id: string;
  companyId: string;
  status: "pending" | "verified";
  /** Value the owner publishes in a `_yashorbit-verify.<domain>` TXT record. */
  verificationToken: string;
  isPrimary: boolean;
  /** `subdomain` = the automatic `<slug>.<root>` address; `custom` = the company's own domain. */
  kind?: "subdomain" | "custom";
  /** Last known state at the hosting provider (routing + TLS), from `activeDomainProvider()`. */
  provider?: { id: string; attached: boolean; verified: boolean; dnsConfigured: boolean; error: string | null; checkedAt: Date };
  createdAt: Date;
  verifiedAt: Date | null;
}

export { RESERVED_SLUGS } from "@/lib/platform/tenancy/slug";

function envList(...names: string[]): string[] {
  return names
    .flatMap((n) => (process.env[n] ?? "").split(","))
    .map((s) => normalizeHost(s))
    .filter((s): s is string => Boolean(s));
}

/** Lowercase, port and trailing dot removed; null for anything that isn't a plausible hostname. */
export function normalizeHost(host: string | null | undefined): string | null {
  if (!host) return null;
  const h = host.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].replace(/:\d+$/, "").replace(/\.$/, "");
  return /^[a-z0-9.-]+$/.test(h) && h.length <= 253 ? h : null;
}

function platformHosts(): Set<string> {
  return new Set(["localhost", "127.0.0.1", ...envList("PLATFORM_HOSTS", "VERCEL_URL", "VERCEL_BRANCH_URL", "VERCEL_PROJECT_PRODUCTION_URL")]);
}

function platformRootDomains(): string[] {
  return ["localhost", ...envList("PLATFORM_ROOT_DOMAIN")];
}

// Host → company id, per server instance. Positive answers are cached longer
// than negative ones so a freshly verified domain starts working quickly.
const HIT_TTL_MS = 60_000;
const MISS_TTL_MS = 5_000;
const hostCache = new Map<string, { id: string | null; at: number }>();
let ownerCache: { id: string; at: number } | null = null;

export async function getPlatformOwnerCompanyId(): Promise<string | null> {
  if (ownerCache && Date.now() - ownerCache.at < HIT_TTL_MS) return ownerCache.id;
  const db = await getPlatformDb();
  const owner = await db.collection<Company>(COMPANIES_COLLECTION).findOne({ isPlatformOwner: true, status: "active" }, { projection: { _id: 1 } });
  ownerCache = owner ? { id: owner._id, at: Date.now() } : null;
  return owner?._id ?? null;
}

async function lookupHost(host: string): Promise<string | null> {
  const bare = host.startsWith("www.") ? host.slice(4) : host;
  if (platformHosts().has(host) || platformHosts().has(bare)) return getPlatformOwnerCompanyId();

  const db = await getPlatformDb();
  const companies = db.collection<Company>(COMPANIES_COLLECTION);

  const domain = await db
    .collection<CompanyDomain>(COMPANY_DOMAINS_COLLECTION)
    .findOne({ _id: { $in: [host, bare] }, status: "verified" }, { projection: { companyId: 1 } });
  if (domain) {
    const company = await companies.findOne({ _id: domain.companyId, status: "active" }, { projection: { _id: 1 } });
    return company?._id ?? null;
  }

  for (const root of platformRootDomains()) {
    if (!host.endsWith(`.${root}`)) continue;
    const slug = host.slice(0, -(root.length + 1));
    if (!slug || slug.includes(".") || RESERVED_SLUGS.has(slug)) continue;
    const company = await companies.findOne({ slug, status: "active" }, { projection: { _id: 1 } });
    if (company) return company._id;
  }
  return null;
}

export async function resolveCompanyIdByHost(rawHost: string | null | undefined): Promise<string | null> {
  const host = normalizeHost(rawHost);
  if (!host) return null;
  const hit = hostCache.get(host);
  if (hit && Date.now() - hit.at < (hit.id ? HIT_TTL_MS : MISS_TTL_MS)) return hit.id;
  const id = await lookupHost(host);
  hostCache.set(host, { id, at: Date.now() });
  return id;
}

/** Drops cached routing so a domain/status change applies on this instance immediately. */
export function forgetCompanyRouting(): void {
  hostCache.clear();
  ownerCache = null;
}

export async function getCompany(companyId: string): Promise<Company | null> {
  const db = await getPlatformDb();
  return db.collection<Company>(COMPANIES_COLLECTION).findOne({ _id: companyId });
}

export async function listActiveCompanyIds(): Promise<string[]> {
  const db = await getPlatformDb();
  const rows = await db.collection<Company>(COMPANIES_COLLECTION).find({ status: "active" }, { projection: { _id: 1 } }).toArray();
  return rows.map((r) => r._id);
}
