import type { Metadata } from "next";
import ResourceAugmentationContent from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Resource Augmentation — Hire Developers | YashOrbit";
const description =
  "Hire onsite, remote, hybrid, dedicated, or contract developers by the hour, part-time, or full-time. Or bring in a pre-built team with Software Engineers, Tech Leads, QA, and DevOps.";
const path = "/resource-augmentation";
const image = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "hire developers",
    "resource augmentation",
    "staff augmentation",
    "dedicated developer",
    "remote developer",
    "hire a development team",
    "IT staffing",
    "hire software engineers",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ResourceAugmentationPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Developer Hiring & Resource Augmentation", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Resource Augmentation", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ResourceAugmentationContent />
    </>
  );
}
