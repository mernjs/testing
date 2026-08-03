import type { Metadata } from "next";
import OurMissionContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Our Mission | YashOrbit";
const description =
  "Learn about YashOrbit's mission, vision, core values, and journey — and what drives us to keep raising the bar for every client we work with.";
const path = "/about/our-mission";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function OurMissionPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Our Mission", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <OurMissionContent />
    </>
  );
}
