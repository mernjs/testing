import type { Metadata } from "next";
import GenerativeAiContent from "./Content";
import { generativeAiFaqs } from "./faqs";
import { socialMetadata, courseJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Generative AI Training | YashOrbit";
const description =
  "Applied Generative AI training covering LLM APIs, prompt engineering, RAG pipelines, and fine-tuning — build and ship real products on top of large language models.";
const path = "/industrial-training/generative-ai";

const image = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Generative AI Training", "LLM APIs", "LangChain", "Vector DB", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function GenerativeAiTrainingPage() {
  const jsonLd = [
    courseJsonLd({ name: "Generative AI Training", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industrial Training", path: "/industrial-training" },
      { name: "Generative AI", path },
    ]),
    faqJsonLd(generativeAiFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <GenerativeAiContent />
    </>
  );
}
