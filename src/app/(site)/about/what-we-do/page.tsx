import type { Metadata } from "next";
import WhatWeDoContent from "./Content";
import { whatWeDoFaqs } from "./faqs";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "What We Do | YashOrbit";
const description =
  "YashOrbit is a full-stack product engineering company building web, mobile, and AI-native software — explore our expertise, services, and development process.";
const path = "/about/what-we-do";

const image = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["What We Do", "Full-Stack Delivery", "AI-First Approach", "Senior-led Team", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function WhatWeDoPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "What We Do", path },
    ]),
    faqJsonLd(whatWeDoFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <WhatWeDoContent />
    </>
  );
}
