import type { Metadata } from "next";
import AIHRAssistantContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI HR Assistant — Hiring & Onboarding Automation | YashOrbit";
const description =
  "AI HR Assistant automates candidate screening, interview scheduling, onboarding, and routine HR queries for growing HR and talent acquisition teams.";
const path = "/products/ai-hr-assistant";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function AIHRAssistantPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "AI HR Assistant", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "AI HR Assistant", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AIHRAssistantContent />
    </>
  );
}
