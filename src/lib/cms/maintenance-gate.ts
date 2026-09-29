import { getDb } from "@/lib/mongodb";

// = COLLECTIONS.settings in db.ts, which isn't imported here because it pulls
// `next/cache` into the proxy bundle.
const SETTINGS_COLLECTION = "cms_settings";

/**
 * Maintenance-mode enforcement for the public marketing site, run from
 * `src/proxy.ts` on each page request. Public pages are statically generated
 * (ISR), so this can't live in `(site)/layout.tsx` — a layout can't read the
 * visitor's cookies without making every page dynamic.
 *
 * Deliberately an allow-list of the `(site)` route group's top-level
 * segments, not a deny-list of panels: a page missing from this list simply
 * stays up during maintenance (fail-open), whereas a missing panel in a
 * deny-list would lock staff out of it. `login`/`register` are left out on
 * purpose so portal users can still sign in.
 */
const SITE_SEGMENTS = new Set([
  "",
  "about",
  "ai-automations",
  "ask",
  "blog",
  "careers",
  "contact",
  "digital-marketing",
  "industrial-training",
  "industries",
  "internship-program",
  "live-demos",
  "offers",
  "resource-augmentation",
  "rewards",
  "services",
  "software-development",
]);

export function isPublicSitePath(pathname: string): boolean {
  return SITE_SEGMENTS.has(pathname.split("/")[1] ?? "");
}

// Read at most once per TTL per server instance: the proxy runs on every page
// view and this must not become a database round-trip each time. Toggling the
// setting therefore takes up to TTL_MS to reach every instance.
const TTL_MS = 10_000;
let cached: { enabled: boolean; at: number } | null = null;

export async function isMaintenanceOn(): Promise<boolean> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.enabled;
  try {
    const db = await getDb();
    const doc = await db
      .collection<{ _id: string; maintenanceMode?: { enabled?: boolean } }>(SETTINGS_COLLECTION)
      .findOne({ _id: "default" }, { projection: { maintenanceMode: 1 } });
    cached = { enabled: doc?.maintenanceMode?.enabled === true, at: Date.now() };
  } catch (err) {
    // Fail open: a settings read failure must never take the site down.
    console.error("[cms] maintenance flag unavailable, treating as off", err);
    cached = { enabled: false, at: Date.now() };
  }
  return cached.enabled;
}
