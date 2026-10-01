/**
 * Captures REAL screenshots of each product's key screens for the Products pages.
 *
 * Run it against a running app that holds DEMO data (never real customer data: what it sees is what gets
 * published). Typically a demo-seeded production build:
 *
 *   BASE_URL=http://localhost:3006 \
 *   SHOT_EMAIL=owner@demo.test SHOT_PASSWORD='…' \
 *   node scripts/capture-product-screenshots.mjs [--only hrms-suite,pms-project-command] [--mobile] [--config my-screens.json] [--dry-run]
 *
 * What it does:
 *   1. Signs in at /workspace/login (the Workspace session is accepted by every panel) with the given credentials.
 *   2. Opens each configured screen at 1440x900 (and, with --mobile, 390x844), waits for it to settle and captures it.
 *   3. Converts each capture with `sharp` to webp, lowering quality until the file is <= MAX_KB (default 120).
 *   4. Writes public/products/<slug>/<n>.webp (mobile: <n>-m.webp) and public/products/manifest.json:
 *        { "<slug>": [{ "src": "/products/<slug>/1.webp", "alt": "...", "caption": "..." }] }
 *      The Products pages import that manifest and show the gallery for products whose CMS record has no
 *      screenshots of its own — no code change is needed, only a rebuild/redeploy of the app.
 *
 * Options / environment:
 *   BASE_URL      the app to capture (default http://localhost:3000)
 *   SHOT_EMAIL / SHOT_PASSWORD   a user that can open the panels (a Super Admin of a demo company is simplest)
 *   --only a,b    only these product slugs
 *   --mobile      also write a phone-width variant (<n>-m.webp); the manifest lists the desktop images
 *   --config f    JSON { "<slug>": [{ "path": "/hrms", "alt": "...", "caption": "...", "waitFor": "css selector", "hide": ["css selector"] }] }
 *                 replacing the built-in list for those slugs
 *   --dry-run     print what would be captured; sign in nothing, write nothing
 *   MAX_KB        size budget per image (default 120)
 *   ALLOW_NON_LOCAL=1   required to run against a host other than localhost/127.0.0.1/*.localhost (a safety check
 *                       so real data is never captured by accident)
 *
 * Needs `playwright` (Chrome channel) and `sharp`, both already in node_modules. The external Client Portal has
 * its own sign-in and is not captured by default; add it through --config if you have a demo portal login.
 * Do not commit captures of real data.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};

const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const EMAIL = process.env.SHOT_EMAIL;
const PASSWORD = process.env.SHOT_PASSWORD;
const MAX_KB = Number(process.env.MAX_KB || 120);
const OUT = path.resolve("public/products");
const MOBILE = flag("--mobile");
const DRY = flag("--dry-run");

/** Built-in screens: real routes of each product's panel. Alt text and captions describe what the screen shows. */
const SCREENS = {
  "admin-command-center": [
    { path: "/workspace", alt: "Company dashboard with open leads, active projects, tasks due, unpaid invoices and recent activity", caption: "The company dashboard: live figures from the products you use." },
    { path: "/workspace/users", alt: "User management with roles and panel access", caption: "Users, roles and panel access in one place." },
  ],
  "staff-hub": [
    { path: "/workspace", alt: "Workspace home with the products this person can open", caption: "One home for every product." },
    { path: "/workspace/settings/automations", alt: "Automations list with ready-made templates", caption: "Automations on company events." },
  ],
  "ai-intelligence": [{ path: "/intelligence", alt: "AI Intelligence chat with example questions", caption: "Ask a question in plain language." }],
  "aibots-studio": [{ path: "/aibots/bots", alt: "Catalogue of AI assistants", caption: "AI assistants with their own knowledge bases." }],
  "hrms-suite": [
    { path: "/hrms", alt: "HR dashboard", caption: "HR dashboard." },
    { path: "/hrms/employees", alt: "Employee directory", caption: "Employee records." },
    { path: "/hrms/payroll", alt: "Payroll runs by month", caption: "Payroll runs." },
  ],
  "pms-project-command": [
    { path: "/pms", alt: "Projects dashboard", caption: "Projects dashboard." },
    { path: "/pms/projects", alt: "Project list", caption: "Projects and their status." },
    { path: "/pms/costing", alt: "Project costing", caption: "Estimated versus actual cost." },
  ],
  "fms-finance": [
    { path: "/fms", alt: "Finance dashboard", caption: "Finance dashboard." },
    { path: "/fms/invoices", alt: "Invoice list", caption: "Invoices and collections." },
    { path: "/fms/reports/profit-and-loss", alt: "Profit and loss report", caption: "Profit and loss." },
  ],
  "prms-procurement": [
    { path: "/prms", alt: "Procurement dashboard", caption: "Procurement dashboard." },
    { path: "/prms/requisitions", alt: "Requisitions with approval status", caption: "Requisitions and approvals." },
    { path: "/prms/assets", alt: "Asset register", caption: "Asset register." },
  ],
  "lms-sales-crm": [
    { path: "/lms", alt: "CRM dashboard", caption: "CRM dashboard." },
    { path: "/lms/leads/list", alt: "Lead list", caption: "Leads and their stage." },
    { path: "/lms/chatbot", alt: "Website assistant overview", caption: "The website assistant." },
  ],
  "tms-academy": [
    { path: "/tms", alt: "Training dashboard", caption: "Training dashboard." },
    { path: "/tms/batches", alt: "Batches", caption: "Programs and batches." },
  ],
  "ots-exam-engine": [
    { path: "/ots", alt: "Online tests overview", caption: "Online tests overview." },
    { path: "/ots/tests", alt: "Test list", caption: "Tests and assignments." },
  ],
  "messenger-yashchat": [{ path: "/messenger", alt: "Team chat", caption: "Team chat." }],
  "sop-policies": [
    { path: "/sop", alt: "SOP overview", caption: "SOP overview." },
    { path: "/sop/library", alt: "Policy library", caption: "The policy library." },
  ],
  "dlms-digilocker": [
    { path: "/dlms", alt: "Digi Locker overview", caption: "Digi Locker overview." },
    { path: "/dlms/expiry", alt: "Expiring credentials and documents", caption: "Expiry tracking." },
  ],
  "seo-panel": [
    { path: "/seo/overview", alt: "SEO overview", caption: "SEO overview." },
    { path: "/seo/audit", alt: "Site audits", caption: "Site audits." },
  ],
  "smms-social-engine": [
    { path: "/smms", alt: "Social media overview", caption: "Social media overview." },
    { path: "/smms/posts", alt: "Posts", caption: "Posts and approvals." },
  ],
  "cms-website": [
    { path: "/cms/pages", alt: "Website pages", caption: "Website pages." },
    { path: "/cms/theme", alt: "Theme", caption: "Theme and branding." },
  ],
  "web-portal": [{ path: "/", public: true, alt: "The public website home page", caption: "The public website." }],
};

const isLocal = (u) => /^(localhost|127\.0\.0\.1|[^.]+\.localhost)$/.test(new URL(u).hostname);
if (!isLocal(BASE) && process.env.ALLOW_NON_LOCAL !== "1") {
  console.error(`Refusing to capture ${BASE}: it is not a local address, so it may hold real data. Set ALLOW_NON_LOCAL=1 only for a demo environment.`);
  process.exit(2);
}

const only = opt("--only")?.split(",").map((s) => s.trim()).filter(Boolean);
let screens = { ...SCREENS };
if (opt("--config")) screens = { ...screens, ...JSON.parse(await fs.readFile(opt("--config"), "utf8")) };
const slugs = Object.keys(screens).filter((s) => !only || only.includes(s));
if (!slugs.length) {
  console.error("Nothing to capture (check --only).");
  process.exit(2);
}

if (DRY) {
  for (const s of slugs) for (const [i, sc] of screens[s].entries()) console.log(`${s}/${i + 1}${MOBILE ? " (+mobile)" : ""}  ${BASE}${sc.path}`);
  process.exit(0);
}
if (!EMAIL || !PASSWORD) {
  console.error("Set SHOT_EMAIL and SHOT_PASSWORD (a demo user that can open the panels).");
  process.exit(2);
}

/** webp under the size budget: lower the quality until it fits (floor 40), then shrink the width. */
async function toWebp(png, width) {
  let w = width;
  for (;;) {
    for (let q = 82; q >= 40; q -= 6) {
      const buf = await sharp(png).resize({ width: w, withoutEnlargement: true }).webp({ quality: q, effort: 5 }).toBuffer();
      if (buf.length <= MAX_KB * 1024) return buf;
    }
    w = Math.round(w * 0.85);
    if (w < 480) throw new Error("cannot fit the size budget");
  }
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const manifestPath = path.join(OUT, "manifest.json");
let manifest = {};
try {
  manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
} catch {
  /* first run */
}
const failures = [];

async function capture(context, sc, viewport) {
  const page = await context.newPage();
  try {
    await page.setViewportSize(viewport);
    await page.goto(`${BASE}${sc.path}`, { waitUntil: "networkidle", timeout: 60_000 });
    if (sc.waitFor) await page.waitForSelector(sc.waitFor, { timeout: 20_000 });
    for (const sel of sc.hide ?? []) await page.addStyleTag({ content: `${sel}{visibility:hidden!important}` });
    // Calm the page: no animations, no caret/scrollbars, the offers strip and chat buttons out of the shot.
    await page.addStyleTag({ content: "*{animation:none!important;transition:none!important;caret-color:transparent!important}::-webkit-scrollbar{display:none}" });
    await page.waitForTimeout(800);
    return await page.screenshot({ type: "png" });
  } finally {
    await page.close();
  }
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const phone = MOBILE ? await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true }) : null;
  for (const ctx of [desktop, phone].filter(Boolean)) {
    if (slugs.every((s) => screens[s].every((x) => x.public))) continue;
    const p = await ctx.newPage();
    await p.goto(`${BASE}/workspace/login`);
    await p.fill('input[name="email"]', EMAIL);
    await p.fill('input[name="password"]', PASSWORD);
    await Promise.all([p.waitForURL((u) => !u.pathname.endsWith("/login"), { timeout: 60_000 }), p.press('input[name="password"]', "Enter")]);
    // A company whose setup is still open lands in the wizard first; skipping it is the way into the dashboard.
    if (new URL(p.url()).pathname === "/workspace/onboarding") {
      await Promise.all([p.waitForURL((u) => u.pathname === "/workspace", { timeout: 30_000 }), p.getByRole("button", { name: "Skip for now" }).click()]);
    }
    await p.close();
  }

  for (const slug of slugs) {
    const dir = path.join(OUT, slug);
    const entries = [];
    for (const [i, sc] of screens[slug].entries()) {
      const n = i + 1;
      try {
        const png = await capture(desktop, sc, { width: 1440, height: 900 });
        const buf = await toWebp(png, 1440);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, `${n}.webp`), buf);
        entries.push({ src: `/products/${slug}/${n}.webp`, alt: sc.alt, caption: sc.caption });
        console.log(`  ✓ ${slug}/${n}.webp  ${(buf.length / 1024).toFixed(0)} KB  ${sc.path}`);
        if (phone) {
          const mbuf = await toWebp(await capture(phone, sc, { width: 390, height: 844 }), 780);
          await fs.writeFile(path.join(dir, `${n}-m.webp`), mbuf);
          console.log(`  ✓ ${slug}/${n}-m.webp  ${(mbuf.length / 1024).toFixed(0)} KB`);
        }
      } catch (err) {
        failures.push(`${slug}${sc.path}`);
        console.log(`  ✗ ${slug} ${sc.path}: ${err instanceof Error ? err.message.split("\n")[0] : err}`);
      }
    }
    if (entries.length) manifest[slug] = entries;
  }
  await fs.mkdir(OUT, { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 1)}\n`);
  console.log(`\nManifest written: ${path.relative(process.cwd(), manifestPath)} (${Object.keys(manifest).length} products)`);
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(`\n${failures.length} capture(s) failed: ${failures.join(", ")}`);
  process.exit(1);
}
