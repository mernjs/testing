import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import OfferPromotions from "@/components/offers/OfferPromotions";
import ReferralWelcome from "@/components/offers/ReferralWelcome";
import OfferClaimProvider from "@/components/offers/OfferClaimProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OfferClaimProvider>
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
