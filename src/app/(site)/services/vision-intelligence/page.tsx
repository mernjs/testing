import type { Metadata } from "next";
import VisionIntelligenceContent from "./Content";
import { siteUrl, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Vision Intelligence Services | YashOrbit";
const description =
  "Computer vision solutions for business — real-time object detection, quality inspection, retail analytics, and document OCR, deployed to cloud or edge.";
const path = "/services/vision-intelligence";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function VisionIntelligencePage() {
  const jsonLd = [
    serviceJsonLd({ name: "Vision Intelligence", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Vision Intelligence", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <VisionIntelligenceContent />
    </>
  );
}
