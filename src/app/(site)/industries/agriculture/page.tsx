import type { Metadata } from "next";
import AgricultureContent from "./Content";
import { agricultureFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Agriculture Software Development | YashOrbit";
const description =
  "Custom Agriculture technology — farm management platforms, IoT sensor integration, and yield prediction tools engineered for field conditions and offline reliability.";
const path = "/industries/agriculture";

const image = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Agriculture Software Development", "Offline-first Field Apps", "IoT Sensors", "Yield Prediction", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AgriculturePage() {
  const jsonLd = [
    serviceJsonLd({ name: "AgriTech & Agriculture Software Development", description, path, category: "Agriculture Technology" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Agriculture", path },
    ]),
    faqJsonLd(agricultureFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AgricultureContent />
    </>
  );
}
