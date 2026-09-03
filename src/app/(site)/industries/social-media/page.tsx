import type { Metadata } from "next";
import SocialMediaContent from "./Content";
import { socialMediaFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Social Media Platform Development | YashOrbit";
const description =
  "Custom Social Media technology — real-time feeds, community platforms, and AI-assisted content moderation engineered to scale through viral traffic spikes.";
const path = "/industries/social-media";

const image = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Social Media Platform Development", "Real-time Feeds", "AI Moderation", "Auto-scaling", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function SocialMediaPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Social Media App & Platform Development", description, path, category: "Media & Social Technology" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Social Media", path },
    ]),
    faqJsonLd(socialMediaFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SocialMediaContent />
    </>
  );
}
