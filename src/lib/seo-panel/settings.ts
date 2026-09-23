import "server-only";
import { siteUrl } from "@/lib/seo";
import { COLLECTIONS, seoCollection } from "@/lib/seo-panel/db";

/**
 * SEO panel settings: one `seo_settings` document (`_id: "global"`). Secrets
 * are NEVER stored here — Google credentials and API keys come from env vars
 * (see `integrationEnv`), the document only holds non-secret configuration
 * such as the Search Console property and GA4 property id.
 */

export type Device = "desktop" | "mobile";
export type AuditFrequency = "off" | "daily" | "weekly";

export interface SeoSettings {
  _id: "global";
  /** Origin the crawler fetches. Production by default; point at a staging/local server to audit before deploy. */
  siteOrigin: string;
  crawl: {
    maxPages: number;
    concurrency: number;
    timeoutMs: number;
    checkExternalLinks: boolean;
    maxExternalChecks: number;
    /** Path prefixes the crawler skips. */
    excludePrefixes: string[];
  };
  thresholds: {
    titleMin: number;
    titleMax: number;
    descriptionMin: number;
    descriptionMax: number;
    thinContentWords: number;
    slowResponseMs: number;
    staleContentDays: number;
    minInternalLinksIn: number;
  };
  schedule: {
    auditFrequency: AuditFrequency;
    syncSearchData: boolean;
    verifyBacklinks: boolean;
  };
  defaults: { country: string; language: string; device: Device; engine: string };
  integrations: {
    gsc: { enabled: boolean; property: string; lastSyncAt: Date | null; lastError: string | null };
    ga4: { enabled: boolean; propertyId: string; lastSyncAt: Date | null; lastError: string | null };
    psi: { enabled: boolean; strategy: Device };
  };
  updatedAt: Date | null;
  updatedBy: string | null;
}

export const DEFAULT_SETTINGS: SeoSettings = {
  _id: "global",
  siteOrigin: siteUrl,
  crawl: {
    maxPages: 300,
    concurrency: 5,
    timeoutMs: 15000,
    checkExternalLinks: true,
    maxExternalChecks: 150,
    excludePrefixes: ["/api", "/lms", "/tms", "/hrms", "/pms", "/prms", "/fms", "/sop", "/seo", "/admin", "/workspace", "/messenger", "/portal", "/verify", "/pay"],
  },
  thresholds: {
    titleMin: 30,
    titleMax: 60,
    descriptionMin: 70,
    descriptionMax: 160,
    thinContentWords: 300,
    slowResponseMs: 1500,
    staleContentDays: 365,
    minInternalLinksIn: 3,
  },
  schedule: { auditFrequency: "weekly", syncSearchData: true, verifyBacklinks: true },
  defaults: { country: "IN", language: "en", device: "desktop", engine: "google" },
  integrations: {
    gsc: { enabled: false, property: "sc-domain:yashorbit.com", lastSyncAt: null, lastError: null },
    ga4: { enabled: false, propertyId: "", lastSyncAt: null, lastError: null },
    psi: { enabled: true, strategy: "mobile" },
  },
  updatedAt: null,
  updatedBy: null,
};

/** Deep-merges a stored document over the defaults so new settings keys never read as undefined. */
function withDefaults(doc: Partial<SeoSettings> | null): SeoSettings {
  const d = DEFAULT_SETTINGS;
  if (!doc) return structuredClone(d);
  return {
    ...d,
    ...doc,
    _id: "global",
    crawl: { ...d.crawl, ...(doc.crawl ?? {}) },
    thresholds: { ...d.thresholds, ...(doc.thresholds ?? {}) },
    schedule: { ...d.schedule, ...(doc.schedule ?? {}) },
    defaults: { ...d.defaults, ...(doc.defaults ?? {}) },
    integrations: {
      gsc: { ...d.integrations.gsc, ...(doc.integrations?.gsc ?? {}) },
      ga4: { ...d.integrations.ga4, ...(doc.integrations?.ga4 ?? {}) },
      psi: { ...d.integrations.psi, ...(doc.integrations?.psi ?? {}) },
    },
  };
}

export async function getSettings(): Promise<SeoSettings> {
  const col = await seoCollection<SeoSettings>(COLLECTIONS.settings);
  return withDefaults(await col.findOne({ _id: "global" }));
}

export async function saveSettings(next: SeoSettings, actorId: string): Promise<void> {
  const col = await seoCollection<SeoSettings>(COLLECTIONS.settings);
  const { _id: _ignored, ...rest } = next;
  void _ignored;
  await col.updateOne({ _id: "global" }, { $set: { ...rest, updatedAt: new Date(), updatedBy: actorId } }, { upsert: true });
}

/** Records an integration's sync outcome without touching anything else. */
export async function markIntegrationSync(key: "gsc" | "ga4", error: string | null): Promise<void> {
  const col = await seoCollection<SeoSettings>(COLLECTIONS.settings);
  const set: Record<string, unknown> = { [`integrations.${key}.lastError`]: error };
  if (!error) set[`integrations.${key}.lastSyncAt`] = new Date();
  await col.updateOne({ _id: "global" }, { $set: set }, { upsert: true });
}

/** Which credentials are present in the environment (never their values). */
export function integrationEnv() {
  const clientEmail = process.env.GOOGLE_SEO_CLIENT_EMAIL || process.env.GOOGLE_INDEXING_CLIENT_EMAIL || "";
  const privateKey = process.env.GOOGLE_SEO_PRIVATE_KEY || process.env.GOOGLE_INDEXING_PRIVATE_KEY || "";
  return {
    google: clientEmail && privateKey ? { clientEmail, privateKey } : null,
    googleClientEmail: clientEmail || null,
    pagespeedKey: process.env.PAGESPEED_API_KEY || null,
  };
}

/** Normalizes a user-entered origin to `scheme://host[:port]`, or null when invalid. */
export function cleanOrigin(v: string): string | null {
  try {
    const u = new URL(v.trim());
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.origin;
  } catch {
    return null;
  }
}
