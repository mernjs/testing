import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import SocialMediaMarketingContent from "./Content";
import { socialMediaMarketingFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Social Media Marketing Services | YashOrbit Digital Marketing";
const description =
  "Build a stronger social presence through strategic content, audience engagement, creative campaigns, and platform-specific marketing across Instagram, Facebook, LinkedIn, and YouTube.";
const path = "/services/digital-marketing/social-media-marketing";
const image = "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Social Media Marketing", "Instagram Marketing", "Facebook Marketing", "LinkedIn Marketing", "Social Media Management", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function SocialMediaMarketingPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Social Media Marketing Services", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Social Media Marketing", path },
    ]),
    faqJsonLd(socialMediaMarketingFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SocialMediaMarketingContent />
    </>
  );
}
