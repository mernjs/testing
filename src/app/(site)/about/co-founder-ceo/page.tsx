import type { Metadata } from "next";
import CoFounderCeoContent from "./Content";
import { coFounderCeoFaqs } from "./faqs";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Co-Founder & CEO | YashOrbit";
const description =
  "Meet Aditya Rao, Co-Founder & CEO of YashOrbit — his background, leadership philosophy, career journey, and vision for the company.";
const path = "/about/co-founder-ceo";

const image = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Co-Founder & CEO", "Founder Insights", "Leadership Vision", "Direct Access", "YashOrbit"],
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
    faqJsonLd(coFounderCeoFaqs),
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
