import type { Metadata } from "next";
import WebAppDevelopmentContent from "./Content";
import { siteUrl, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Web App Development Services | YashOrbit";
const description =
  "Custom web application development — SaaS platforms, e-commerce, and internal tools built with React, Next.js, and Node.js for performance, security, and scale.";
const path = "/services/web-app-development";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function WebAppDevelopmentPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Web App Development", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Web App Development", path },
    ]),
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
