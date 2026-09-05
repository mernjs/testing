import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-grow pt-[88px]">
        {children}
      </main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
