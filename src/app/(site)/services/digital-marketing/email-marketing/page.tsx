import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import EmailMarketingContent from "./Content";
import { emailMarketingFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Email Marketing Services | YashOrbit Digital Marketing";
const description =
  "Build meaningful customer relationships, nurture leads, and generate repeat revenue through personalized and automated email marketing campaigns.";
const path = "/services/digital-marketing/email-marketing";
const image = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Email Marketing", "Email Automation", "Drip Campaigns", "Klaviyo Marketing", "Mailchimp", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function EmailMarketingPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Email Marketing", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Email Marketing", path },
    ]),
    faqJsonLd(emailMarketingFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <EmailMarketingContent />
    </>
  );
}
