import type { Metadata } from "next";
import ChroContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, personJsonLd } from "@/lib/seo";

const title = "Chief Human Resources Officer (CHRO) | YashOrbit";
const description =
  "Meet Pooja Singh, Chief Human Resources Officer at YashOrbit — her background, people leadership philosophy, career journey, and vision for the company's culture.";
const path = "/about/chro";

const image = "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Chief Human Resources Officer", "CHRO", "People Leadership", "Talent & Culture", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ChroPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Chief Human Resources Officer", path },
    ]),
    personJsonLd({
      name: "Pooja Singh",
      jobTitle: "Chief Human Resources Officer",
      path,
      description: "Chief Human Resources Officer at YashOrbit, leading talent acquisition, culture, and people operations.",
    }),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ChroContent />
    </>
  );
}
