import type { Metadata } from "next";
import DataPulseAIContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "DataPulse AI — Real-Time Business Intelligence | YashOrbit";
const description =
  "DataPulse AI connects to your data sources for real-time dashboards, AI-generated insights, and anomaly alerts on your business health.";
const path = "/products/datapulse-ai";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function DataPulseAIPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "DataPulse AI", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "DataPulse AI", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <DataPulseAIContent />
    </>
  );
}
