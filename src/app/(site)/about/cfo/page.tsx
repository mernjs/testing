import type { Metadata } from "next";
import CfoContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, personJsonLd } from "@/lib/seo";

const title = "Chief Financial Officer (CFO) | YashOrbit";
const description =
  "Meet Shikha Singh, Chief Financial Officer at YashOrbit — her background, financial leadership philosophy, career journey, and vision for the company's finances.";
const path = "/about/cfo";

const image = "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Chief Financial Officer", "CFO", "Chartered Accountant", "Financial Leadership", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function CfoPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Chief Financial Officer", path },
    ]),
    personJsonLd({
      name: "Shikha Singh",
      jobTitle: "Chief Financial Officer",
      path,
      description: "Chief Financial Officer at YashOrbit, leading financial strategy, compliance, and reporting.",
    }),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CfoContent />
    </>
  );
}
