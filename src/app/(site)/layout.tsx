import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import OfferPromotions from "@/components/offers/OfferPromotions";
import ReferralWelcome from "@/components/offers/ReferralWelcome";
import OfferClaimProvider from "@/components/offers/OfferClaimProvider";
import ManagedJsonLd from "@/components/seo/ManagedJsonLd";
import { getSeoSiteState } from "@/lib/seo-panel/public";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { schemas } = await getSeoSiteState();
  return (
    <OfferClaimProvider>
      <ManagedJsonLd schemas={schemas} />
      <OfferPromotions />
      <ReferralWelcome />
      <Header />
      <main className="flex-grow pt-[calc(88px+var(--offer-strip-h,0px))]">
        {children}
      </main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </OfferClaimProvider>
  );
}
