import type { Metadata } from "next";
import PredictionForecastingContent from "./Content";
import { predictionForecastingFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Prediction & Forecasting Services | YashOrbit";
const description =
  "Predictive analytics and forecasting solutions — demand, revenue, staffing, and churn forecasting built with statistical models and machine learning.";
const path = "/services/prediction-and-forecasting";

const image = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Prediction & Forecasting Services", "Data-Driven", "AI Powered", "Real-Time Insights", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function PredictionForecastingPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Prediction & Forecasting", description, path, category: "AI & Machine Learning" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Prediction & Forecasting", path },
    ]),
    faqJsonLd(predictionForecastingFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <PredictionForecastingContent />
    </>
  );
}
