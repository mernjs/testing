import type { Metadata } from "next";
import SmartSpamFilterContent from "./Content";
import { smartSpamFilterFaqs } from "./faqs";
import { socialMetadata, softwareApplicationJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Smart Spam Filter — Dynamic Spam Call Scoring & Routing | YashOrbit";
const description =
  "Smart Spam Filter is a PWA that filters spam calls in real time using dynamic spam scoring and intelligent routing logic.";
const path = "/products/smart-spam-filter";

const image = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Smart Spam Filter", "PWA", "Dynamic Spam Scoring", "Intelligent Routing", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function SmartSpamFilterPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "Smart Spam Filter", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "Smart Spam Filter", path },
    ]),
    faqJsonLd(smartSpamFilterFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SmartSpamFilterContent />
    </>
  );
}
