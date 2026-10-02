/**
 * Reverts the Services-menu change made by the (removed) `db:update-services-nav` script, in the platform owner's STORED
 * header navigation, back to how the menu originally was:
 *
 *   - the Services featured card links to the Services page again (the optional featured link is cleared);
 *   - the featured card's text is "Digital Transformation & SaaS Platform" / "End-to-end tech solutions and SaaS products."
 *     again, but only while it still reads exactly what that script set (an editor's own wording is kept);
 *   - the Services list item that was pointed at /products links to /services/our-saas-product again (its label is kept);
 *   - the "All Services" list item that script added is removed (only that item: it must carry the script's own marker).
 *
 *   npm run db:revert-services-nav            # dry run — prints the plan, writes nothing
 *   npm run db:revert-services-nav -- --apply # writes to the database in MONGODB_URI (read from .env)
 *
 * Safe to re-run; changes nothing that was not made by that script. The header is cached for up to an hour: the revert shows
 * after that, after a redeploy, or after any publish in the CMS.
 */

import { deleteNavItem, listNavItems, updateNavItem } from "@/lib/cms/nav";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { COMPANIES_COLLECTION, type Company } from "@/lib/platform/tenancy/companies";

const APPLY = process.argv.includes("--apply");
const ACTOR = "system:services-nav-revert";
const SERVICES = "/services";
const SAAS = "/services/our-saas-product";
const PRODUCTS = "/products";
const ORIGINAL = { title: "Digital Transformation & SaaS Platform", description: "End-to-end tech solutions and SaaS products." };
const SET_BY_SCRIPT = { title: "Our AI-Powered Business Automation SaaS", description: "One workspace for HR, projects, finance, CRM and AI, with workflow automation that connects them." };
const SCRIPT_MARKER = "system:services-nav";

export interface RevertResult { updated: string[]; removed: string[]; skipped: string[] }

/** The whole job, against whichever company is current. */
export async function revertServicesNav(apply: boolean): Promise<RevertResult> {
  const result: RevertResult = { updated: [], removed: [], skipped: [] };
  const log = (kind: keyof RevertResult, line: string) => {
    result[kind].push(line);
    console.log(`${kind.toUpperCase().padEnd(8)} ${line}${apply ? "" : " [dry run]"}`);
  };

  const items = await listNavItems();
  const top = items.find((i) => !i.parentId && i.href === SERVICES);
  if (!top) {
    log("skipped", `no "${SERVICES}" menu in the header navigation — nothing to do`);
    return result;
  }
  const children = items.filter((i) => i.parentId === top._id);

  // featured link
  if (top.featuredHref === SAAS) {
    log("updated", `"${top.label}" featured card links to ${SERVICES} again (featured link cleared)`);
    if (apply) await updateNavItem(top._id, { featuredHref: null }, ACTOR);
  } else log("skipped", `"${top.label}" featured link is ${top.featuredHref ? `"${top.featuredHref}" (not set by the script)` : "not set"} — left as it is`);

  // featured text
  const text: { featuredTitle?: string; featuredDescription?: string } = {};
  if (top.featuredTitle === SET_BY_SCRIPT.title) text.featuredTitle = ORIGINAL.title;
  if (top.featuredDescription === SET_BY_SCRIPT.description) text.featuredDescription = ORIGINAL.description;
  if (Object.keys(text).length) {
    log("updated", `"${top.label}" featured card text is "${ORIGINAL.title}" again (${Object.keys(text).join(", ")})`);
    if (apply) await updateNavItem(top._id, text, ACTOR);
  } else log("skipped", `"${top.label}" featured card text is not the script's text — left as it is`);

  // the SaaS item
  const saas = children.find((c) => c.href === PRODUCTS && /^Our SaaS Products?$/i.test(c.label));
  if (saas) {
    log("updated", `"${saas.label}" links to ${SAAS} again (was ${PRODUCTS})`);
    if (apply) await updateNavItem(saas._id, { href: SAAS }, ACTOR);
  } else log("skipped", `no "Our SaaS Product(s)" item pointing at ${PRODUCTS} in the Services list — left as it is`);

  // the item the script added
  const added = children.find((c) => c.href === SERVICES && c.label === "All Services" && c.createdBy === SCRIPT_MARKER);
  if (added) {
    log("removed", `Services list item "All Services" (added by the earlier script)`);
    if (apply) await deleteNavItem(added._id);
  } else log("skipped", `no "All Services" item added by the earlier script — left as it is`);
  return result;
}

async function targetCompany(): Promise<Company> {
  const i = process.argv.indexOf("--company");
  const slug = i >= 0 ? process.argv[i + 1] : undefined;
  const company = await (await getPlatformDb()).collection<Company>(COMPANIES_COLLECTION).findOne(slug ? { slug } : { isPlatformOwner: true });
  if (!company) throw new Error(slug ? `No company with slug "${slug}"` : "No platform-owner company — run `npm run db:migrate-tenancy -- --apply` first");
  if (!company.isPlatformOwner) throw new Error(`"${company.name}" is not the platform owner. This reverts YashOrbit's own Services menu only.`);
  return company;
}

if (process.argv[1]?.endsWith("revert-services-nav.ts")) {
  targetCompany()
    .then((company) => {
      console.log(`${APPLY ? "APPLYING" : "DRY RUN (pass --apply to write)"} — company ${company.name} (${company._id})\n`);
      return runAsCompany(company._id, () => revertServicesNav(APPLY));
    })
    .then((r) => {
      console.log(`\n${r.updated.length} ${APPLY ? "updated" : "to update"}, ${r.removed.length} ${APPLY ? "removed" : "to remove"}, ${r.skipped.length} skipped`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    });
}
