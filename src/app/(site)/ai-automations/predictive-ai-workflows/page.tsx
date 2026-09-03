import type { Metadata } from "next";
import PredictiveAIWorkflowsContent from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Predictive AI Workflows | YashOrbit AI & Automations";
const description =
  "Embed predictive ML models into your operational workflows to flag at-risk accounts, forecast resource needs, and pre-empt failures before they happen — built by YashOrbit Technologies.";
const path = "/ai-automations/predictive-ai-workflows";
const image = "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "predictive AI workflows",
    "ML operational triggers",
    "predictive automation",
    "churn prediction workflow",
    "predictive maintenance AI",
    "proactive AI alerts",
    "YashOrbit",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function PredictiveAIWorkflowsPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Predictive AI Workflows", description, path, category: "AI & Machine Learning" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "AI & Automations", path: "/ai-automations" },
      { name: "Predictive AI Workflows", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <PredictiveAIWorkflowsContent />
    </>
  );
}
