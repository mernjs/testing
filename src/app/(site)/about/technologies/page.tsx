import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import TechnologiesContent from "./Content";
import { technologiesFaqs } from "./faqs";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Technologies | YashOrbit";
const description =
  "Explore the frontend, backend, mobile, desktop, AI, CRM, no-code/low-code, AI coding tools, cloud, and data technologies YashOrbit uses to design, build, and ship production software.";
const path = "/about/technologies";

const image = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Technologies", "18 Categories", "CRM", "No-Code", "Low-Code", "Desktop Apps", "AI Coding Tools", "Production-tested", "AI-native", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides("/about/technologies", baseMetadata);

export default function TechnologiesPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Technologies", path },
    ]),
    faqJsonLd(technologiesFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <TechnologiesContent />
    </>
  );
}
