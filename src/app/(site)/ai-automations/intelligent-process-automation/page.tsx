import type { Metadata } from "next";
import { Workflow } from "lucide-react";
import IntelligentProcessAutomationContent from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Intelligent Process Automation | YashOrbit AI & Automations";
const description =
  "Replace manual workflows with AI-driven process automation that handles exceptions, adapts to context, and scales across your entire operation — built by YashOrbit Technologies.";
const path = "/ai-automations/intelligent-process-automation";
const image = "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "intelligent process automation",
    "IPA",
    "AI workflow automation",
    "business process automation",
    "enterprise automation",
    "YashOrbit",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function IntelligentProcessAutomationPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Intelligent Process Automation", description, path, category: "AI & Process Automation" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "AI & Automations", path: "/ai-automations" },
      { name: "Intelligent Process Automation", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <IntelligentProcessAutomationContent />
    </>
  );
}
