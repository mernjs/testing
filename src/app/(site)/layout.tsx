import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FooterCompact from "@/components/FooterCompact";
import { ThemeVariantsProvider } from "@/components/cms/ThemeVariantsContext";
import { CollectionsProvider } from "@/components/cms/CollectionsContext";
import { getSnapshot } from "@/lib/cms/collections/store";
import { Toaster } from "@/components/ui/sonner";
import OfferPromotions from "@/components/offers/OfferPromotions";
import ReferralWelcome from "@/components/offers/ReferralWelcome";
import OfferClaimProvider from "@/components/offers/OfferClaimProvider";
import ManagedJsonLd from "@/components/seo/ManagedJsonLd";
import { getSeoSiteState } from "@/lib/seo-panel/public";
import { getPublicNav } from "@/lib/cms/nav";
import { getPublicFooter } from "@/lib/cms/footer";
import { themeCssBlock } from "@/lib/cms/theme";
import { resolveSiteThemeState } from "@/lib/cms/theme-preview";
import ThemePreviewBridge from "@/components/cms/theme/ThemePreviewBridge";
import { getSiteInfo } from "@/lib/cms/site-info";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ schemas }, cmsNavigation, cmsFooter, { tokens: theme, components, preview }, collections, siteInfo] = await Promise.all([
    getSeoSiteState(),
    getPublicNav(),
    getPublicFooter(),
    // The active theme — or, for a CMS user in the theme customizer, the theme being previewed.
    resolveSiteThemeState(),
    // Blog posts, jobs and engagement models (code + published CMS records) for every client listing/card.
    getSnapshot(["blog", "jobs", "engagement"]),
    getSiteInfo(),
  ]);
  // Header/footer variant chosen by the active theme in the CMS (component-variants.ts); "default" = the standard components.
  const SiteFooter = components.footer === "compact" ? FooterCompact : Footer;
  return (
    <OfferClaimProvider>
      {/* Overrides globals.css's :root/.dark custom properties — CSS cascade (later tag wins) does the rest, no globals.css change needed. */}
      <style id="cms-theme-vars" dangerouslySetInnerHTML={{ __html: themeCssBlock(theme) }} />
      <ManagedJsonLd schemas={schemas} />
      <OfferPromotions />
      <ReferralWelcome />
      <Header cmsNavigation={cmsNavigation} variant={components.header === "menu" ? "menu" : "default"} />
      <main className="flex-grow pt-[calc(88px+var(--offer-strip-h,0px))]">
        <CollectionsProvider snapshot={collections}>
          <ThemeVariantsProvider sections={components.sections}>{children}</ThemeVariantsProvider>
        </CollectionsProvider>
      </main>
      <SiteFooter cmsFooter={cmsFooter} siteInfo={siteInfo} />
      <Toaster position="top-right" richColors closeButton />
      {preview && <ThemePreviewBridge themeName={preview.name} />}
    </OfferClaimProvider>
  );
}
