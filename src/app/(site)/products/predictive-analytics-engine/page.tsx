import type { Metadata } from "next";
import PredictiveAnalyticsEngineContent, { predictiveAnalyticsEngineFaqs } from "./Content";
import { socialMetadata, softwareApplicationJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Predictive Analytics Engine — ML Forecasting for Orders & Labor | YashOrbit";
const description =
  "A predictive analytics engine forecasting orders, sales, and labor needs using machine learning, delivered via API for operations and workforce planning teams.";
const path = "/products/predictive-analytics-engine";

const image = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Predictive Analytics Engine", "Machine Learning", "Demand Forecasting", "API-First", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function PredictiveAnalyticsEnginePage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "Predictive Analytics Engine", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "Predictive Analytics Engine", path },
    ]),
    faqJsonLd(predictiveAnalyticsEngineFaqs),
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
