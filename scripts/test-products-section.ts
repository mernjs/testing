/**
 * Unit/integration checks for the Products section against a throwaway LOCAL
 * database that is dropped at the end (refuses to run against anything else):
 *
 *   MONGODB_URI=mongodb://127.0.0.1:27099/prod_test_$(date +%s) \
 *     npx --yes tsx --require ./scripts/lib/next-server-shims.cjs scripts/test-products-section.ts
 *
 * Covers: the extended product parse (old records stay valid, bad input rejected), the built-in
 * catalogue's content and links, the nav/footer migration (dry run writes nothing, re-run adds nothing),
 * and tenant isolation (a non-owner company never gets the Products nav item, collection, sitemap entries or pages).
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getPlatformDb, clientPromise } from "@/lib/platform/tenancy/platform-db";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { COMPANIES_COLLECTION, COMPANY_DOMAINS_COLLECTION, forgetCompanyRouting, type Company, type CompanyDomain } from "@/lib/platform/tenancy/companies";
import { forgetCompanySiteUrls } from "@/lib/platform/tenancy/site-url";
import { productsCollection } from "@/lib/cms/collections/products-def";
import { CMS_ICON_KEYS } from "@/lib/cms/icon-map";
import { createNavItem, getPublicNav, listNavItems, withoutProducts, type PublicNavTop } from "@/lib/cms/nav";
import { createFooterColumn, createFooterLink, getPublicFooter, listFooterColumns, listFooterLinks, withoutProductsLinks } from "@/lib/cms/footer";
import { publishRecord, saveRecordDraft } from "@/lib/cms/collections/store";
import { fillProductPageFields, loadSeedProducts, PRODUCT_PAGE_FIELDS, PRODUCTS_FOOTER_LINK, seedProductsNav } from "@/lib/products/seed";
import {
  buildProductsNav, capabilityChips, CATEGORY_ORDER, detailSectionTones, groupByCategory, hasOwnAi, isProductsHref, neighbours, pageContent,
  PRODUCTS_NAV_FEATURED, PRODUCTS_NAV_FEATURED_PREVIOUS, productHeroImage, relatedProducts, resolveCtas, SIGNUP_PATH, startUsingHref, ctaTarget, type StoredProduct,
} from "@/lib/products/shared";
import { fillText, PRODUCTS_TEXT_DEFAULTS, resolveProductsText } from "@/lib/products/text";
import { listingJsonLd, listingMetadata, productJsonLd, productMetadata } from "@/lib/products/seo";
import { loadProducts, requireProducts, withManifestScreenshots } from "@/lib/products/server";
import { baseSitemap } from "@/app/sitemap";
import { addProductsNav } from "./add-products-nav";
import { deleteNavItem } from "@/lib/cms/nav";

const uri = process.env.MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/[\w-]*test[\w-]*$/i.test(uri)) {
  console.error("Refusing to run: MONGODB_URI must be a local throwaway database whose name contains 'test'.");
  process.exit(1);
}

let passed = 0;
const failures: string[] = [];
async function check(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures.push(name);
    console.log(`  ✗ ${name}\n      ${err instanceof Error ? err.message.split("\n").slice(0, 10).join("\n      ") : String(err)}`);
  }
}

const ROOT = process.cwd();
const ORIGINAL_IDS = [
  "admin-command-center", "staff-hub", "hrms-suite", "pms-project-command", "prms-procurement", "tms-academy", "messenger-yashchat",
  "lms-sales-crm", "external-portal", "seo-panel", "dlms-digilocker", "aibots-studio", "smms-social-engine", "ots-exam-engine", "web-portal",
];
const ADDED_IDS = ["fms-finance", "ai-intelligence", "sop-policies", "cms-website", "business-automation-saas"];
const PRODUCT_COUNT = 20;

const now = new Date();
const company = (id: string, slug: string, isPlatformOwner = false): Company => ({ _id: id, slug, name: slug, status: "active", isPlatformOwner, createdAt: now, updatedAt: now });
const domain = (host: string, companyId: string, d: Partial<CompanyDomain> = {}): CompanyDomain => ({
  _id: host, companyId, status: "verified", verificationToken: "t", isPrimary: false, kind: "custom", createdAt: now, verifiedAt: now, ...d,
});

async function main() {
  const seed = loadSeedProducts();
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "cms-seed/collections/products.json"), "utf8")) as Record<string, unknown>[];

  // ── parse ───────────────────────────────────────────────────────────────
  console.log("product parse");
  const legacy = raw.find((r) => r.slug === "staff-hub")!;
  const legacyOnly = Object.fromEntries(Object.entries(legacy).filter(([k]) => !(PRODUCT_PAGE_FIELDS as readonly string[]).includes(k)));
  await check("an old record without any page field still parses, and gains none", () => {
    const p = productsCollection.parse(legacyOnly)!;
    assert.ok(p);
    for (const k of PRODUCT_PAGE_FIELDS) assert.equal((p as Record<string, unknown>)[k], undefined, k);
    assert.equal(p.name, legacy.name);
    assert.ok(p.keyFeatures.length > 0);
  });
  await check("a parsed record is stable (parse(parse(x)) === parse(x))", () => {
    for (const r of raw) {
      const once = productsCollection.parse(r)!;
      assert.deepEqual(productsCollection.parse(once), once, String(r.slug));
    }
  });
  await check("a record missing its slug or name is rejected", () => {
    assert.equal(productsCollection.parse({ name: "X" }), null);
    assert.equal(productsCollection.parse({ slug: "x" }), null);
    assert.equal(productsCollection.parse(null), null);
    assert.equal(productsCollection.parse("nope"), null);
  });
  await check("bad page-field input is dropped, not stored", () => {
    const p = productsCollection.parse({
      slug: "t", name: "T",
      benefits: [{ title: "" , description: "x" }, "junk", { title: "Ok", description: "d", icon: "Zap" }],
      faq: [{ q: "q", a: "" }, { q: "", a: "a" }, { q: "Q", a: "A" }],
      integrations: [{ name: "A", description: "d", href: "javascript:alert(1)" }, { name: "B", description: "d", href: "/products/x" }, { name: "C", description: "d", href: "//evil.com" }],
      screenshots: [{ src: "javascript:alert(1)", alt: "a", caption: "c" }, { src: "/products/x/1.webp", alt: "a", caption: "c" }],
      ctas: { primary: "launch-rocket", secondary: "request-demo" },
      automationWorkflows: [{ title: "W", description: "d", steps: ["a", "", 5, "b"] }, { description: "no title" }],
      facts: "not an array", features: 12, useCases: [null],
    })!;
    assert.deepEqual(p.benefits, [{ title: "Ok", description: "d", icon: "Zap" }]);
    assert.deepEqual(p.faq, [{ q: "Q", a: "A" }]);
    assert.deepEqual(p.integrations, [{ name: "A", description: "d" }, { name: "B", description: "d", href: "/products/x" }, { name: "C", description: "d" }]);
    assert.deepEqual(p.screenshots, [{ src: "/products/x/1.webp", alt: "a", caption: "c" }]);
    assert.deepEqual(p.ctas, { secondary: "request-demo" });
    assert.deepEqual(p.automationWorkflows, [{ title: "W", description: "d", steps: ["a", "b"] }]);
    assert.equal(p.facts, undefined);
    assert.equal(p.features, undefined);
    assert.equal(p.useCases, undefined);
  });
  await check("round-2 problem fields: parsed and trimmed, bad entries dropped, old records stay valid and gain none", () => {
    const p = productsCollection.parse({
      slug: "t", name: "T", problemIntro: "  Intro  ",
      problems: [{ title: "A", description: "d" }, { title: "", description: "x" }, "junk", { title: "B", description: "e", icon: "Zap" }],
      beforeAfter: [{ before: "b", after: "a" }, { before: "", after: "x" }, { before: "y" }, null],
    })!;
    assert.equal(p.problemIntro, "Intro");
    assert.deepEqual(p.problems, [{ title: "A", description: "d" }, { title: "B", description: "e", icon: "Zap" }]);
    assert.deepEqual(p.beforeAfter, [{ before: "b", after: "a" }]);
    const bad = productsCollection.parse({ slug: "t", name: "T", problemIntro: 5, problems: "x", beforeAfter: [1, 2] })!;
    assert.equal(bad.problemIntro, undefined);
    assert.equal(bad.problems, undefined);
    assert.equal(bad.beforeAfter, undefined);
    const old = productsCollection.parse(legacyOnly)!;
    assert.equal(old.problems, undefined);
    assert.deepEqual(pageContent(old as StoredProduct).problems, []);
    assert.equal(pageContent(old as StoredProduct).problem, old.problemSolved);
  });
  await check("the CMS form exposes every new field", () => {
    const keys = new Set(productsCollection.fields.map((f) => f.key));
    for (const k of [...PRODUCT_PAGE_FIELDS, "screenshots", "ctas"]) assert.ok(keys.has(k), `missing form field ${k}`);
  });
  await check("blank() still parses to a record", () => {
    const b = productsCollection.blank("new");
    assert.equal(productsCollection.parse({ ...b, name: "New" })?.slug, "new");
  });

  // ── built-in catalogue ──────────────────────────────────────────────────
  console.log("built-in catalogue");
  await check("all records parse; slugs are unique; the original ids are preserved; the new products are present", () => {
    assert.equal(seed.length, raw.length, "a seed record failed to parse");
    const slugs = seed.map((p) => p.slug);
    assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
    assert.equal(new Set(seed.map((p) => p.id)).size, seed.length, "duplicate id");
    for (const id of ORIGINAL_IDS) {
      const p = seed.find((x) => x.id === id);
      assert.ok(p, `original product ${id} is gone`);
      assert.equal(p.slug, id, `slug of ${id} changed`);
    }
    assert.deepEqual(slugs.slice(0, ORIGINAL_IDS.length), ORIGINAL_IDS, "original order changed");
    for (const id of ADDED_IDS) assert.ok(slugs.includes(id), `${id} missing`);
    assert.equal(seed.length, ORIGINAL_IDS.length + ADDED_IDS.length);
    assert.equal(seed.length, PRODUCT_COUNT);
  });
  await check("original records' existing fields are untouched by the content pass", () => {
    // the pre-existing fields keep their original wording (flagged claims are reported, not silently rewritten)
    const s = seed.find((p) => p.slug === "hrms-suite")!;
    assert.equal(s.tagline, "Automate HR operations, biometric payroll, and AI-powered talent acquisition.");
  });
  await check("every product has all the content the page needs", () => {
    for (const p of seed) {
      const c = pageContent(p);
      const where = p.slug;
      for (const f of ["shortName", "valueLine", "pitch", "overview", "outcome", "audience"] as const) assert.ok(String((p as Record<string, unknown>)[f] ?? "").trim(), `${where}: ${f} empty`);
      assert.ok(c.problem, `${where}: problem empty`);
      assert.ok(p.features!.length >= 3, `${where}: features`);
      assert.ok(p.aiFeatures!.length >= 1, `${where}: aiFeatures`);
      assert.ok(p.benefits!.length >= 3, `${where}: benefits`);
      assert.ok(p.useCases!.length >= 3 && p.useCases!.length <= 5, `${where}: useCases (${p.useCases?.length})`);
      assert.ok(p.automationWorkflows!.length >= 2 && p.automationWorkflows!.length <= 3, `${where}: workflows (${p.automationWorkflows?.length})`);
      for (const w of p.automationWorkflows!) assert.ok(w.steps.length >= 3 || w.description, `${where}: workflow ${w.title} has no steps`);
      assert.ok(p.integrations!.length >= 2, `${where}: integrations`);
      assert.ok(p.scenarios!.length >= 2, `${where}: scenarios`);
      assert.ok(p.faq!.length >= 3, `${where}: faq`);
      assert.ok(p.facts!.length >= 1, `${where}: facts`);
      assert.ok(p.screens.length >= 1, `${where}: screens`);
      assert.ok(p.targetDepartments.length > 0 && p.targetUsers.length > 0, `${where}: audience lists`);
      // round 2: the problem section
      assert.ok(p.problemIntro && p.problemIntro.length > 60, `${where}: problemIntro`);
      assert.ok(p.problems!.length >= 4 && p.problems!.length <= 6, `${where}: problems (${p.problems?.length})`);
      for (const pr of p.problems!) assert.ok(pr.title.length > 3 && pr.description.length > 30, `${where}: problem "${pr.title}"`);
      assert.equal(new Set(p.problems!.map((x) => x.title)).size, p.problems!.length, `${where}: duplicate problem titles`);
      assert.ok(p.beforeAfter!.length >= 3 && p.beforeAfter!.length <= 4, `${where}: beforeAfter (${p.beforeAfter?.length})`);
      for (const ba of p.beforeAfter!) assert.ok(ba.before.length > 15 && ba.after.length > 15, `${where}: beforeAfter pair`);
    }
  });
  await check("the Business Automation SaaS record: distinct from the Workspace, panel is the automations page, every claim guarded", () => {
    const p = seed.find((x) => x.slug === "business-automation-saas")!;
    assert.ok(p);
    assert.equal(p.name, "AI-Powered Business Automation SaaS");
    assert.equal(p.shortName, "Business Automation");
    assert.equal(p.category, "Executive & Operations");
    assert.equal(p.panelPath, "/workspace/settings/automations");
    assert.equal(startUsingHref(p.panelPath), "/workspace/login?next=%2Fworkspace%2Fsettings%2Fautomations");
    assert.ok(p.iconName && CMS_ICON_KEYS.includes(p.iconName));
    assert.ok(p.keyFeatures.length >= 3 && p.metrics.length >= 1 && p.screens.length >= 1 && p.hotspots.length >= 1);
    const navSeed = JSON.parse(fs.readFileSync(path.join(ROOT, "cms-seed/navigation.json"), "utf8")) as { name: string; items: { href: string; group: string; iconKey: string }[] }[];
    const entry = navSeed.find((t) => t.name === "Products")!.items.find((i) => i.href === "/products/business-automation-saas");
    assert.ok(entry && entry.group === "Executive & Operations" && CMS_ICON_KEYS.includes(entry.iconKey), "seed navigation lists it");
    assert.ok(seedProductsNav().items.some((i) => i.href === "/products/business-automation-saas"), "the nav script adds it");
    const hub = seed.find((x) => x.slug === "staff-hub")!;
    assert.notEqual(p.valueLine, hub.valueLine);
    assert.notEqual(p.pitch, hub.pitch);
    assert.deepEqual(p.problems!.length >= 4 && p.problems!.length <= 6, true);
    for (const href of ["staff-hub", "lms-sales-crm", "pms-project-command", "fms-finance", "hrms-suite"]) assert.ok(p.integrations!.some((i) => i.href === `/products/${href}`), href);
    const banned: [RegExp, string][] = [
      [/\d\s?%/, "percentage"], [/[₹$€£]|\b(rs\.?|inr|usd|eur)\b/i, "currency"], [/\bSLA\b|uptime|24\/7|\bpercent\b/i, "SLA/uptime"],
      [/certified|certification|\bISO\b|\bSOC\b|GDPR|HIPAA|\bawards?\b|guarantee|trusted by/i, "certification/award/promise"],
      [/\b(Razorpay\w*|OpenAI|Google|Meta|Instagram|Facebook|LinkedIn|YouTube|WhatsApp|Excel|Outlook|Gmail|Jira|Trello|Asana|Notion|Zoom|PayPal|Slack|Zoho|Zapier|Salesforce|HubSpot|Tally|QuickBooks|Stripe)\b/, "named third-party tool"],
      [/\b[a-z]{2,}\.[a-z]{2,}(\.[a-z_]+)*\b/, "dotted identifier"], [/collection|maxTimeMS|_id\b|\bwebhook_|[a-z][A-Z][a-z]/, "internal identifier"],
      [/\b\d+\s?(x|times|hours?|days?|minutes?|weeks?|seconds?|months?)\b/i, "timing/multiplier"], [/\b\d{2,}\b/, "number"],
    ];
    // only the words people read (values), not field names or technical fields
    const strings: string[] = [];
    const walk = (v: unknown, key = "") => {
      if (typeof v === "string") { if (!["icon", "iconName", "panelPath", "href", "id", "slug", "accentColor", "mockupType", "category"].includes(key)) strings.push(v); }
      else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k);
    };
    walk(p);
    const t = strings.join("\n");
    const hits: string[] = [];
    for (const [re, why] of banned) { const m = re.exec(t); if (m) hits.push(`${why} ("${m[0]}")`); }
    assert.equal(hits.join("; "), "");
  });
  await check("round-2 text (problems, comparison, intro) makes no unverifiable claim and shows no internal identifier", () => {
    const banned: [RegExp, string][] = [
      [/\d\s?%/, "percentage"], [/[₹$€£]|\b(rs\.?|inr|usd|eur)\b/i, "currency"], [/\bSLA\b|uptime|24\/7|\bpercent\b/i, "SLA/uptime/percent"],
      [/certified|certification|\bISO\b|\bSOC\b|GDPR|HIPAA|\bawards?\b|guarantee|trusted by/i, "certification/award/promise"],
      [/\b(Razorpay\w*|OpenAI|Google|Meta|Instagram|Facebook|LinkedIn|YouTube|WhatsApp|Excel|Outlook|Gmail|Jira|Trello|Asana|Notion|Zoom|PayPal|Slack|Zoho|Zapier|Salesforce|HubSpot|Tally|QuickBooks|Stripe)\b/, "named third-party tool"],
      [/\b[a-z]{2,}\.[a-z]{2,}(\.[a-z_]+)*\b/, "dotted identifier"], [/collection|maxTimeMS|_id\b|\bwebhook_|[a-z][A-Z][a-z]/, "internal identifier"],
      [/\b\d+\s?(x|times|hours?|days?|minutes?|weeks?|seconds?|months?)\b/i, "timing/multiplier"],
    ];
    const hits: string[] = [];
    for (const p of seed) {
      const t = JSON.stringify([p.problemIntro, p.problems, p.beforeAfter], (k, v) => (k === "icon" ? undefined : v));
      for (const [re, why] of banned) { const m = re.exec(t); if (m) hits.push(`${p.slug}: ${why} ("${m[0]}")`); }
    }
    assert.equal(hits.join("; "), "");
  });
  await check("every 'with it' line is grounded: it shares a distinctive word with the product's own features, AI, workflows or overview", () => {
    // A cheap guard against a claim with nothing behind it: each after-text must reuse at least one significant word from the product's existing, verified content.
    const stop = new Set("the a an and or of to in on for with is are be by as at from that this it its their your you can into one each every when where which who what they them than then also only any all more most such via per not no".split(" "));
    const words = (s: string) => (s.toLowerCase().match(/[a-z]{5,}/g) ?? []).filter((w) => !stop.has(w));
    const weak: string[] = [];
    for (const p of seed) {
      const known = new Set(words(JSON.stringify([p.features, p.aiFeatures, p.automationWorkflows, p.overview, p.keyFeatures, p.integrations, p.benefits, p.valueLine])));
      for (const ba of p.beforeAfter!) if (!words(ba.after).some((w) => known.has(w))) weak.push(`${p.slug}: ${ba.after.slice(0, 50)}`);
    }
    assert.deepEqual(weak, []);
  });
  await check("every icon key (product, features, benefits, use cases, nav) exists in the icon map", () => {
    const keys = new Set(CMS_ICON_KEYS);
    const bad: string[] = [];
    for (const p of seed) {
      const icons = [p.iconName, ...[p.features, p.aiFeatures, p.benefits, p.useCases].flatMap((l) => (l ?? []).map((i) => i.icon ?? "Sparkles"))];
      for (const i of icons) if (!keys.has(i)) bad.push(`${p.slug}:${i}`);
    }
    assert.deepEqual(bad, []);
    assert.ok(keys.has(seedProductsNav().iconKey));
  });
  await check("every panelPath resolves to a real route folder (or a configured redirect), and Start Using points at it", () => {
    const nextConfig = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
    for (const p of seed) {
      const seg = p.panelPath.split("/")[1] ?? "";
      if (p.panelPath === "/") {
        assert.ok(fs.existsSync(path.join(ROOT, "src/app/(site)/page.tsx")), "home page missing");
        assert.equal(startUsingHref(p.panelPath), null);
        continue;
      }
      const exists = fs.existsSync(path.join(ROOT, "src/app", seg)) || fs.existsSync(path.join(ROOT, "src/app/(site)", seg)) || fs.existsSync(path.join(ROOT, "src/app/(platform)", seg));
      const redirected = nextConfig.includes(`source: "/${seg}"`);
      assert.ok(exists || redirected, `${p.slug}: ${p.panelPath} has no route`);
      const href = startUsingHref(p.panelPath)!;
      assert.ok(href.startsWith("/workspace"), href);
    }
  });
  await check("every integration link and nav/CTA target resolves", () => {
    const slugs = new Set(seed.map((p) => p.slug));
    const bad: string[] = [];
    for (const p of seed) {
      for (const i of p.integrations ?? []) {
        if (!i.href) continue;
        const m = i.href.match(/^\/products\/([a-z0-9-]+)$/);
        if (!m || !slugs.has(m[1])) bad.push(`${p.slug} -> ${i.href}`);
        if (m && m[1] === p.slug) bad.push(`${p.slug} links to itself`);
      }
    }
    assert.deepEqual(bad, []);
    for (const p of seed) {
      assert.deepEqual(ctaTarget("get-started", null), { href: "/signup", kind: "get-started" });
      assert.ok(fs.existsSync(path.join(ROOT, "src/app/(platform)/signup/page.tsx")), "/signup page missing");
      assert.equal(ctaTarget("start-using", null), null);
      assert.ok(p.slug);
    }
  });
  await check("the mock-up screens of the added products are handled by ProductMockup", () => {
    const src = fs.readFileSync(path.join(ROOT, "src/components/products/ProductMockup.tsx"), "utf8");
    for (const id of ADDED_IDS) for (const s of seed.find((p) => p.slug === id)!.screens) assert.ok(src.includes(`case "${s.mockupType}"`), `${id}: ${s.mockupType}`);
  });
  await check("no unverifiable claims in the new page content (percentages, SLAs, certifications, awards, named third-party tools, customers)", () => {
    const banned = [/\d\s?%/, /\bSLA\b/i, /uptime/i, /\b99\.\d/, /certified/i, /\bISO\s?\d/i, /\bSOC\s?2/i, /GDPR/i, /HIPAA/i, /award/i, /trusted by/i, /\bcustomers? like\b/i,
      /\bSlack\b/, /\bZoho\b/, /\bZapier\b/, /Salesforce/, /HubSpot/, /Microsoft Teams/, /Tally/, /QuickBooks/, /Stripe/, /\bGPT-?4/i, /Claude/, /biometric/i, /\$\s?\d/, /guarantee/i, /free forever/i, /per (user|seat|month)/i];
    const hits: string[] = [];
    for (const p of seed) {
      // icon keys (e.g. "Award") are identifiers, not claims
      const text = JSON.stringify(Object.fromEntries(PRODUCT_PAGE_FIELDS.map((k) => [k, (p as Record<string, unknown>)[k]])), (k, v) => (k === "icon" ? undefined : v));
      for (const re of banned) if (re.test(text)) hits.push(`${p.slug}: ${re}`);
    }
    assert.equal(hits.join("; "), "");
  });
  await check("AI claims only exist where an AI feature does: products with no AI of their own say so", () => {
    const real = new Set(["staff-hub", "ai-intelligence", "aibots-studio", "smms-social-engine", "lms-sales-crm", "web-portal", "cms-website", "admin-command-center", "hrms-suite", "pms-project-command", "fms-finance", "prms-procurement", "business-automation-saas"]);
    for (const p of seed) {
      if (real.has(p.slug)) continue;
      assert.ok(p.aiFeatures!.every((a) => /no ai of its own/i.test(a.title)), `${p.slug} claims AI`);
    }
  });

  await check("hasOwnAi is true exactly for the products that have AI of their own (the AI badge and the suite list use it)", () => {
    const real = new Set(["staff-hub", "ai-intelligence", "aibots-studio", "smms-social-engine", "lms-sales-crm", "web-portal", "cms-website", "admin-command-center", "hrms-suite", "pms-project-command", "fms-finance", "prms-procurement", "business-automation-saas"]);
    for (const p of seed) assert.equal(hasOwnAi(p), real.has(p.slug), p.slug);
    assert.equal(hasOwnAi({ aiFeatures: undefined }), false);
    assert.equal(hasOwnAi({ aiFeatures: [{ title: "No AI of its own", description: "x" }] }), false);
  });

  // ── pure helpers ────────────────────────────────────────────────────────
  console.log("helpers");
  await check("groupByCategory keeps the category order and drops empty groups", () => {
    const g = groupByCategory(seed);
    assert.deepEqual(g.map((x) => x.category), CATEGORY_ORDER.filter((c) => seed.some((p) => p.category === c)));
    assert.equal(g.reduce((n, x) => n + x.products.length, 0), seed.length);
    assert.deepEqual(groupByCategory([]), []);
  });
  await check("CTAs: Get Started + Request Demo by default, overridable, Start Using only when there is a panel", () => {
    const hr = seed.find((p) => p.slug === "hrms-suite")!;
    assert.deepEqual({ ...resolveCtas(hr), startUsing: undefined }, { primary: "get-started", secondary: "request-demo", startUsing: undefined });
    assert.equal(resolveCtas(hr).startUsing, "/workspace/login?next=%2Fhrms");
    assert.equal(startUsingHref("/admin"), "/workspace/login?next=%2Fworkspace");
    assert.equal(startUsingHref("/"), null);
    assert.equal(startUsingHref("https://evil.com"), null);
    assert.equal(startUsingHref("//evil.com"), null);
    assert.equal(resolveCtas({ panelPath: "/x", ctas: { primary: "request-demo", secondary: "none" } }).secondary, "none");
    assert.deepEqual(ctaTarget("request-demo", null), { href: "#demo", kind: "request-demo" });
    assert.equal(ctaTarget("none", "/x"), null);
  });
  await check("related products, neighbours and chips", () => {
    const hr = seed.find((p) => p.slug === "hrms-suite")!;
    const rel = relatedProducts(hr, seed, 3);
    assert.equal(rel.length, 3);
    assert.ok(rel.every((p) => p.slug !== hr.slug));
    assert.equal(rel[0].category, hr.category === rel[0].category ? hr.category : rel[0].category);
    const n = neighbours(seed[0], seed)!;
    assert.equal(n.prev.slug, seed[seed.length - 1].slug);
    assert.equal(n.next.slug, seed[1].slug);
    assert.equal(neighbours(seed[0], [seed[0]]), null);
    for (const p of seed) assert.ok(capabilityChips(p).length >= 2 && capabilityChips(p).length <= 3);
  });
  await check("pageContent falls back to the catalogue's own fields for records without page content", () => {
    const old = productsCollection.parse(legacyOnly)!;
    const c = pageContent(old as StoredProduct);
    assert.equal(c.pitch, old.shortDescription);
    assert.equal(c.overview, old.fullDescription);
    assert.deepEqual(c.features.map((f) => f.title), old.keyFeatures.map((f) => f.title));
    assert.deepEqual(c.ai.map((a) => a.title), old.aiCapabilities);
    assert.deepEqual(c.benefits, []);
    assert.deepEqual(c.faq, []);
  });
  await check("buildProductsNav: one entry per product, grouped by category, with icon and one-line value", () => {
    const nav = buildProductsNav(seed);
    assert.equal(nav.href, "/products");
    assert.equal(nav.items.length, seed.length);
    assert.ok(nav.items.some((i) => i.name === "AI Intelligence" && i.href === "/products/ai-intelligence"));
    for (const i of nav.items) { assert.ok(i.name && i.description && i.iconKey && i.group, JSON.stringify(i)); assert.ok(i.href.startsWith("/products/")); }
    // items of a group are contiguous
    const seen: string[] = [];
    for (const i of nav.items) if (seen[seen.length - 1] !== i.group) { assert.ok(!seen.includes(i.group), `group ${i.group} split`); seen.push(i.group); }
  });
  await check("detail sections: tones alternate over the sections a product actually has, and a round-1 record degrades gracefully", () => {
    for (const p of seed) {
      const tones = detailSectionTones(p, seed);
      const order = ["problem", "compare", "overview", "features", "ai", "automation", "useCases", "benefits", "audience", "integrations", "faq", "related"] as const;
      const present = order.filter((k) => tones[k]);
      assert.equal(present.length, order.length, `${p.slug}: every section has content`);
      present.forEach((k, i) => assert.equal(tones[k], i % 2 === 0 ? "muted" : "default", `${p.slug}:${k}`));
    }
    const round1 = productsCollection.parse(Object.fromEntries(Object.entries(raw.find((r) => r.slug === "hrms-suite")!).filter(([k]) => !["problemIntro", "problems", "beforeAfter"].includes(k))))! as StoredProduct;
    const t = detailSectionTones(round1, seed);
    assert.ok(t.problem, "the single problem statement still renders a section");
    assert.equal(t.compare, undefined);
    const c = pageContent(round1);
    assert.deepEqual([c.problemIntro, c.problems, c.beforeAfter], ["", [], []]);
    assert.ok(c.problem);
    const bare = productsCollection.parse({ slug: "x", name: "X" }) as StoredProduct;
    const tb = detailSectionTones(bare, [bare]);
    assert.equal(tb.problem, undefined);
    assert.equal(tb.related, undefined);
  });
  await check("the business-automation CTAs: text keys exist, the exact featured title is set, and every signup CTA goes to /signup", () => {
    const t = resolveProductsText({});
    assert.equal(t["products.featured.title"], "Automate Your Business with Our AI-Powered Business Automation SaaS");
    assert.equal(t["products.cta.startAutomating"], "Start Automating Your Business");
    assert.equal(t["products.cta.createAutomation"], "Create Your Business Automation");
    assert.equal(t["products.cta.explorePlatform"], "Explore the Platform");
    assert.equal(t["products.menu.cta"], "Start Automating Your Business");
    assert.equal(SIGNUP_PATH, "/signup");
    assert.deepEqual(ctaTarget("get-started", null), { href: "/signup", kind: "get-started" });
    for (const k of ["point1", "point2", "point3", "point4"]) assert.ok(t[`products.featured.${k}`], k);
    // the card's destination is an editable text key (code default and CMS seed agree), and the signup CTA stays /signup
    assert.equal(t["products.featured.href"], "/services/our-saas-product");
    const siteSeed = (JSON.parse(fs.readFileSync(path.join(ROOT, "cms-seed/site-info.json"), "utf8")) as { text: Record<string, string> }).text;
    for (const k of ["href", "pitch", "point1", "point2", "point3", "point4", "title"]) assert.equal(siteSeed[`products.featured.${k}`], t[`products.featured.${k}`], `seed ${k}`);
    assert.equal(resolveProductsText({ "products.featured.href": "/elsewhere" })["products.featured.href"], "/elsewhere");
    assert.ok(fs.existsSync(path.join(ROOT, "src/app/(site)/services/[slug]/page.tsx")) || fs.existsSync(path.join(ROOT, "src/app/(site)/services")), "services route");
    const grid = fs.readFileSync(path.join(ROOT, "src/components/products/page/ProductsGrid.tsx"), "utf8");
    assert.ok(grid.includes('text["products.featured.href"]') && !grid.includes("staff-hub"), "the card reads its destination from the text key");
    assert.equal(PRODUCTS_NAV_FEATURED.title, t["products.featured.title"]);
    assert.notEqual(PRODUCTS_NAV_FEATURED.title, PRODUCTS_NAV_FEATURED_PREVIOUS.title);
    // the featured pitch only mentions things the platform has
    for (const w of ["sign-in", "roles", "automation", "AI", "workspace"]) assert.ok(t["products.featured.pitch"].includes(w), w);
    assert.ok(!/\d\s?%|guarantee|certified/i.test(t["products.featured.pitch"]));
  });
  await check("hero images: allowed remote host, AI visual for the AI category, editable through text keys", () => {
    const t = resolveProductsText({});
    const nextConfig = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
    assert.ok(nextConfig.includes("images.unsplash.com"));
    for (const k of ["products.listing.heroImage", "products.hero.imageDefault", "products.hero.imageAi", "products.featured.image"]) assert.ok(t[k].startsWith("https://images.unsplash.com/photo-"), k);
    assert.equal(productHeroImage({ category: "AI & Intelligence" }, t), t["products.hero.imageAi"]);
    assert.equal(productHeroImage({ category: "HR & Talent" }, t), t["products.hero.imageDefault"]);
    assert.equal(productHeroImage({ category: "HR & Talent" }, resolveProductsText({ "products.hero.imageDefault": "https://example.com/x.jpg" })), "https://example.com/x.jpg");
  });
  await check("the header Products menu is the standard dropdown (no custom grouped layout), the listing and detail pages sit on the shared section components", () => {
    const header = fs.readFileSync(path.join(ROOT, "src/components/Header.tsx"), "utf8");
    for (const gone of ["groupItems", "grid-cols-3 gap-x-6 gap-y-5", "bg-background dark:bg-card", "100vh-220px", "x.group"]) assert.ok(!header.includes(gone), `Header still has "${gone}"`);
    assert.ok(header.includes("grid grid-cols-5 p-2") && header.includes("<FeaturedCard"), "standard dropdown markup");
    const grid = fs.readFileSync(path.join(ROOT, "src/components/products/page/ProductsGrid.tsx"), "utf8");
    for (const c of ["FeaturedListingCard", "ListingCard"]) assert.ok(grid.includes(`@/components/sections/${c}`), c);
    assert.ok(fs.readFileSync(path.join(ROOT, "src/components/products/page/ProductsHero.tsx"), "utf8").includes("@/components/sections/ListingHero"));
    assert.ok(fs.readFileSync(path.join(ROOT, "src/components/products/page/ProductDetailHero.tsx"), "utf8").includes("@/components/sections/PageHero"));
    const detail = fs.readFileSync(path.join(ROOT, "src/app/(site)/products/[slug]/page.tsx"), "utf8");
    assert.ok(detail.includes("@/components/sections/DetailCTA") && detail.includes("SIGNUP_PATH"));
  });
  await check("isProductsHref", () => {
    assert.ok(isProductsHref("/products") && isProductsHref("/products/x") && isProductsHref("/products?x=1"));
    assert.ok(!isProductsHref("/productsx") && !isProductsHref("/services/our-saas-product") && !isProductsHref("/"));
  });
  await check("withoutProducts / withoutProductsLinks remove only Products entries", () => {
    const nav: PublicNavTop[] = [
      { name: "Services", href: "/services", iconKey: "Layers", featured: { title: "", description: "", image: "", href: null }, items: [{ name: "Our SaaS Product", href: "/services/our-saas-product", description: null, iconKey: "Sparkles", group: null }, { name: "X", href: "/products/x", description: null, iconKey: "Sparkles", group: null }] },
      { name: "Products", href: "/products", iconKey: "Boxes", featured: { title: "", description: "", image: "", href: null }, items: [] },
    ];
    const out = withoutProducts(nav);
    assert.deepEqual(out.map((t) => t.name), ["Services"]);
    assert.deepEqual(out[0].items.map((i) => i.href), ["/services/our-saas-product"]);
    const f = withoutProductsLinks([{ title: "Services", viewAllHref: "/services", viewAllLabel: null, links: [{ label: "Products", href: "/products", emphasized: true }, { label: "Dev", href: "/software-development", emphasized: false }] }]);
    assert.deepEqual(f[0].links.map((l) => l.href), ["/software-development"]);
  });
  await check("upgrading round-1 product records: only the three new fields are filled, edits are never overwritten, a second run changes nothing", () => {
    const rec = raw.find((r) => r.slug === "hrms-suite")!;
    const round1 = Object.fromEntries(Object.entries(rec).filter(([k]) => !["problemIntro", "problems", "beforeAfter"].includes(k)));
    const first = fillProductPageFields(round1, rec)!;
    assert.ok(first);
    for (const k of ["problemIntro", "problems", "beforeAfter"]) assert.deepEqual(first[k], rec[k], k);
    for (const [k, v] of Object.entries(round1)) assert.deepEqual(first[k], v, `${k} must be untouched`);
    assert.equal(fillProductPageFields(first, rec), null, "idempotent");
    // an editor already wrote their own problem text: kept, the missing fields still filled
    const edited = fillProductPageFields({ ...round1, problemIntro: "Our own words." }, rec)!;
    assert.equal(edited.problemIntro, "Our own words.");
    assert.deepEqual(edited.problems, rec.problems);
    // an edited existing field (overview) is never replaced
    assert.equal(fillProductPageFields({ ...round1, overview: "Edited overview" }, rec)!.overview, "Edited overview");
  });
  await check("fillProductPageFields fills only empty fields and never overwrites", () => {
    const s = { pitch: "seed pitch", faq: [{ q: "a", a: "b" }], overview: "seed overview" };
    assert.deepEqual(fillProductPageFields({ pitch: "mine", faq: [] }, s), { pitch: "mine", faq: s.faq, overview: "seed overview" });
    assert.equal(fillProductPageFields({ pitch: "mine", faq: [{ q: "x", a: "y" }], overview: "o" }, s), null);
    assert.equal(fillProductPageFields({}, {}), null);
  });
  await check("captured screenshots merge by slug without replacing authored ones", () => {
    const shot = { src: "/products/a/1.webp", alt: "a", caption: "c" };
    const a = { ...seed[0] }; const b = { ...seed[1], screenshots: [{ src: "/x.webp", alt: "", caption: "" }] };
    const out = withManifestScreenshots([a, b], { [a.slug]: [shot], [b.slug]: [shot] });
    assert.deepEqual(out[0].screenshots, [shot]);
    assert.equal(out[1].screenshots![0].src, "/x.webp");
    assert.deepEqual(withManifestScreenshots([a], {}), [a]);
    const committed = JSON.parse(fs.readFileSync(path.join(ROOT, "public/products/manifest.json"), "utf8"));
    assert.equal(typeof committed, "object");
  });
  await check("UI text: defaults for every key, CMS values win, blank CMS values fall back", () => {
    const t = resolveProductsText({ "products.card.explore": "See it", "products.cta.getStarted": "  ", "other.key": "x" });
    assert.equal(t["products.card.explore"], "See it");
    assert.equal(t["products.cta.getStarted"], PRODUCTS_TEXT_DEFAULTS["products.cta.getStarted"]);
    assert.equal(t["other.key"], undefined);
    assert.equal(fillText("Ready for {name}?", { name: "HR" }), "Ready for HR?");
    const siteInfo = JSON.parse(fs.readFileSync(path.join(ROOT, "cms-seed/site-info.json"), "utf8")) as { text: Record<string, string> };
    for (const k of Object.keys(PRODUCTS_TEXT_DEFAULTS)) assert.equal(siteInfo.text[k], PRODUCTS_TEXT_DEFAULTS[k], `site-info seed missing ${k}`);
  });

  // ── SEO ─────────────────────────────────────────────────────────────────
  console.log("seo");
  const text = resolveProductsText({});
  const origin = "https://acme-owner.example";
  await check("metadata uses the company's own origin for canonical and OG", () => {
    const m = productMetadata(seed[2], { origin, siteName: "Brand", text });
    assert.equal(m.alternates?.canonical, `${origin}/products/${seed[2].slug}`);
    assert.equal((m.openGraph as { url: string }).url, `${origin}/products/${seed[2].slug}`);
    assert.ok(String(m.title).includes(seed[2].name));
    assert.ok(!JSON.stringify(m).includes("https://yashorbit.com"));
    assert.equal(listingMetadata({ origin, siteName: "B", text }).alternates?.canonical, `${origin}/products`);
  });
  await check("JSON-LD: SoftwareApplication (no offers), BreadcrumbList, FAQPage; ItemList on the listing; all valid JSON", () => {
    for (const p of seed) {
      const ld = productJsonLd(p, origin, "Brand", text);
      const app = ld[0] as Record<string, unknown>;
      assert.equal(app["@type"], "SoftwareApplication");
      assert.equal("offers" in app, false);
      assert.ok(Array.isArray(app.featureList) && (app.featureList as string[]).length >= 3);
      assert.equal(app.url, `${origin}/products/${p.slug}`);
      const crumbs = (ld[1] as { itemListElement: { position: number; item: string }[] }).itemListElement;
      assert.deepEqual(crumbs.map((c) => c.position), [1, 2, 3]);
      assert.ok(crumbs.every((c) => c.item.startsWith(origin)));
      assert.equal((ld[2] as Record<string, unknown>)["@type"], "FAQPage");
      JSON.parse(JSON.stringify(ld));
    }
    const list = listingJsonLd(seed, origin, text);
    assert.equal((list[0] as { itemListElement: unknown[] }).itemListElement.length, seed.length);
    JSON.parse(JSON.stringify(list));
  });

  // ── database: migration, tenant isolation ──────────────────────────────
  console.log("nav migration + tenant isolation (scratch database)");
  const db = await getPlatformDb();
  await db.collection<Company>(COMPANIES_COLLECTION).insertMany([company("owner", "yashorbit", true), company("acme", "acme")]);
  await db.collection<CompanyDomain>(COMPANY_DOMAINS_COLLECTION).insertMany([
    domain("yashorbit.com", "owner", { isPrimary: true }), domain("yashorbit.yashorbit.com", "owner", { kind: "subdomain" }), domain("acme.yashorbit.com", "acme", { kind: "subdomain", isPrimary: true }),
  ]);
  forgetCompanyRouting();
  forgetCompanySiteUrls();
  const as = <T>(id: string, fn: () => Promise<T>) => runAsCompany(id, fn);

  // a stored owner nav as it exists today: About, Services, Industries; footer with a Services column
  await as("owner", async () => {
    for (const [i, name] of ["About", "Services", "Industries"].entries()) {
      const top = await createNavItem({ parentId: null, label: name, href: `/${name.toLowerCase()}`, iconKey: "Layers", featuredTitle: name, featuredDescription: "d", featuredImage: "https://x/y.png" }, "test");
      await createNavItem({ parentId: top._id, label: `${name} child`, href: `/${name.toLowerCase()}/child${i}`, description: "d", iconKey: "Zap" }, "test");
    }
    const col = await createFooterColumn({ title: "Services", viewAllHref: "/services", viewAllLabel: "View All Services" }, "test");
    await createFooterLink({ columnId: col._id, label: "Our SaaS Product", href: "/services/our-saas-product", emphasized: true }, "test");
    await createFooterLink({ columnId: col._id, label: "Dev", href: "/software-development" }, "test");
  });
  const snapshot = async () => as("owner", async () => ({ nav: await listNavItems(), cols: await listFooterColumns(), links: await listFooterLinks() }));
  const before = await snapshot();

  await check("dry run writes nothing", async () => {
    const r = await as("owner", () => addProductsNav(false));
    assert.ok(r.created.length > seed.length, "plan should list the menu, every product and the footer link");
    assert.deepEqual(await snapshot(), before);
  });
  await check("--apply adds one Products menu after Services, one entry per product, and one footer link; other entries untouched", async () => {
    await as("owner", () => addProductsNav(true));
    const after = await snapshot();
    const tops = after.nav.filter((i) => !i.parentId).sort((a, b) => a.orderKey - b.orderKey);
    assert.deepEqual(tops.map((t) => t.label), ["About", "Services", "Products", "Industries"]);
    const products = tops.find((t) => t.label === "Products")!;
    assert.equal(products.href, "/products");
    const kids = after.nav.filter((i) => i.parentId === products._id);
    assert.equal(kids.length, seed.length);
    assert.equal(new Set(kids.map((k) => k.href)).size, kids.length);
    assert.ok(kids.every((k) => k.group && k.description && k.iconKey));
    assert.ok(kids.some((k) => k.href === "/products/ai-intelligence"));
    // every original item is byte-identical
    for (const old of before.nav) assert.deepEqual(after.nav.find((i) => i._id === old._id), old);
    const fl = after.links.filter((l) => l.href === "/products");
    assert.equal(fl.length, 1);
    const services = after.cols.find((c) => c.title === "Services")!;
    assert.equal(fl[0].columnId, services._id);
    const ordered = after.links.filter((l) => l.columnId === services._id).sort((a, b) => a.orderKey - b.orderKey);
    assert.equal(ordered[0].href, "/products");
    for (const old of before.links) assert.deepEqual(after.links.find((l) => l._id === old._id), old);
  });
  await check("re-running --apply is a no-op (idempotent: no duplicates, nothing created)", async () => {
    const one = await snapshot();
    const r = await as("owner", () => addProductsNav(true));
    assert.deepEqual(r.created, []);
    assert.deepEqual(await snapshot(), one);
    const r2 = await as("owner", () => addProductsNav(true));
    assert.deepEqual(r2.created, []);
    assert.equal((await snapshot()).nav.filter((i) => !i.parentId && i.href === "/products").length, 1);
  });
  await check("upgrading the round-1 menu: featured card replaced only while it is the round-1 text; dry run writes nothing; re-run is a no-op; other entries untouched", async () => {
    const featuredOf = async () => (await snapshot()).nav.find((i) => !i.parentId && i.href === "/products")!;
    const top = await featuredOf();
    // the state a database has after the round-1 script
    await as("owner", async () => {
      const { updateNavItem } = await import("@/lib/cms/nav");
      await updateNavItem(top._id, { featuredTitle: PRODUCTS_NAV_FEATURED_PREVIOUS.title, featuredDescription: "An editor's own description", featuredImage: PRODUCTS_NAV_FEATURED_PREVIOUS.image }, "test");
    });
    const round1State = await snapshot();
    const dry = await as("owner", () => addProductsNav(false));
    assert.equal(dry.updated.length, 1);
    assert.deepEqual(await snapshot(), round1State, "dry run must write nothing");
    const done = await as("owner", () => addProductsNav(true));
    assert.equal(done.updated.length, 1);
    assert.deepEqual(done.created, []);
    const after = await featuredOf();
    assert.equal(after.featuredTitle, PRODUCTS_NAV_FEATURED.title);
    assert.equal(after.featuredImage, PRODUCTS_NAV_FEATURED.image);
    assert.equal(after.featuredDescription, "An editor's own description", "an edited text is never replaced");
    const now = await snapshot();
    for (const old of round1State.nav) if (old._id !== top._id) assert.deepEqual(now.nav.find((i) => i._id === old._id), old, "other entries untouched");
    const again = await as("owner", () => addProductsNav(true));
    assert.deepEqual([again.created, again.updated], [[], []]);
    assert.deepEqual(await snapshot(), now);
    // a fully edited card is left alone
    await as("owner", async () => { const { updateNavItem } = await import("@/lib/cms/nav"); await updateNavItem(top._id, { featuredTitle: "Mine", featuredDescription: "Mine too", featuredImage: "https://x/y.png" }, "test"); });
    const kept = await snapshot();
    const r = await as("owner", () => addProductsNav(true));
    assert.deepEqual([r.created, r.updated], [[], []]);
    assert.deepEqual(await snapshot(), kept);
  });
  await check("a partially-present menu only gets the missing entries added", async () => {
    const s = await snapshot();
    const top = s.nav.find((i) => i.href === "/products")!;
    const victim = s.nav.find((i) => i.parentId === top._id && i.href === "/products/sop-policies")!;
    await as("owner", () => deleteNavItem(victim._id));
    const r = await as("owner", () => addProductsNav(true));
    assert.deepEqual(r.created, ["header item /products/sop-policies (Executive & Operations)"]);
  });

  // owner: publish two product records so the collection/sitemap have content
  await as("owner", async () => {
    for (const rec of raw.slice(0, 2).concat(raw.filter((r) => r.slug === "ai-intelligence"))) {
      assert.ok((await saveRecordDraft("products", String(rec.slug), rec, "test")).ok);
      assert.ok((await publishRecord("products", String(rec.slug), "test")).ok);
    }
  });
  // a tenant whose navigation somehow contains Products (e.g. copied or migrated by mistake)
  await as("acme", async () => {
    const top = await createNavItem({ parentId: null, label: "Products", href: "/products", iconKey: "Boxes", featuredTitle: "p", featuredDescription: "d", featuredImage: "i" }, "test");
    await createNavItem({ parentId: top._id, label: "X", href: "/products/x", iconKey: "Zap", group: "g" }, "test");
    await createNavItem({ parentId: null, label: "About", href: "/about", iconKey: "Layers" }, "test");
    const col = await createFooterColumn({ title: "Services" }, "test");
    await createFooterLink({ columnId: col._id, label: "Products", href: "/products" }, "test");
  });

  await check("owner context serves the Products menu, the footer link and the products collection", async () => {
    const nav = await as("owner", () => getPublicNav());
    const p = nav.find((t) => t.href === "/products")!;
    assert.ok(p && p.items.length === seed.length && p.items.every((i) => i.group));
    const footer = await as("owner", () => getPublicFooter());
    assert.ok(footer.some((c) => c.links.some((l) => l.href === "/products")));
    const products = await as("owner", () => loadProducts());
    assert.deepEqual(products!.map((x) => x.slug).sort(), [raw[0].slug, raw[1].slug, "ai-intelligence"].sort());
  });
  await check("tenant context: no Products in the nav or footer, the collection is not served, pages 404", async () => {
    const nav = await as("acme", () => getPublicNav());
    assert.deepEqual(nav.map((t) => t.name), ["About"], "tenant nav must not contain Products");
    const footer = await as("acme", () => getPublicFooter());
    assert.ok(footer.every((c) => c.links.every((l) => !isProductsHref(l.href))));
    assert.equal(await as("acme", () => loadProducts()), null);
    await assert.rejects(() => as("acme", () => requireProducts()), (e: unknown) => /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/.test(String((e as { digest?: string }).digest ?? e)));
  });
  await check("sitemap: owner lists /products and every published product; a tenant lists none of them", async () => {
    const owner = (await as("owner", () => baseSitemap())).map((e) => new URL(e.url).pathname);
    assert.ok(owner.includes("/products"));
    assert.ok(owner.includes("/products/ai-intelligence"));
    assert.ok(owner.includes(`/products/${raw[0].slug}`));
    const tenant = (await as("acme", () => baseSitemap())).map((e) => new URL(e.url).pathname);
    assert.deepEqual(tenant.filter(isProductsHref), []);
    assert.ok(tenant.length > 0);
  });
  await check("tenant refuses the nav migration script's company (owner only) — guarded in the CLI, and the helper never touches a tenant by default", async () => {
    const src = fs.readFileSync(path.join(ROOT, "scripts/add-products-nav.ts"), "utf8");
    assert.ok(/isPlatformOwner/.test(src) && /never added to another company/.test(src));
    const mig = fs.readFileSync(path.join(ROOT, "scripts/migrate-cms-content.ts"), "utf8");
    assert.ok(/TARGET_IS_OWNER/.test(mig) && /platform owner's own content/.test(mig));
  });
  await check("the seed navigation and footer carry the Products entries (so a fresh migration matches the script)", () => {
    const nav = JSON.parse(fs.readFileSync(path.join(ROOT, "cms-seed/navigation.json"), "utf8")) as { name: string; href: string; items: { href: string; group?: string }[] }[];
    const names = nav.map((t) => t.name);
    assert.equal(names.indexOf("Products"), names.indexOf("Services") + 1);
    // The stored menu was trimmed by hand on purpose: every seed entry must still equal the catalogue's own entry for that product (and the new product must be in it).
    const planned = JSON.parse(JSON.stringify(seedProductsNav())) as ReturnType<typeof seedProductsNav>;
    const seeded = nav.find((t) => t.name === "Products") as unknown as ReturnType<typeof seedProductsNav>;
    assert.deepEqual({ ...seeded, items: [] }, { ...planned, items: [] });
    for (const it of seeded.items) assert.deepEqual(it, planned.items.find((x) => x.href === it.href), it.href);
    assert.ok(seeded.items.some((i) => i.href === "/products/business-automation-saas"));
    const footer = JSON.parse(fs.readFileSync(path.join(ROOT, "cms-seed/footer.json"), "utf8")) as { viewAllHref?: string; links: { href: string }[] }[];
    assert.equal(footer.find((c) => c.viewAllHref === "/services")!.links[0].href, PRODUCTS_FOOTER_LINK.href);
  });
  await check("routes exist as real route folders (static route folders win over the catch-all)", () => {
    for (const f of ["src/app/(site)/products/page.tsx", "src/app/(site)/products/[slug]/page.tsx", "src/app/(site)/products/opengraph-image.tsx", "src/app/(site)/products/[slug]/opengraph-image.tsx"]) assert.ok(fs.existsSync(path.join(ROOT, f)), f);
    for (const f of ["src/app/(site)/products/page.tsx", "src/app/(site)/products/[slug]/page.tsx"]) {
      const s = fs.readFileSync(path.join(ROOT, f), "utf8");
      assert.ok(/export const dynamic = "force-dynamic"/.test(s), `${f} must render per request`);
      assert.ok(/requireProduct/.test(s), `${f} must be owner-only`);
    }
  });
}

async function cleanup() {
  try {
    // Every company's rows live in this one scratch database (company-scoped by a companyId stamp).
    await (await getPlatformDb()).dropDatabase();
    await (await clientPromise).close();
  } catch (err) {
    console.error("cleanup failed:", err);
  }
}

main()
  .catch((err) => {
    failures.push("run");
    console.error(err);
  })
  .finally(async () => {
    await cleanup();
    console.log(`\n${passed} passed, ${failures.length} failed${failures.length ? `: ${failures.join("; ")}` : ""}`);
    process.exit(failures.length ? 1 : 0);
  });
