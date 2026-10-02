/**
 * Adds the Products item to the platform owner's STORED header navigation and footer.
 *
 * The site's header and footer are CMS content, so a navigation that already
 * exists in the database does not change when the catalogue does. This adds:
 *   - a top-level "Products" menu (right after Services) with one entry per product,
 *     grouped by category, each with its icon and one-line value;
 *   - a "Products" link at the top of the footer's Services column.
 *
 *   npm run db:add-products-nav            # dry run — prints the plan, writes nothing
 *   npm run db:add-products-nav -- --apply # writes to the database in MONGODB_URI (read from .env)
 *   ... -- --company <slug>                # a company other than the platform owner — refused: Products is the owner's own content
 *
 * (Without npm, pass the env file yourself: npx --yes tsx --require ./scripts/lib/next-server-shims.cjs --env-file=.env scripts/add-products-nav.ts)
 *
 * Safe to re-run: items are matched by their link (/products, /products/<slug>), anything already there
 * is left as it is (nothing is reordered or removed), only missing entries are added, and no other navigation
 * entry is touched. The one upgrade: the Products menu's featured card (title, description, image) is switched to
 * the business-automation card, each text only while it is empty or still the exact round-1 seed text. Run `npm run db:migrate-cms-content -- --apply` first if the
 * product records themselves are not in the CMS yet; the menu does not depend on them.
 */

import { createFooterLink, listFooterColumns, listFooterLinks, updateFooterLink } from "@/lib/cms/footer";
import { createNavItem, listNavItems, updateNavItem } from "@/lib/cms/nav";
import { recordAudit } from "@/lib/cms/audit";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { COMPANIES_COLLECTION, type Company } from "@/lib/platform/tenancy/companies";
import { PRODUCTS_FOOTER_LINK, seedProductsNav } from "@/lib/products/seed";
import { PRODUCTS_NAV_FEATURED_PREVIOUS, PRODUCTS_PATH } from "@/lib/products/shared";

const APPLY = process.argv.includes("--apply");
const ACTOR = "system:products-nav";

export interface NavResult { created: string[]; updated: string[]; skipped: string[] }

/** The whole job, against whichever company is current. Exported so the unit test can run it on a scratch database. */
export async function addProductsNav(apply: boolean): Promise<NavResult> {
  const result: NavResult = { created: [], updated: [], skipped: [] };
  const log = (kind: keyof NavResult, line: string) => {
    result[kind].push(line);
    console.log(`${kind.toUpperCase().padEnd(8)} ${line}${apply ? "" : " [dry run]"}`);
  };
  const plan = seedProductsNav();

  // ── header ──
  const items = await listNavItems();
  let top = items.find((i) => !i.parentId && i.href === PRODUCTS_PATH);
  if (top) {
    log("skipped", `header menu "${top.label}" — already there`);
    // Round 2 upgrade: the menu's featured card became the business-automation card. Each of its three texts is replaced only
    // while it is empty or still exactly what round 1 seeded; an editor's own wording is never touched.
    const patch: { featuredTitle?: string; featuredDescription?: string; featuredImage?: string } = {};
    const upgrade = <K extends keyof typeof patch>(key: K, current: string | null, previous: string, next: string) => {
      if ((current ?? "") === "" || current === previous) {
        if (current !== next) patch[key] = next;
      }
    };
    upgrade("featuredTitle", top.featuredTitle, PRODUCTS_NAV_FEATURED_PREVIOUS.title, plan.featured.title);
    upgrade("featuredDescription", top.featuredDescription, PRODUCTS_NAV_FEATURED_PREVIOUS.description, plan.featured.description);
    upgrade("featuredImage", top.featuredImage, PRODUCTS_NAV_FEATURED_PREVIOUS.image, plan.featured.image);
    if (Object.keys(patch).length) {
      log("updated", `header menu featured card (${Object.keys(patch).join(", ")}) — still the round-1 text, now the business-automation card`);
      if (apply) await updateNavItem(top._id, patch, ACTOR);
    }
  } else {
    log("created", `header menu "${plan.name}" (${plan.items.length} products)`);
    if (apply) {
      top = await createNavItem({ parentId: null, label: plan.name, href: plan.href, iconKey: plan.iconKey, featuredTitle: plan.featured.title, featuredDescription: plan.featured.description, featuredImage: plan.featured.image }, ACTOR);
      // Place it right after Services (a fractional key between Services and the next menu), else at the end.
      const tops = items.filter((i) => !i.parentId).sort((a, b) => a.orderKey - b.orderKey);
      const services = tops.find((t) => t.href === "/services");
      if (services) {
        const next = tops.find((t) => t.orderKey > services.orderKey);
        await updateNavItem(top._id, { orderKey: next ? (services.orderKey + next.orderKey) / 2 : services.orderKey + 1024 }, ACTOR);
      }
    }
  }
  const have = new Set(items.filter((i) => top && i.parentId === top._id).map((i) => i.href));
  const present = plan.items.filter((it) => have.has(it.href)).length;
  if (present) log("skipped", `${present} header item${present === 1 ? "" : "s"} already there`);
  for (const it of plan.items) {
    if (have.has(it.href)) continue;
    log("created", `header item ${it.href} (${it.group})`);
    if (apply && top) await createNavItem({ parentId: top._id, label: it.name, href: it.href, description: it.description, iconKey: it.iconKey, group: it.group }, ACTOR);
  }

  // ── footer ──
  const [columns, links] = await Promise.all([listFooterColumns(), listFooterLinks()]);
  if (links.some((l) => l.href === PRODUCTS_PATH)) log("skipped", "footer link /products — already there");
  else {
    const col = columns.find((c) => c.viewAllHref === "/services") ?? columns.find((c) => c.title.toLowerCase() === "services");
    if (!col) log("skipped", "footer link /products — no Services column to put it in");
    else {
      log("created", `footer link /products (in "${col.title}")`);
      if (apply) {
        const created = await createFooterLink({ columnId: col._id, label: PRODUCTS_FOOTER_LINK.label, href: PRODUCTS_FOOTER_LINK.href, emphasized: true }, ACTOR);
        // First link of the column.
        const first = links.filter((l) => l.columnId === col._id).sort((a, b) => a.orderKey - b.orderKey)[0];
        if (first) await updateFooterLink(created._id, { orderKey: first.orderKey / 2 }, ACTOR);
      }
    }
  }
  if (apply && (result.created.length || result.updated.length)) await recordAudit({ actorId: ACTOR, action: "create", entity: "nav", entityId: "products", entityLabel: "Products navigation", summary: "Added/updated the Products menu and footer link" });
  return result;
}

async function targetCompany(): Promise<Company> {
  const i = process.argv.indexOf("--company");
  const slug = i >= 0 ? process.argv[i + 1] : undefined;
  const company = await (await getPlatformDb()).collection<Company>(COMPANIES_COLLECTION).findOne(slug ? { slug } : { isPlatformOwner: true });
  if (!company) throw new Error(slug ? `No company with slug "${slug}"` : "No platform-owner company — run `npm run db:migrate-tenancy -- --apply` first");
  if (!company.isPlatformOwner) throw new Error(`"${company.name}" is not the platform owner. Products is the owner's own content and is never added to another company's navigation.`);
  return company;
}

if (process.argv[1]?.endsWith("add-products-nav.ts")) {
  targetCompany()
    .then((company) => {
      console.log(`${APPLY ? "APPLYING" : "DRY RUN (pass --apply to write)"} — company ${company.name} (${company._id})\n`);
      return runAsCompany(company._id, () => addProductsNav(APPLY));
    })
    .then((r) => {
      console.log(`\n${r.created.length} ${APPLY ? "created" : "to create"}, ${r.updated.length} ${APPLY ? "updated" : "to update"}, ${r.skipped.length} already there`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    });
}
