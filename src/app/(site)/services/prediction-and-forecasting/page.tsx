import type { Metadata } from "next";
import PredictionForecastingContent from "./Content";
import { siteUrl, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Prediction & Forecasting Services | YashOrbit";
const description =
  "Predictive analytics and forecasting solutions — demand, revenue, staffing, and churn forecasting built with statistical models and machine learning.";
const path = "/services/prediction-and-forecasting";

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

export default function PredictionForecastingPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Prediction & Forecasting", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Prediction & Forecasting", path },
    ]),
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
