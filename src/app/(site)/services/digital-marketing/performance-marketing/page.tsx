import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import PerformanceMarketingContent from "./Content";
import { performanceMarketingFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Performance Marketing Services | YashOrbit Digital Marketing";
const description =
  "Drive measurable business results through targeted Google Ads, Meta Ads, LinkedIn, and YouTube advertising campaigns optimised for traffic, leads, conversions, and revenue.";
const path = "/services/digital-marketing/performance-marketing";
const image = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Performance Marketing", "Google Ads", "Meta Ads", "Facebook Ads", "LinkedIn Ads", "ROAS Optimization", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function PerformanceMarketingPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Performance Marketing Services", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Performance Marketing", path },
    ]),
    faqJsonLd(performanceMarketingFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <PerformanceMarketingContent />
    </>
  );
}
