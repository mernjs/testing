import type { Metadata } from "next";
import MobileAppDevelopmentContent from "./Content";
import { siteUrl, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Mobile App Development Services | YashOrbit";
const description =
  "Native and cross-platform mobile app development for iOS and Android — offline-first architecture, device integrations, and app store launch support.";
const path = "/services/mobile-app-development";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function MobileAppDevelopmentPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Mobile App Development", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Mobile App Development", path },
    ]),
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
