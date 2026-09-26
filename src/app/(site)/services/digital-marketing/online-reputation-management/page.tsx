import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import OrmContent from "./Content";
import { ormFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Online Reputation Management (ORM) | YashOrbit";
const description =
  "Protect and strengthen your digital reputation by monitoring online presence, managing customer feedback, and building brand trust.";
const path = "/services/digital-marketing/online-reputation-management";
const image = "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Online Reputation Management", "ORM Services", "Review Management", "Brand Monitoring", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function OrmPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Online Reputation Management", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Online Reputation Management", path },
    ]),
    faqJsonLd(ormFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <OrmContent />
    </>
  );
}
