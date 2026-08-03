import type { Metadata } from "next";
import PredictiveAnalyticsEngineContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Predictive Analytics Engine — ML Forecasting for Orders & Labor | YashOrbit";
const description =
  "A predictive analytics engine forecasting orders, sales, and labor needs using machine learning, delivered via API for operations and workforce planning teams.";
const path = "/products/predictive-analytics-engine";

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

export default function PredictiveAnalyticsEnginePage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "Predictive Analytics Engine", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "Predictive Analytics Engine", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <PredictiveAnalyticsEngineContent />
    </>
  );
}
