import type { Metadata } from "next";
import AIIntegrationServicesContent from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI Integration Services | YashOrbit AI & Automations";
const description =
  "Connect LLMs, vector stores, and AI APIs into your CRM, ERP, helpdesk, or custom application without rebuilding your architecture — embedding intelligence where it creates the most value. Built by YashOrbit.";
const path = "/ai-automations/ai-integration-services";
const image = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AI integration services",
    "LLM API integration",
    "RAG integration",
    "AI into existing software",
    "AI API integration India",
    "embed AI into CRM ERP",
    "YashOrbit",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AIIntegrationServicesPage() {
  const jsonLd = [
    serviceJsonLd({ name: "AI Integration Services", description, path, category: "AI & Process Automation" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "AI & Automations", path: "/ai-automations" },
      { name: "AI Integration Services", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AIIntegrationServicesContent />
    </>
  );
}
