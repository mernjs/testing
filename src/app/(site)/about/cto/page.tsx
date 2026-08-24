import type { Metadata } from "next";
import CtoContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, personJsonLd } from "@/lib/seo";

const title = "Chief Technology Officer (CTO) | YashOrbit";
const description =
  "Meet Tej Pratap Singh, Chief Technology Officer at YashOrbit — his background, technical leadership philosophy, career journey, and vision for the company's engineering.";
const path = "/about/cto";

const image = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Chief Technology Officer", "CTO", "Engineering Leadership", "Technical Architecture", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function CtoPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Chief Technology Officer", path },
    ]),
    personJsonLd({
      name: "Tej Pratap Singh",
      jobTitle: "Chief Technology Officer",
      path,
      description: "Chief Technology Officer at YashOrbit, leading engineering strategy, technical architecture, and applied AI direction.",
    }),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CtoContent />
    </>
  );
}
