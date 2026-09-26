import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import LeadGenerationContent from "./Content";
import { leadGenerationFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Lead Generation Services | YashOrbit Digital Marketing";
const description =
  "Generate qualified business opportunities through targeted campaigns, optimized landing experiences, and data-driven lead acquisition strategies.";
const path = "/services/digital-marketing/lead-generation";
const image = "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Lead Generation", "B2B Leads", "Lead Acquisition", "Landing Page Leads", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function LeadGenerationPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Lead Generation", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Lead Generation", path },
    ]),
    faqJsonLd(leadGenerationFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <LeadGenerationContent />
    </>
  );
}
