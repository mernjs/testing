import type { Metadata } from "next";
import RealEstateContent from "./Content";
import { realEstateFaqs } from "./faqs";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Real Estate Software Development | YashOrbit";
const description =
  "Real Estate technology — property management platforms, immersive 3D virtual tours, and automated leasing workflows built for agents, owners, and tenants.";
const path = "/industries/real-estate";

const image = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Real Estate Software Development", "3D Virtual Tours", "Property CRM", "Automated Leasing", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function RealEstatePage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Real Estate", path },
    ]),
    faqJsonLd(realEstateFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <RealEstateContent />
    </>
  );
}
