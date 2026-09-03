import type { Metadata } from "next";
import AboutContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";

const title = "About YashOrbit — Mission, Team & Values | YashOrbit";
const description =
  "Discover YashOrbit's mission, the technologies we build with, our leadership team, and real success stories from businesses we've helped scale.";
const path = "/about";
const image = "https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "about YashOrbit",
    "YashOrbit mission",
    "YashOrbit team",
    "YashOrbit leadership",
    "software company success stories",
    "technology partner",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AboutPage() {
  const jsonLd = [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AboutContent />
    </>
  );
}
