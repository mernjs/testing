/**
 * End-to-end check of the Products section against a RUNNING production build:
 * the header menu, /products, every /products/<slug>, the demo form, JSON-LD, the sitemap, mobile layout
 * on the platform owner's site, and that a tenant's site gets none of it.
 *
 *   OWNER_BASE_URL=http://localhost:3006 \
 *   TENANT_BASE_URL=http://acme.localhost:3006 \
 *     node scripts/e2e/products.e2e.mjs
 *
 * OWNER_BASE_URL  = a host that routes to the platform-owner company (its products collection must be migrated:
 *                   `npm run db:migrate-cms-content -- --apply`, then scripts/add-products-nav.ts --apply).
 * TENANT_BASE_URL = a host of any other company (e.g. a company created with scripts/create-company.ts).
 * The demo form's validation is exercised with an EMPTY submit only (the API answers 422), so no lead is created.
 * Company hosts are reached through the browser (Node cannot resolve *.localhost).
 */

import assert from "node:assert/strict";
import { chromium } from "playwright";

const OWNER = process.env.OWNER_BASE_URL?.replace(/\/$/, "");
const TENANT = process.env.TENANT_BASE_URL?.replace(/\/$/, "");
if (!OWNER || !TENANT) {
  console.error("Set OWNER_BASE_URL and TENANT_BASE_URL.");
  process.exit(1);
}

let passed = 0;
const failures = [];
async function check(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures.push(name);
    console.log(`  ✗ ${name}\n      ${err instanceof Error ? err.message.split("\n").slice(0, 4).join("\n      ") : String(err)}`);
  }
}

const SECTIONS = ["problem", "overview", "features", "ai", "automation", "use-cases", "benefits", "audience", "integrations", "tour", "faqs", "related", "demo"];

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
  const errors = [];
  const newPage = async () => {
    const p = await context.newPage();
    p.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    p.on("console", (m) => {
      // A 404 from a deliberately missing asset is not a script error; real script errors are.
      if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(`console: ${m.text()}`);
    });
    return p;
  };
  const status = async (url) => {
    const p = await context.newPage();
    try {
      const res = await p.goto(url, { waitUntil: "domcontentloaded" });
      return { status: res.status(), body: await res.text() };
    } finally {
      await p.close();
    }
  };

  // ── owner: header ──────────────────────────────────────────────────────
  console.log(`owner (${OWNER})`);
  const page = await newPage();
  await page.goto(`${OWNER}/`, { waitUntil: "domcontentloaded" });

  let slugs = [];
  await check("/products lists every product with a working card link", async () => {
    const res = await page.goto(`${OWNER}/products`, { waitUntil: "domcontentloaded" });
    assert.equal(res.status(), 200);
    await page.waitForSelector("#products article");
    const links = await page.$$eval("#products article h4 a, #products article h3 a", (as) => as.map((a) => a.getAttribute("href")));
    slugs = [...new Set(links.map((h) => h.replace("/products/", "")))];
    assert.ok(slugs.length >= 19, `expected the full catalogue, found ${slugs.length}`);
    assert.ok(slugs.includes("ai-intelligence"), "AI Intelligence missing");
    for (const must of ["hrms-suite", "fms-finance", "sop-policies", "cms-website", "staff-hub"]) assert.ok(slugs.includes(must), `${must} missing`);
    // every card is clickable as a whole (the title link covers it) and "Explore Product" is shown
    assert.equal(await page.locator("#products article", { hasText: "Explore Product" }).count(), slugs.length);
    // filter tabs narrow the grid and "All products" restores it
    await page.getByRole("button", { name: "AI & Intelligence" }).click();
    const some = await page.locator("#products article").count();
    assert.ok(some >= 2 && some < slugs.length, `filter showed ${some}`);
    await page.getByRole("button", { name: "All products" }).click();
    assert.equal(await page.locator("#products article").count(), slugs.length);
  });

  await check("/products has the hero CTAs, the connected-platform and AI sections and the demo form", async () => {
    await page.goto(`${OWNER}/products`, { waitUntil: "domcontentloaded" });
    assert.equal(await page.getByRole("link", { name: "Get Started" }).first().getAttribute("href"), "/signup");
    assert.equal(await page.getByRole("link", { name: "Request Demo" }).first().getAttribute("href"), "#demo");
    assert.ok(await page.getByText("One connected platform").first().isVisible());
    assert.ok(await page.getByText("AI where the work happens").first().isVisible());
    assert.ok(await page.locator("#demo form").count());
    assert.equal(await page.locator("h1").count(), 1);
  });

  await check("header: the desktop Products menu lists the products (incl. AI Intelligence) under category headings", async () => {
    await page.goto(`${OWNER}/`, { waitUntil: "domcontentloaded" });
    const nav = page.locator('header nav[aria-label="Global"]');
    const item = nav.getByRole("link", { name: "Products", exact: true });
    await item.hover();
    const menu = page.locator("header").getByRole("link", { name: /AI Intelligence/ }).first();
    await menu.waitFor({ state: "visible", timeout: 10_000 });
    assert.equal(await menu.getAttribute("href"), "/products/ai-intelligence");
    assert.ok(await page.locator("header").getByText("AI & Intelligence", { exact: true }).first().isVisible(), "category heading missing");
    assert.ok(await page.locator("header").getByRole("link", { name: /View all products/i }).first().isVisible());
    const count = await page.locator('header a[href^="/products/"]').count();
    assert.ok(count >= 19, `menu lists ${count} products`);
    // Services and About are still there
    for (const n of ["Services", "About"]) assert.ok(await nav.getByRole("link", { name: n, exact: true }).count(), `${n} nav item gone`);
  });

  await check("header: the mobile menu has Products with the products listed", async () => {
    const m = await newPage();
    await m.setViewportSize({ width: 390, height: 844 });
    await m.goto(`${OWNER}/`, { waitUntil: "domcontentloaded" });
    await m.getByRole("button", { name: "Open main menu" }).click();
    await m.getByRole("button", { name: "Products", exact: true }).click();
    const link = m.getByRole("link", { name: "AI Intelligence" }).first();
    await link.waitFor({ state: "visible", timeout: 10_000 });
    assert.equal(await link.getAttribute("href"), "/products/ai-intelligence");
    assert.ok(await m.getByRole("link", { name: /View All Products/i }).first().isVisible());
    await m.close();
  });

  // ── owner: every product page ─────────────────────────────────────────
  console.log("product pages");
  for (const slug of slugs) {
    await check(`/products/${slug}: 200, sections, CTAs, JSON-LD, images`, async () => {
      const p = await newPage();
      try {
        const res = await p.goto(`${OWNER}/products/${slug}`, { waitUntil: "domcontentloaded" });
        assert.equal(res.status(), 200);
        assert.equal(await p.locator("h1").count(), 1, "exactly one h1");
        assert.ok((await p.locator("h1").innerText()).trim().length > 2);
        const missing = [];
        for (const id of SECTIONS) if (!(await p.locator(`#${id}`).count())) missing.push(id);
        assert.deepEqual(missing, [], `sections missing: ${missing.join(", ")}`);
        // breadcrumb back to Products
        assert.equal(await p.locator('nav[aria-label="Breadcrumb"] a[href="/products"]').count(), 1);
        // CTAs: Get Started -> /signup, Request Demo -> the demo form, Start Using -> the workspace sign-in with next
        const hero = p.locator("section").first();
        assert.equal(await hero.getByRole("link", { name: "Get Started" }).getAttribute("href"), "/signup");
        assert.equal(await hero.getByRole("link", { name: "Request Demo" }).getAttribute("href"), "#demo");
        const start = hero.getByRole("link", { name: "Start Using" });
        if (slug === "web-portal") assert.equal(await start.count(), 0, "the public website has no panel to sign in to");
        else assert.match(await start.getAttribute("href"), /^\/workspace\/login\?next=%2F/);
        // JSON-LD present, parseable, with the right types
        const blocks = await p.$$eval('script[type="application/ld+json"]', (ss) => ss.map((s) => s.textContent));
        const types = blocks.map((b) => JSON.parse(b)["@type"]);
        assert.ok(types.includes("SoftwareApplication") && types.includes("BreadcrumbList"), `JSON-LD types: ${types}`);
        const app = blocks.map((b) => JSON.parse(b)).find((j) => j["@type"] === "SoftwareApplication");
        assert.ok(app.url.startsWith(OWNER) || app.url.startsWith("https://"), app.url);
        assert.equal("offers" in app, false);
        // canonical + og
        assert.match((await p.locator('link[rel="canonical"]').getAttribute("href")) ?? "", new RegExp(`/products/${slug}$`));
        assert.ok(await p.locator('meta[property="og:image"]').count(), "og:image missing");
        // scroll through so lazy images load, then no broken <img>
        await p.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 40));
          }
          window.scrollTo(0, 0);
        });
        await p.waitForTimeout(400);
        const broken = await p.$$eval("img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc));
        assert.deepEqual(broken, [], "broken images");
      } finally {
        await p.close();
      }
    });
  }

  await check("the Request Demo form renders, validates (empty submit -> field errors, no lead created) and the select lists the products", async () => {
    const p = await newPage();
    await p.goto(`${OWNER}/products/ai-intelligence`, { waitUntil: "domcontentloaded" });
    const form = p.locator("#demo-form");
    await form.scrollIntoViewIfNeeded();
    assert.equal(await form.locator("#demo-product").inputValue(), "AI Intelligence — Your AI Data Analyst", "the page's product is preselected");
    assert.ok((await form.locator("#demo-product option").count()) > slugs.length);
    await form.getByRole("button", { name: /Request demo/i }).click();
    await p.getByText("Name is required.").waitFor({ timeout: 15_000 });
    assert.ok(await p.getByText("Email is required.").isVisible());
    assert.ok(await p.getByText("Phone number is required.").isVisible());
    await p.close();
  });

  await check("Start Using leads to the workspace sign-in, carrying the product's panel", async () => {
    const p = await newPage();
    await p.goto(`${OWNER}/products/hrms-suite`, { waitUntil: "domcontentloaded" });
    await p.locator("section").first().getByRole("link", { name: "Start Using" }).click();
    await p.waitForURL(/\/workspace\/login/, { timeout: 30_000 });
    assert.equal(new URL(p.url()).searchParams.get("next"), "/hrms");
    await p.close();
  });

  await check("Get Started leads to the sign-up page", async () => {
    const p = await newPage();
    await p.goto(`${OWNER}/products/hrms-suite`, { waitUntil: "domcontentloaded" });
    await p.locator("section").first().getByRole("link", { name: "Get Started" }).click();
    await p.waitForURL(/\/signup/, { timeout: 30_000 });
    await p.close();
  });

  await check("/products JSON-LD: ItemList of every product + BreadcrumbList", async () => {
    await page.goto(`${OWNER}/products`, { waitUntil: "domcontentloaded" });
    const lds = (await page.$$eval('script[type="application/ld+json"]', (ss) => ss.map((s) => s.textContent))).map((t) => JSON.parse(t));
    const list = lds.find((j) => j["@type"] === "ItemList");
    assert.ok(list, "ItemList missing");
    assert.equal(list.itemListElement.length, slugs.length);
    assert.ok(lds.some((j) => j["@type"] === "BreadcrumbList"));
  });

  await check("sitemap.xml contains /products and every product page", async () => {
    const res = await status(`${OWNER}/sitemap.xml`);
    assert.equal(res.status, 200);
    const locs = [...res.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    assert.ok(locs.includes("/products"));
    const missing = slugs.filter((s) => !locs.includes(`/products/${s}`));
    assert.deepEqual(missing, []);
  });

  await check("an unknown product slug is a 404", async () => {
    assert.equal((await status(`${OWNER}/products/not-a-product`)).status, 404);
  });

  await check("existing URLs still work: the catalogue page and the services page", async () => {
    assert.equal((await status(`${OWNER}/services/our-saas-product`)).status, 200);
    assert.equal((await status(`${OWNER}/services`)).status, 200);
  });

  await check("390px: no horizontal scroll on /products and on a product page", async () => {
    const m = await newPage();
    await m.setViewportSize({ width: 390, height: 844 });
    for (const url of [`${OWNER}/products`, `${OWNER}/products/hrms-suite`, `${OWNER}/products/ai-intelligence`]) {
      await m.goto(url, { waitUntil: "networkidle" });
      const { sw, cw } = await m.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      assert.ok(sw <= cw + 1, `${url}: scrollWidth ${sw} > clientWidth ${cw}`);
    }
    await m.close();
  });

  await check("no page errors on any page visited", () => {
    assert.deepEqual(errors, []);
  });

  // ── tenant ─────────────────────────────────────────────────────────────
  console.log(`tenant (${TENANT})`);
  const t = await newPage();
  await t.goto(`${TENANT}/`, { waitUntil: "domcontentloaded" });
  // The tenant's own site is served; fetch from inside the page (Node cannot resolve *.localhost).
  const tenantStatus = (path) => t.evaluate(async (p) => (await fetch(p, { redirect: "manual" })).status, path);
  const tenantText = (path) => t.evaluate(async (p) => (await fetch(p)).text(), path);

  await check("the tenant's header has no Products item or product links", async () => {
    await t.goto(`${TENANT}/`, { waitUntil: "networkidle" });
    assert.equal(await t.locator('header a[href="/products"], header a[href^="/products/"]').count(), 0);
    assert.equal(await t.locator('header').getByText("AI Intelligence", { exact: true }).count(), 0);
    assert.equal(await t.locator('footer a[href="/products"]').count(), 0);
  });
  await check("/products and every /products/<slug> are 404 on the tenant", async () => {
    assert.equal(await tenantStatus("/products"), 404);
    const notFound = [];
    for (const s of slugs) if ((await tenantStatus(`/products/${s}`)) !== 404) notFound.push(s);
    assert.deepEqual(notFound, []);
    assert.equal(await tenantStatus("/products/opengraph-image"), 404);
  });
  await check("the tenant's sitemap lists no Products URLs", async () => {
    const xml = await tenantText("/sitemap.xml");
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    assert.ok(locs.length > 0);
    assert.deepEqual(locs.filter((p) => p === "/products" || p.startsWith("/products/")), []);
  });
  await check("the tenant's own pages still work", async () => {
    assert.equal(await tenantStatus("/"), 200);
  });
} finally {
  await browser.close();
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
