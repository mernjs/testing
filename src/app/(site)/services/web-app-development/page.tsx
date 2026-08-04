import type { Metadata } from "next";
import WebAppDevelopmentContent from "./Content";
import { webAppDevelopmentFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Web App Development Services | YashOrbit";
const description =
  "Custom web application development — SaaS platforms, e-commerce, and internal tools built with React, Next.js, and Node.js for performance, security, and scale.";
const path = "/services/web-app-development";

const image = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Web App Development Services", "Cloud Native", "SEO Optimized", "Enterprise Ready", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function WebAppDevelopmentPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Web App Development", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Web App Development", path },
    ]),
    faqJsonLd(webAppDevelopmentFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <WebAppDevelopmentContent />
    </>
  );
}
