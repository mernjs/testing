import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import DigitalMarketingContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

const title = "Digital Marketing Services — SEO, Ads, Social Media & Growth | YashOrbit";
const description =
  "Grow your brand, reach the right audience, generate qualified leads, and increase conversions with data-driven digital marketing strategies tailored to your business — by YashOrbit Technologies.";
const path = "/digital-marketing";
const image = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit digital marketing",
    "SEO services",
    "performance marketing",
    "social media marketing",
    "content marketing",
    "email marketing",
    "lead generation",
    "conversion rate optimization",
    "online reputation management",
    "influencer marketing",
    "digital marketing agency India",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides("/digital-marketing", baseMetadata);

export default function DigitalMarketingPage() {
  const jsonLd = [
    serviceJsonLd({
      name: "Digital Marketing",
      description,
      path,
      category: "Digital Marketing Services",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <DigitalMarketingContent />
    </>
  );
}
