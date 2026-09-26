import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import MarketingAnalyticsContent from "./Content";
import { marketingAnalyticsFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Marketing Analytics & Reporting | YashOrbit";
const description =
  "Turn marketing data into actionable growth insights with centralized performance tracking, custom dashboards, and ROI attribution.";
const path = "/services/digital-marketing/marketing-analytics";
const image = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Marketing Analytics", "GA4 Setup", "Looker Studio Dashboard", "Marketing Attribution", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function MarketingAnalyticsPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Marketing Analytics & Reporting", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Marketing Analytics & Reporting", path },
    ]),
    faqJsonLd(marketingAnalyticsFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <MarketingAnalyticsContent />
    </>
  );
}
