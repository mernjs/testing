import type { Metadata } from "next";
import AIAgentContent from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI Agent Development Services | YashOrbit";
const description =
  "Custom autonomous AI agents for customer support, internal operations, and sales workflows — integrated into your real systems with production-grade guardrails.";
const path = "/services/ai-agent";

const image = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["AI Agent Development Services", "24/7 Automation", "AI Powered", "Workflow Integration", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AIAgentPage() {
  const jsonLd = [
    serviceJsonLd({ name: "AI Agent Development", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "AI Agent", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AIAgentContent />
    </>
  );
}
