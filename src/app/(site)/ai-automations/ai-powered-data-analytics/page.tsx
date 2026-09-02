import type { Metadata } from "next";
import AIPoweredDataAnalyticsContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

const title = "AI-Powered Data Analytics | YashOrbit AI & Automations";
const description =
  "ML-driven analytics pipelines that detect anomalies, surface trends, and generate plain-language insights — turning raw business data into actionable intelligence. Built by YashOrbit Technologies.";
const path = "/ai-automations/ai-powered-data-analytics";
const image = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AI data analytics",
    "ML analytics pipeline",
    "anomaly detection AI",
    "business intelligence AI",
    "AI-powered insights",
    "data analytics India",
    "YashOrbit",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AIPoweredDataAnalyticsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI & Automations", path: "/ai-automations" },
    { name: "AI-Powered Data Analytics", path },
  ]);
  const service = serviceJsonLd({ name: "AI-Powered Data Analytics", description, path });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <AIPoweredDataAnalyticsContent />
    </>
  );
}
