import type { Metadata } from "next";
import GenerativeAiContent from "./Content";
import { siteUrl, courseJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Generative AI Training | YashOrbit";
const description =
  "Applied Generative AI training covering LLM APIs, prompt engineering, RAG pipelines, and fine-tuning — build and ship real products on top of large language models.";
const path = "/industrial-training/generative-ai";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function GenerativeAiTrainingPage() {
  const jsonLd = [
    courseJsonLd({ name: "Generative AI Training", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industrial Training", path: "/industrial-training" },
      { name: "Generative AI", path },
    ]),
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
