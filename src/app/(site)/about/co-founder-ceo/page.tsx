import type { Metadata } from "next";
import CoFounderCeoContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, personJsonLd } from "@/lib/seo";

const title = "Co-Founder & CEO | YashOrbit";
const description =
  "Meet [NAME_OF_CEO], Co-Founder & CEO of YashOrbit — her background, leadership philosophy, career journey, and vision for the company.";
const path = "/about/co-founder-ceo";

const image = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Co-Founder & CEO", "Founder Insights", "Leadership Vision", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function CoFounderCeoPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Co-Founder & CEO", path },
    ]),
    personJsonLd({
      name: "[NAME_OF_CEO]",
      jobTitle: "Co-Founder & CEO",
      path,
      description: "Co-Founder & CEO of YashOrbit, leading company strategy, culture, and long-term vision.",
    }),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CoFounderCeoContent />
    </>
  );
}
