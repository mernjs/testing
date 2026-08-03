import type { Metadata } from "next";
import LegalTechContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Legal Tech — Legal Practice Management Software | YashOrbit";
const description =
  "Legal Tech is a practice management suite for law firms — document automation, case tracking, compliance checklists, and a secure client portal.";
const path = "/products/legal-tech";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function LegalTechPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "Legal Tech", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "Legal Tech", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <LegalTechContent />
    </>
  );
}
