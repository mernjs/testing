import type { Metadata } from "next";
import AgenticAiContent from "./Content";
import { agenticAiFaqs } from "./faqs";
import { socialMetadata, courseJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Agentic AI Training | YashOrbit";
const description =
  "Applied Agentic AI training covering tool use, planning, memory, and multi-agent orchestration — design autonomous AI systems that plan and act, not just chat.";
const path = "/industrial-training/agentic-ai";

const image = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Agentic AI Training", "Python", "Agent Frameworks", "Memory", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AgenticAiTrainingPage() {
  const jsonLd = [
    courseJsonLd({ name: "Agentic AI Training", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industrial Training", path: "/industrial-training" },
      { name: "Agentic AI", path },
    ]),
    faqJsonLd(agenticAiFaqs),
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
