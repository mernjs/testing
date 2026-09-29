import { getSeoSiteState } from "@/lib/seo-panel/public";
import { defaultRobots } from "@/lib/seo-panel/robots-store";

/**
 * robots.txt is managed in the SEO panel (/seo/robots), per company. Until a
 * version is published there, this serves the code default (`defaultRobots()`:
 * for the platform owner exactly what the old code-defined robots.ts produced,
 * for any other company the same rules pointing at its own sitemap). The content is cached under the SEO site tag, so a publish from
 * the panel reaches the live file without a deploy.
 */
export async function GET() {
  const { robotsTxt } = await getSeoSiteState();
  return new Response(robotsTxt ?? (await defaultRobots()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
