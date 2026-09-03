import type { Metadata } from "next";
import AIAutomationsContent from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI & Automations — Intelligent Workflow & Process Automation | YashOrbit";
const description =
  "Production-grade AI automation solutions — intelligent process automation, conversational AI chatbots, document intelligence, predictive workflows, RPA, and AI integration services built by YashOrbit Technologies.";
const path = "/ai-automations";
const image = "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AI automation",
    "intelligent process automation",
    "conversational AI chatbots",
    "document intelligence",
    "predictive AI workflows",
    "RPA robotic process automation",
    "AI integration services",
    "AI-powered data analytics",
    "YashOrbit AI automations",
    "workflow automation India",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AIAutomationsPage() {
  const jsonLd = [
    serviceJsonLd({ name: "AI & Process Automation Services", description, path, category: "AI & Machine Learning" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "AI & Automations", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AIAutomationsContent />
    </>
  );
}
