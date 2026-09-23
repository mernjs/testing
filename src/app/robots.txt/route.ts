import { getSeoSiteState } from "@/lib/seo-panel/public";
import { DEFAULT_ROBOTS_TXT } from "@/lib/seo-panel/robots-parse";

/**
 * robots.txt is managed in the SEO panel (/seo/robots). Until a version is
 * published there, this serves exactly what the old code-defined robots.ts
 * produced. The content is cached under the SEO site tag, so a publish from
 * the panel reaches the live file without a deploy.
 */
export async function GET() {
  const { robotsTxt } = await getSeoSiteState();
  return new Response(robotsTxt ?? DEFAULT_ROBOTS_TXT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
