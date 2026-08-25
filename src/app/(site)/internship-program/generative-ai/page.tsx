import type { Metadata } from "next";
import GenerativeAiInternshipContent from "./Content";
import { generativeAiInternshipFaqs } from "./faqs";
import { socialMetadata, courseJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Generative AI Internship | YashOrbit";
const description =
  "A paid, 8–12 week Generative AI internship — build and deploy prompt pipelines, RAG systems, and LLM-backed features for real product briefs, under a dedicated mentor.";
const path = "/internship-program/generative-ai";

const image = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Generative AI Internship", "Paid Internship", "LLM Internship", "AI Internship", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function GenerativeAiInternshipPage() {
  const jsonLd = [
    courseJsonLd({ name: "Generative AI Internship", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Internship Program", path: "/internship-program" },
      { name: "Generative AI", path },
    ]),
    faqJsonLd(generativeAiInternshipFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <GenerativeAiInternshipContent />
    </>
  );
}
