import type { Metadata } from "next";
import SocialMediaContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Social Media Platform Development | YashOrbit";
const description =
  "Custom Social Media technology — real-time feeds, community platforms, and AI-assisted content moderation engineered to scale through viral traffic spikes.";
const path = "/industries/social-media";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function SocialMediaPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Social Media", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <SocialMediaContent />
    </>
  );
}
