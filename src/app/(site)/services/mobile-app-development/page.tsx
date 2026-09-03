import type { Metadata } from "next";
import MobileAppDevelopmentContent from "./Content";
import { mobileAppDevelopmentFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Mobile App Development Services | YashOrbit";
const description =
  "Native and cross-platform mobile app development for iOS and Android — offline-first architecture, device integrations, and app store launch support.";
const path = "/services/mobile-app-development";

const image = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Mobile App Development Services", "iOS & Android", "Offline-First", "App Store Ready", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function MobileAppDevelopmentPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Mobile App Development", description, path, category: "Mobile App Development" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Mobile App Development", path },
    ]),
    faqJsonLd(mobileAppDevelopmentFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <MobileAppDevelopmentContent />
    </>
  );
}
