import type { Metadata } from "next";
import ConstructionContent from "./Content";
import { constructionFaqs } from "./faqs";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Construction Software Development | YashOrbit";
const description =
  "Custom Construction technology — project management platforms, offline-first field apps, and site monitoring tools built for real job-site conditions.";
const path = "/industries/construction";

const image = "https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Construction Software Development", "Offline Field Apps", "Live Budget Tracking", "Safety Reporting", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ConstructionPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Construction", path },
    ]),
    faqJsonLd(constructionFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ConstructionContent />
    </>
  );
}
