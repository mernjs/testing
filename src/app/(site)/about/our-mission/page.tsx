import type { Metadata } from "next";
import OurMissionContent, { ourMissionFaqs } from "./Content";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Our Mission | YashOrbit";
const description =
  "Learn about YashOrbit's mission, vision, core values, and journey — and what drives us to keep raising the bar for every client we work with.";
const path = "/about/our-mission";

const image = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Our Mission", "Founded 2026", "Core Values", "Remote-first", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function OurMissionPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Our Mission", path },
    ]),
    faqJsonLd(ourMissionFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <OurMissionContent />
    </>
  );
}
