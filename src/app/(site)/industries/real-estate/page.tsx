import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import RealEstateContent from "./Content";
import { realEstateFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Real Estate Software Development | YashOrbit";
const description =
  "Real Estate technology — property management platforms, immersive 3D virtual tours, and automated leasing workflows built for agents, owners, and tenants.";
const path = "/industries/real-estate";

const image = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Real Estate Software Development", "3D Virtual Tours", "Property CRM", "Automated Leasing", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides("/industries/real-estate", baseMetadata);

export default function RealEstatePage() {
  const jsonLd = [
    serviceJsonLd({ name: "Real Estate Software Development", description, path, category: "PropTech & Real Estate Technology" }),
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
