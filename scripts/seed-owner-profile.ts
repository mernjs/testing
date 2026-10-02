/**
 * Fills the PLATFORM OWNER's company profile (HRMS company details, TMS institute, PRMS company, OTS organisation,
 * branding wordmark + logo) from cms-seed/owner-profile.json — only the fields that are still empty, so anything the
 * owner has already saved is never touched. The app itself holds no company data; this is how the owner's own details
 * get (back) into the database.
 *
 *   npm run db:seed-owner-profile
 */
import fs from "node:fs";
import path from "node:path";
import profile from "../cms-seed/owner-profile.json";
import { clientPromise, getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { COMPANIES_COLLECTION } from "@/lib/platform/tenancy/companies";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS as CMS } from "@/lib/cms/db";
import { COLLECTIONS as OTS } from "@/lib/ots/db";
import { uploadCompanyLogo } from "@/lib/platform/branding/logo";

type Doc = Record<string, unknown>;

/** Sets each seed field only where the stored value is missing or blank. */
async function fillBlanks(collection: string, id: string, seed: Doc, nested?: string) {
  const col = (await getDb()).collection<Doc>(collection);
  const existing = (await col.findOne({ _id: id } as never)) as Doc | null;
  const current = (nested ? (existing?.[nested] as Doc | undefined) : existing) ?? {};
  const set: Doc = {};
  for (const [k, v] of Object.entries(seed)) {
    const cur = current[k];
    if (cur === undefined || cur === null || (typeof cur === "string" && !cur.trim())) set[nested ? `${nested}.${k}` : k] = v;
  }
  if (Object.keys(set).length) await col.updateOne({ _id: id } as never, { $set: set, $setOnInsert: { updatedAt: new Date(), updatedBy: null } }, { upsert: true });
  console.log(`  ${collection}${nested ? "." + nested : ""}: ${Object.keys(set).length ? "filled " + Object.keys(set).length + " field(s)" : "already set"}`);
}

const OTS_SETTINGS_COLLECTION = OTS.settings;

async function main() {
  const platformDb = await getPlatformDb();
  const owner = await platformDb.collection<{ _id: string; name: string; branding?: Doc }>(COMPANIES_COLLECTION).findOne({ isPlatformOwner: true } as never);
  if (!owner) throw new Error("No platform-owner company found.");
  console.log(`Platform owner: ${owner.name} (${owner._id})`);

  await runAsCompany(owner._id, async () => {
    await fillBlanks("hrms_company", "org", profile.company);
    await fillBlanks("training_settings", "config", profile.tmsInstitute, "institute");
    await fillBlanks("prms_settings", "config", { name: profile.prmsCompany.name, website: profile.prmsCompany.website }, "company");
    await fillBlanks(OTS_SETTINGS_COLLECTION, "global", { organizationName: profile.otsOrganizationName });

    // Analytics the owner's website has always run (now per-company settings: CMS → Settings → Tracking).
    // Only when the owner has no tracking configured yet — never re-adds anything it removed.
    const settingsCol = (await getDb()).collection<Doc>(CMS.settings);
    const current = ((await settingsCol.findOne({ _id: "default" } as never)) as Doc | null)?.tracking as Doc | undefined;
    if (!current || Object.keys(current).length === 0) {
      const t = profile.tracking;
      const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
      await settingsCol.updateOne(
        { _id: "default" } as never,
        { $set: { tracking: { ga4Ids: [t.ga4Id], gtmIds: [t.gtmId], clarityIds: [t.clarityId], tawkId: t.tawkId, googleSiteVerification: googleVerification ? [googleVerification] : [] } } },
        { upsert: true }
      );
      console.log("  tracking: seeded");
    } else console.log("  tracking: already set");

    // Branding: wordmark + logo, only if the owner hasn't set them.
    const branding: Doc = { ...(owner.branding ?? {}) };
    if (!String(branding.namePrimary ?? "").trim() && !String(branding.nameAccent ?? "").trim()) {
      branding.namePrimary = profile.branding.namePrimary;
      branding.nameAccent = profile.branding.nameAccent;
    }
    if (!branding.logoUrl) {
      const file = path.join(process.cwd(), profile.branding.logoFile);
      if (fs.existsSync(file)) {
        const res = await uploadCompanyLogo(new File([fs.readFileSync(file)], "logo.png", { type: "image/png" }));
        if (res.ok) branding.logoUrl = res.url;
        else console.warn("  logo upload skipped:", res.error);
      }
    }
    await platformDb.collection(COMPANIES_COLLECTION).updateOne({ _id: owner._id } as never, { $set: { branding, updatedAt: new Date() } });
    console.log("  branding: ok");
  });
  console.log("✓ Owner profile seeded (existing values were left alone).");
}

main()
  .then(async () => (await clientPromise).close())
  .catch(async (err) => {
    console.error(err);
    await (await clientPromise).close().catch(() => {});
    process.exit(1);
  });
