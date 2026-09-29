import CmsPageView from "@/components/cms/CmsPageView";
import { cmsPageMetadata, requirePublicPage } from "@/lib/cms/page-route";
import { listPublishedPaths } from "@/lib/cms/public";

/**
 * Every CMS page without a dedicated route — i.e. almost the whole site, and
 * any new page created in the CMS. The page's content, SEO and structured
 * data all come from the CMS (see src/lib/cms/public.ts); routes that need
 * request data (/login, /contact, …) have their own route files and take
 * precedence over this one.
 */

type Props = { params: Promise<{ slug: string[] }> };

const pathOf = (slug: string[]) => `/${slug.map(decodeURIComponent).join("/")}`;

/** Pre-render every published page served by this route; pages published later render on first request. */
export async function generateStaticParams() {
  const dedicated = /^\/(login|register|contact|careers\/apply|services\/our-saas-product|offers|rewards|ask)$/;
  try {
    return (await listPublishedPaths()).filter((p) => p !== "/" && !dedicated.test(p)).map((p) => ({ slug: p.slice(1).split("/") }));
  } catch {
    return []; // CMS unreachable at build time — pages render on first request instead
  }
}

export async function generateMetadata({ params }: Props) {
  return cmsPageMetadata(pathOf((await params).slug));
}

export default async function CmsCatchAllPage({ params }: Props) {
  const page = await requirePublicPage(pathOf((await params).slug));
  return <CmsPageView page={page} />;
}
