import type { Metadata } from "next";
import AgenticAiContent from "./Content";
import { siteUrl, courseJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Agentic AI Training | YashOrbit";
const description =
  "Applied Agentic AI training covering tool use, planning, memory, and multi-agent orchestration — design autonomous AI systems that plan and act, not just chat.";
const path = "/industrial-training/agentic-ai";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function AgenticAiTrainingPage() {
  const jsonLd = [
    courseJsonLd({ name: "Agentic AI Training", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industrial Training", path: "/industrial-training" },
      { name: "Agentic AI", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AgenticAiContent />
    </>
  );
}
