/**
 * Content migration: loads ALL of the website's content into the CMS as
 * PUBLISHED. The website has no content of its own — it renders only what the
 * CMS holds — so this must run once per database before the site is served.
 *
 *   npm run db:migrate-cms-content            # dry run — prints the plan, writes nothing
 *   npm run db:migrate-cms-content -- --apply # writes to the database in MONGODB_URI
 *
 * Source: the `cms-seed/` dataset (the site's content as it was when it moved
 * into the CMS). Nothing under `src/` holds content any more.
 *
 * Per item, never destroying anyone's work (safe to re-run):
 *  - Pages: created + published (v1.0) with their sections, SEO, structured
 *    data and frame. An existing page:
 *      · published, but missing SEO/structured data → only those are filled in;
 *      · never published → today's content is published as the live
 *        version; a draft in progress is kept as a pending change (an empty
 *        placeholder draft is dropped);
 *      · created by an earlier run of this script and not edited since →
 *        refreshed to the current seed;
 *      · otherwise left alone.
 *  - Collection records (blog, jobs, engagement models, products): created +
 *    published in order; existing records keep their content (missing order
 *    is filled in).
 *  - Navigation, footer, contact-form fields: created when the CMS has none.
 *  - Site identity & contact: created, or missing fields filled in.
 * Uses the CMS's own create/publish functions, so versions, history and the
 * audit log look exactly like a publish from the admin.
 */

import fs from "node:fs";
import path from "node:path";
import { createPage, getPageByPath, publishPage, saveDraft, saveDraftSeo, type CmsPageDoc } from "@/lib/cms/pages";
import { COLLECTIONS as SITE_COLLECTIONS } from "@/lib/cms/collections/registry";
import { getEditableRecord, publishRecord, saveRecordDraft } from "@/lib/cms/collections/store";
import type { CollectionKey } from "@/lib/cms/collections/types";
import { listNavItems, createNavItem } from "@/lib/cms/nav";
import { listFooterColumns, createFooterColumn, createFooterLink } from "@/lib/cms/footer";
import { saveSiteInfo } from "@/lib/cms/site-info";
import { parseSiteInfo } from "@/lib/cms/site-info-shared";
import { saveFormFields } from "@/lib/cms/forms";
import { recordAudit } from "@/lib/cms/audit";
import { parsePageFrame, parsePageJsonLd, parsePageSeo } from "@/lib/cms/page-seo";
import type { PageSection } from "@/lib/cms/section-registry";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/cms/db";

const APPLY = process.argv.includes("--apply");
const ACTOR = "system:content-migration";
const SUMMARY = "Migrated from the website's existing content";
const SEED = path.resolve("cms-seed");
const seedJson = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(SEED, file), "utf8"));
const seed = seedJson;

interface SeedPage { path: string; title: string; sections: PageSection[]; seo?: unknown; jsonLd?: unknown; frame?: unknown }
interface SeedNavTop { name: string; href: string; iconKey: string; featured: { title: string; description: string; image: string }; items: { name: string; href: string; description: string; iconKey: string }[] }
interface SeedFooterColumn { title: string; viewAllHref?: string; viewAllLabel?: string; links: { label: string; href: string; emphasized?: boolean }[] }

const report: Record<"created" | "updated" | "skipped" | "failed", string[]> = { created: [], updated: [], skipped: [], failed: [] };
const note = (kind: keyof typeof report, line: string) => {
  report[kind].push(line);
  console.log(`${kind.toUpperCase().padEnd(8)} ${line}${APPLY ? "" : " [dry run]"}`);
};

async function migratePages() {
  for (const p of seed<SeedPage[]>("pages.json")) {
    const seo = parsePageSeo(p.seo);
    const jsonLd = parsePageJsonLd(p.jsonLd);
    const frame = parsePageFrame(p.frame);
    const existing = await getPageByPath(p.path);

    if (!existing) {
      if (!APPLY) { note("created", `page ${p.path} (${p.sections.length} sections)`); continue; }
      const res = await createPage({ path: p.path, title: p.title, templateKey: "migrated", sections: p.sections, seo, jsonLd, frame }, ACTOR);
      if (!res.ok) { note("failed", `page ${p.path} — ${res.error}`); continue; }
      await publishAndAudit(res.id, p.path, "created", `(${p.sections.length} sections)`);
      continue;
    }

    if (!existing.live) {
      // Never published: publish today's content as live; a real draft in progress stays pending.
      if (!APPLY) { note("updated", `page ${p.path} — published today's content${existing.draft.sections.length ? "; the unpublished draft is kept" : ""}`); continue; }
      await publishSeedKeepingDraft(existing, p, seo, jsonLd, frame);
      continue;
    }

    const seedContent = { sections: p.sections, seo, jsonLd, frame };
    if (await lastPublishedByMigration(existing)) {
      // Live content is exactly what an earlier run wrote — bring it up to the current seed (a pending draft is kept).
      if (JSON.stringify(existing.live) !== JSON.stringify(seedContent)) {
        if (!APPLY) { note("updated", `page ${p.path} — refreshed from an earlier migration run`); continue; }
        await publishSeedKeepingDraft(existing, p, seo, jsonLd, frame, "refreshed from an earlier migration run");
        continue;
      }
    } else {
      // Published by a person: never change what they wrote — only fill in what's missing.
      const filled = fillPage(existing.live, seedContent);
      if (JSON.stringify(filled) !== JSON.stringify(existing.live)) {
        if (!APPLY) { note("updated", `page ${p.path} — missing fields / SEO filled in (edited content untouched)`); continue; }
        await applyFill(existing, seedContent);
        continue;
      }
    }
    note("skipped", `page ${p.path} — already in the CMS`);
  }
}

async function publishAndAudit(id: string, pagePath: string, kind: "created" | "updated", detail: string) {
  const pub = await publishPage(id, ACTOR, SUMMARY);
  if (!pub.ok) { note("failed", `page ${pagePath} — ${pub.error}`); return; }
  await recordAudit({ actorId: ACTOR, action: "publish", entity: "page", entityId: id, entityLabel: pagePath, path: pagePath, summary: SUMMARY });
  note(kind, `page ${pagePath} ${detail} → published v${pub.version}`);
}

async function pagesCollection() {
  const db = await getDb();
  return db.collection<CmsPageDoc>(COLLECTIONS.pages);
}

async function publishSeedKeepingDraft(existing: CmsPageDoc, p: SeedPage, seo: ReturnType<typeof parsePageSeo>, jsonLd: ReturnType<typeof parsePageJsonLd>, frame: ReturnType<typeof parsePageFrame>, reason = "published today's content") {
  const pages = await pagesCollection();
  const keptDraft = existing.draft;
  await saveDraft(existing._id, p.sections, ACTOR);
  await saveDraftSeo(existing._id, seo, jsonLd, frame, ACTOR);
  const pub = await publishPage(existing._id, ACTOR, SUMMARY);
  if (!pub.ok) { note("failed", `page ${p.path} — ${pub.error}`); return; }
  // An empty placeholder draft is dropped (keeping it would let a publish blank the page); a real one stays pending.
  const keep = keptDraft.sections.length > 0 && existing.hasUnpublishedChanges;
  if (keep) await pages.updateOne({ _id: existing._id }, { $set: { draft: { ...keptDraft, seo, jsonLd, frame }, hasUnpublishedChanges: true } });
  await recordAudit({ actorId: ACTOR, action: "publish", entity: "page", entityId: existing._id, entityLabel: p.path, path: p.path, summary: keep ? `${SUMMARY} (existing draft kept as a pending change)` : SUMMARY });
  note("updated", `page ${p.path} — ${reason} (v${pub.version})${keep ? "; the unpublished draft is kept" : ""}`);
}

/** Whether the page's current live version was published by this script (so its content is the migration's own). */
async function lastPublishedByMigration(page: CmsPageDoc): Promise<boolean> {
  const db = await getDb();
  const latest = await db.collection<{ pageId: string; version: string; publishedBy: string }>(COLLECTIONS.pageVersions).findOne({ pageId: page._id, version: page.version ?? "" });
  return latest ? latest.publishedBy === ACTOR : page.updatedBy === ACTOR;
}

type Content = { sections: PageSection[]; seo?: unknown; jsonLd?: unknown; frame?: unknown };

/** The page's content with anything missing filled from the seed: SEO/structured data/frame, and absent config fields of matching sections (same id + type). */
function fillPage(current: Content, seedContent: Content): Content {
  const sections = current.sections.map((s) => {
    const match = seedContent.sections.find((x) => x.id === s.id && x.type === s.type);
    return match ? { ...s, config: fillMissing(s.config, match.config) as PageSection["config"] } : s;
  });
  return {
    ...current,
    sections,
    seo: current.seo ?? seedContent.seo,
    jsonLd: current.jsonLd === undefined || (Array.isArray(current.jsonLd) && current.jsonLd.length === 0) ? seedContent.jsonLd : current.jsonLd,
    frame: current.frame ?? seedContent.frame,
  };
}

async function applyFill(existing: CmsPageDoc, seedContent: Content) {
  const pages = await pagesCollection();
  const live = fillPage(existing.live!, seedContent);
  const draft = fillPage(existing.draft, seedContent);
  await pages.updateOne({ _id: existing._id }, { $set: { live: live as CmsPageDoc["live"], draft: draft as CmsPageDoc["draft"] } });
  await recordAudit({ actorId: ACTOR, action: "update", entity: "page", entityId: existing._id, entityLabel: existing.path, path: existing.path, summary: "Missing fields / SEO migrated (edited content untouched)" });
  note("updated", `page ${existing.path} — missing fields / SEO filled in (edited content untouched)`);
}

async function migrateRecords() {
  const db = await getDb();
  const records = db.collection<{ collection: string; slug: string; orderKey?: number }>("cms_records");
  for (const key of Object.keys(SITE_COLLECTIONS) as CollectionKey[]) {
    const list = seed<{ slug: string }[]>(`collections/${key}.json`);
    for (const [i, rec] of list.entries()) {
      const label = `${key}/${rec.slug}`;
      const orderKey = (i + 1) * 1024;
      const current = await getEditableRecord(key, rec.slug);
      if (current) {
        if (current.doc.orderKey === undefined) {
          if (APPLY) await records.updateOne({ collection: key, slug: rec.slug }, { $set: { orderKey } });
          note("updated", `record ${label} — display order set`);
        } else note("skipped", `record ${label} — already in the CMS`);
        continue;
      }
      if (!APPLY) { note("created", `record ${label}`); continue; }
      const saved = await saveRecordDraft(key, rec.slug, rec, ACTOR, orderKey);
      if (!saved.ok) { note("failed", `record ${label} — ${saved.error}`); continue; }
      const pub = await publishRecord(key, rec.slug, ACTOR);
      if (!pub.ok) { note("failed", `record ${label} — ${pub.error}`); continue; }
      await recordAudit({ actorId: ACTOR, action: "publish", entity: "collection", entityId: label, entityLabel: label, summary: SUMMARY });
      note("created", `record ${label} → published`);
    }
  }
}

async function migrateNav() {
  const nav = seed<SeedNavTop[]>("navigation.json");
  if ((await listNavItems()).length > 0) { note("skipped", "navigation — the CMS already has navigation items"); return; }
  const count = nav.reduce((n, t) => n + 1 + t.items.length, 0);
  if (!APPLY) { note("created", `navigation (${nav.length} menus, ${count} items)`); return; }
  for (const top of nav) {
    const parent = await createNavItem(
      { parentId: null, label: top.name, href: top.href, iconKey: top.iconKey, featuredTitle: top.featured.title, featuredDescription: top.featured.description, featuredImage: top.featured.image },
      ACTOR
    );
    for (const item of top.items) await createNavItem({ parentId: parent._id, label: item.name, href: item.href, description: item.description, iconKey: item.iconKey }, ACTOR);
  }
  await recordAudit({ actorId: ACTOR, action: "create", entity: "nav", entityId: "header", entityLabel: "Header navigation", summary: SUMMARY });
  note("created", `navigation (${nav.length} menus, ${count} items)`);
}

async function migrateFooter() {
  const footer = seed<SeedFooterColumn[]>("footer.json");
  if ((await listFooterColumns()).length > 0) { note("skipped", "footer — the CMS already has footer columns"); return; }
  const count = footer.reduce((n, c) => n + c.links.length, 0);
  if (!APPLY) { note("created", `footer (${footer.length} columns, ${count} links)`); return; }
  for (const column of footer) {
    const col = await createFooterColumn({ title: column.title, viewAllHref: column.viewAllHref, viewAllLabel: column.viewAllLabel }, ACTOR);
    for (const link of column.links) await createFooterLink({ columnId: col._id, label: link.label, href: link.href, emphasized: link.emphasized === true }, ACTOR);
  }
  await recordAudit({ actorId: ACTOR, action: "create", entity: "footer", entityId: "footer", entityLabel: "Footer", summary: SUMMARY });
  note("created", `footer (${footer.length} columns, ${count} links)`);
}

/** Fills only the fields that are empty in `current` from `seedValue` (never overwrites an edit). */
function fillMissing(current: unknown, seedValue: unknown): unknown {
  if (current === undefined || current === null || current === "" || (Array.isArray(current) && current.length === 0)) return seedValue;
  if (current && typeof current === "object" && !Array.isArray(current) && seedValue && typeof seedValue === "object") {
    const out: Record<string, unknown> = { ...(current as Record<string, unknown>) };
    for (const [k, v] of Object.entries(seedValue as Record<string, unknown>)) out[k] = fillMissing(out[k], v);
    return out;
  }
  return current;
}

async function migrateSiteInfo() {
  const db = await getDb();
  const doc = await db.collection<{ _id: string; siteInfo?: unknown }>(COLLECTIONS.settings).findOne({ _id: "default" });
  const seedInfo = seed<unknown>("site-info.json");
  const merged = parseSiteInfo(fillMissing(doc?.siteInfo ?? {}, seedInfo));
  if (doc?.siteInfo && JSON.stringify(parseSiteInfo(doc.siteInfo)) === JSON.stringify(merged)) { note("skipped", "site identity & contact — already complete"); return; }
  const kind = doc?.siteInfo ? "updated" : "created";
  if (!APPLY) { note(kind, `site identity & contact${kind === "updated" ? " — missing fields filled in" : ""}`); return; }
  await saveSiteInfo(merged, ACTOR);
  await recordAudit({ actorId: ACTOR, action: "update", entity: "settings", entityId: "site-info", entityLabel: "Site identity & contact", summary: SUMMARY });
  note(kind, `site identity & contact${kind === "updated" ? " — missing fields filled in" : ""}`);
}

/** CMS Settings: site-wide SEO defaults + structured data, maintenance-page text, legal name — missing parts only. */
async function migrateSettings() {
  const db = await getDb();
  const settings = db.collection<{ _id: string; siteSeo?: unknown; maintenanceMode?: Record<string, unknown>; companyLegalName?: string }>(COLLECTIONS.settings);
  const doc = await settings.findOne({ _id: "default" });
  const seed = { ...seedJson<Record<string, unknown>>("settings.json"), siteSeo: seedJson<unknown>("site-seo.json") };
  const current = { siteSeo: doc?.siteSeo, maintenanceMode: doc?.maintenanceMode, companyLegalName: doc?.companyLegalName };
  const merged = fillMissing(current, seed) as Record<string, unknown>;
  if (JSON.stringify(merged) === JSON.stringify(current)) { note("skipped", "settings — site SEO, maintenance text, legal name already set"); return; }
  if (!APPLY) { note("updated", "settings — site SEO defaults / maintenance text / legal name filled in"); return; }
  await settings.updateOne({ _id: "default" }, { $set: { ...merged, updatedAt: new Date(), updatedBy: ACTOR } }, { upsert: true });
  await recordAudit({ actorId: ACTOR, action: "settings", entity: "settings", entityId: "default", entityLabel: "CMS settings", summary: SUMMARY });
  note("updated", "settings — site SEO defaults / maintenance text / legal name filled in");
}

async function migrateContactForm() {
  const db = await getDb();
  const doc = await db.collection<{ _id: string; fields?: unknown[] }>(COLLECTIONS.forms).findOne({ _id: "contact" });
  if (doc?.fields?.length) { note("skipped", "contact form fields — already in the CMS"); return; }
  if (!APPLY) { note("created", "contact form fields"); return; }
  await saveFormFields("contact", seed("contact-form-fields.json"), ACTOR);
  await recordAudit({ actorId: ACTOR, action: "update", entity: "form", entityId: "contact", entityLabel: "Contact form", summary: SUMMARY });
  note("created", "contact form fields");
}

async function main() {
  const db = await getDb();
  console.log(`${APPLY ? "APPLYING" : "DRY RUN (pass --apply to write)"} — database "${db.databaseName}"\n`);
  // Records first: publishing a record never creates a page here, because every record's page is in the seed
  // and pages are migrated after — but a page's JSON-LD / sections read records, so they should exist first.
  await migrateRecords();
  await migratePages();
  await migrateNav();
  await migrateFooter();
  await migrateSiteInfo();
  await migrateContactForm();
  await migrateSettings();
  const c = (k: keyof typeof report) => report[k].length;
  console.log(`\n${c("created")} ${APPLY ? "created" : "to create"}, ${c("updated")} ${APPLY ? "updated" : "to update"}, ${c("skipped")} skipped, ${c("failed")} failed`);
  if (c("failed")) console.log("\nFailed:\n  " + report.failed.join("\n  "));
  process.exit(c("failed") ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
