import type { Metadata } from "next";
import Content from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { getCategoryBySlug } from "../resources-data";

const category = getCategoryBySlug("project-based")!;
const title = `${category.title} — Resource Augmentation | YashOrbit`;
const description = `${category.summary} Billing: ${category.cardHighlight.billingType}. ${category.cardHighlight.hiringDuration}.`;
const path = "/resource-augmentation/project-based";
const image = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [category.title, "hire developers", "resource augmentation", "staff augmentation"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function Page() {
  const jsonLd = [
    serviceJsonLd({ name: category.title, description, path, category: "IT Staff Augmentation" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Resource Augmentation", path: "/resource-augmentation" },
      { name: category.title, path },
    ]),
    faqJsonLd(category.faqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <Content />
    </>
  );
}
