import type { Metadata } from "next";
import ServicesContent from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Our Services — Software, Training, Staffing & AI | YashOrbit";
const description =
  "Explore YashOrbit's 5 specialized service pillars: Software Development, Industrial Training, Resource Augmentation, Internship Program, and AI & Automations — engineered for scale.";
const path = "/services";
const image = "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit services",
    "software development",
    "industrial training",
    "resource augmentation",
    "internship program",
    "AI and automations",
    "custom software solutions",
    "IT services India",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ServicesPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Software, AI, Training & Staffing Services", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ServicesContent />
    </>
  );
}
