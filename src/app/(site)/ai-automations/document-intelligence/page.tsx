import type { Metadata } from "next";
import DocumentIntelligenceContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

const title = "Document Intelligence | YashOrbit AI & Automations";
const description =
  "AI-powered document intelligence that reads, extracts, validates, and routes data from invoices, contracts, forms, and reports — eliminating manual data entry at scale. Built by YashOrbit Technologies.";
const path = "/ai-automations/document-intelligence";
const image = "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "document intelligence",
    "intelligent document processing",
    "IDP",
    "OCR NLP",
    "invoice automation",
    "contract data extraction",
    "YashOrbit",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function DocumentIntelligencePage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI & Automations", path: "/ai-automations" },
    { name: "Document Intelligence", path },
  ]);
  const service = serviceJsonLd({ name: "Document Intelligence", description, path });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <DocumentIntelligenceContent />
    </>
  );
}
