import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import InfluencerMarketingContent from "./Content";
import { influencerMarketingFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Influencer Marketing Services | YashOrbit";
const description =
  "Amplify your brand through creator partnerships, influencer campaigns, and authentic User-Generated Content (UGC).";
const path = "/services/digital-marketing/influencer-marketing";
const image = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Influencer Marketing", "Creator Partnerships", "UGC Campaigns", "Instagram Influencers", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function InfluencerMarketingPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Influencer Marketing", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Influencer Marketing", path },
    ]),
    faqJsonLd(influencerMarketingFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <InfluencerMarketingContent />
    </>
  );
}
