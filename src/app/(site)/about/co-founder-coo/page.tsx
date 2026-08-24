import type { Metadata } from "next";
import CoFounderCooContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, personJsonLd } from "@/lib/seo";

const title = "Co-Founder & COO | YashOrbit";
const description =
  "Meet Priyanka Singh, Co-Founder & COO of YashOrbit — her background, operational leadership philosophy, career journey, and vision for the company.";
const path = "/about/co-founder-coo";

const image = "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Co-Founder & COO", "Operations Leadership", "Founder Insights", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function CoFounderCooPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Co-Founder & COO", path },
    ]),
    personJsonLd({
      name: "Priyanka Singh",
      jobTitle: "Co-Founder & COO",
      path,
      description: "Co-Founder & COO of YashOrbit, leading delivery operations, hiring, and cross-team coordination.",
    }),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CoFounderCooContent />
    </>
  );
}
