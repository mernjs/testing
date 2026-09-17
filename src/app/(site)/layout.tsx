import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import OfferPromotions from "@/components/offers/OfferPromotions";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <OfferPromotions />
      <Header />
      <main className="flex-grow pt-[calc(88px+var(--offer-strip-h,0px))]">
        {children}
      </main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
