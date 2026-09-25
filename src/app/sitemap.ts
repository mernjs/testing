import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { siteUrl } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";
import { jobs } from "@/app/(site)/careers/jobs-data";
import { getSeoSiteState } from "@/lib/seo-panel/public";

const APP_DIR = path.join(process.cwd(), "src/app/(site)");

// Routes that physically exist as a page but are deliberately kept out of the
// sitemap because the page itself sets `robots: { index: false }` (duplicate
// content, canonicalized elsewhere). Keep this list in sync with any future
// noindex pages — everything else under src/app/(site) is picked up
// automatically, so a new page can never be silently left out again.
const EXCLUDED_ROUTES = new Set<string>([
  "/services/prediction-forecasting", // duplicate of /services/prediction-and-forecasting, noindex
  "/ask", // AI chatbot page — thin app shell, sets robots: { index: false }
  // Team & leadership pages — unlinked from the site nav, reachable by direct URL only.
  "/about/our-team",
  "/about/leadership",
  "/about/co-founder-ceo",
  "/about/co-founder-coo",
  "/about/cto",
  "/about/cfo",
  "/about/chro",
  // Products pages — unlinked from the site nav, reachable by direct URL only.
  "/products",
  "/products/ai-construction-platform",
  "/products/ai-job-board-portal",
  "/products/ai-voice-assistant",
  "/products/image-recognition-system",
  "/products/predictive-analytics-engine",
  "/products/smart-spam-filter",
  // Policy pages — unlinked from the visible site, noindex.
  "/about/privacy-policy",
  "/about/terms-and-conditions",
  "/about/refund-cancellation-policy",
  "/about/acceptable-use-policy",
]);

/** Recursively finds every route that has a page.tsx under the (site) route group. */
function discoverRoutes(dir: string, base = ""): string[] {
  const routes: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  if (entries.some((entry) => entry.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(entry.name))) {
    routes.push(base === "" ? "/" : base);
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("_")) continue; // private folders, e.g. _components
    if (entry.name.startsWith("[")) continue; // dynamic segments aren't used in this app; skip defensively
    const isRouteGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
    const nextBase = isRouteGroup ? base : `${base}/${entry.name}`;
    routes.push(...discoverRoutes(path.join(dir, entry.name), nextBase));
  }

  return routes;
}

/** The code-defined sitemap: every discovered public route. Also used as the chatbot knowledge-base crawl list. */
export function baseSitemap(): MetadataRoute.Sitemap {
  const blogDates = new Map(blogPosts.map((post) => [`/blog/${post.slug}`, post.date]));
  const jobMap = new Map(jobs.map((job) => [`/careers/${job.slug}`, job]));

  // Dynamically filter out draft, closed, or expired job postings from sitemap
  const excludedJobRoutes = new Set(
    jobs
      .filter((job) => job.status === "draft" || job.status === "closed" || job.status === "expired")
      .map((job) => `/careers/${job.slug}`)
  );

  const routes = discoverRoutes(APP_DIR)
    .filter((route) => !EXCLUDED_ROUTES.has(route) && !excludedJobRoutes.has(route))
    .sort();

  return routes.map((route) => {
    const blogDate = blogDates.get(route);
    const job = jobMap.get(route);

    let lastModified = new Date();
    if (blogDate) {
      lastModified = new Date(blogDate);
    } else if (job && job.datePosted) {
      lastModified = new Date(job.datePosted);
    }

    return {
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency: blogDate ? "monthly" : job ? "weekly" : "weekly",
      priority: route === "/" ? 1 : blogDate ? 0.6 : job ? 0.7 : 0.7,
    };
  });
}

/**
 * The served sitemap: the code-defined routes with the SEO panel's per-page
 * settings applied (/seo/sitemap, /seo/pages) — pages excluded there, or
 * set to noindex, are dropped; priority / change frequency overrides win.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = baseSitemap();
  const { sitemap: overrides, overrides: meta } = await getSeoSiteState();
  const out: MetadataRoute.Sitemap = [];
  for (const entry of entries) {
    const path = new URL(entry.url).pathname || "/";
    const o = overrides[path];
    if (o?.exclude || meta[path]?.robots?.index === false) continue;
    out.push({
      ...entry,
      ...(o?.priority !== undefined ? { priority: o.priority } : {}),
      ...(o?.changeFrequency ? { changeFrequency: o.changeFrequency } : {}),
    });
  }
  return out;
}
