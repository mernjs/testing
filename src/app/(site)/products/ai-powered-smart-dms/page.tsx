import type { Metadata } from "next";
import AIPoweredSmartDMSContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI Powered Smart DMS — Intelligent Document Management | YashOrbit";
const description =
  "AI Powered Smart DMS uses OCR and semantic search to categorize, tag, and instantly search your entire company document archive.";
const path = "/products/ai-powered-smart-dms";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function AIPoweredSmartDMSPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "AI Powered Smart DMS", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "AI Powered Smart DMS", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AIPoweredSmartDMSContent />
    </>
  );
}
