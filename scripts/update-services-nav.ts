/**
 * Updates the platform owner's STORED header navigation (Services menu) in three small ways:
 *
 *   1. the "Our SaaS Product" item in the Services list now links to /products (the Products page);
 *   2. the Services menu's featured card links to /services/our-saas-product (the old SaaS product page, which was that item's link);
 *   3. what the featured card used to link to — the Services overview, /services — is added to the Services list as "All Services".
 *
 *   npm run db:update-services-nav            # dry run — prints the plan, writes nothing
 *   npm run db:update-services-nav -- --apply # writes to the database in MONGODB_URI (read from .env)
 *
 * Safe to re-run, and it never overwrites an editor's choice: the featured link is set only while it is empty, the item link is
 * changed only while it still points at /services/our-saas-product, "All Services" is added only if no item links to /services.
 * Nothing else in the navigation is touched. The header is cached for up to an hour: the change shows after that, after a
 * redeploy, or after any publish in the CMS.
 */

import { createNavItem, listNavItems, updateNavItem } from "@/lib/cms/nav";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { COMPANIES_COLLECTION, type Company } from "@/lib/platform/tenancy/companies";

const APPLY = process.argv.includes("--apply");
const ACTOR = "system:services-nav";
const SERVICES = "/services";
const SAAS_OLD = "/services/our-saas-product";
const PRODUCTS = "/products";

export interface ServicesNavResult { updated: string[]; created: string[]; skipped: string[] }

/** The whole job, against whichever company is current. Exported so it can be run on a scratch database. */
export async function updateServicesNav(apply: boolean): Promise<ServicesNavResult> {
  const result: ServicesNavResult = { updated: [], created: [], skipped: [] };
  const log = (kind: keyof ServicesNavResult, line: string) => {
    result[kind].push(line);
    console.log(`${kind.toUpperCase().padEnd(8)} ${line}${apply ? "" : " [dry run]"}`);
  };

  const items = await listNavItems();
  const top = items.find((i) => !i.parentId && i.href === SERVICES);
  if (!top) {
    log("skipped", `no "${SERVICES}" menu in the header navigation — nothing to do`);
    return result;
  }
  const children = items.filter((i) => i.parentId === top._id).sort((a, b) => a.orderKey - b.orderKey);

  // 2. featured card link
  if (!top.featuredHref) {
    log("updated", `"${top.label}" featured card now links to ${SAAS_OLD}`);
    if (apply) await updateNavItem(top._id, { featuredHref: SAAS_OLD }, ACTOR);
  } else log("skipped", `"${top.label}" featured card already links to ${top.featuredHref}`);

  // 1. the SaaS item → Products
  const saas = children.find((c) => c.href === SAAS_OLD);
  if (saas) {
    log("updated", `"${saas.label}" now links to ${PRODUCTS} (was ${SAAS_OLD})`);
    if (apply) await updateNavItem(saas._id, { href: PRODUCTS }, ACTOR);
  } else log("skipped", `no "${SAAS_OLD}" item in the Services list (already changed, or edited)`);

  // 3. the old featured destination → the list
  if (children.some((c) => c.href === SERVICES)) log("skipped", `the Services list already has an item linking to ${SERVICES}`);
  else {
    log("created", `Services list item "All Services" → ${SERVICES}, first in the list`);
    if (apply) {
      const first = children[0]?.orderKey ?? 1024;
      const created = await createNavItem(
        { parentId: top._id, label: "All Services", href: SERVICES, description: top.featuredDescription || "End-to-end tech solutions and SaaS products", iconKey: top.iconKey || "Layers" },
        ACTOR
      );
      await updateNavItem(created._id, { orderKey: first - 1024 }, ACTOR);
    }
  }
  return result;
}

async function targetCompany(): Promise<Company> {
  const i = process.argv.indexOf("--company");
  const slug = i >= 0 ? process.argv[i + 1] : undefined;
  const company = await (await getPlatformDb()).collection<Company>(COMPANIES_COLLECTION).findOne(slug ? { slug } : { isPlatformOwner: true });
  if (!company) throw new Error(slug ? `No company with slug "${slug}"` : "No platform-owner company — run `npm run db:migrate-tenancy -- --apply` first");
  if (!company.isPlatformOwner) throw new Error(`"${company.name}" is not the platform owner. This changes YashOrbit's own Services menu only.`);
  return company;
}

if (process.argv[1]?.endsWith("update-services-nav.ts")) {
  targetCompany()
    .then((company) => {
      console.log(`${APPLY ? "APPLYING" : "DRY RUN (pass --apply to write)"} — company ${company.name} (${company._id})\n`);
      return runAsCompany(company._id, () => updateServicesNav(APPLY));
    })
    .then((r) => {
      console.log(`\n${r.updated.length} ${APPLY ? "updated" : "to update"}, ${r.created.length} ${APPLY ? "created" : "to create"}, ${r.skipped.length} skipped`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    });
}
