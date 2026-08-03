import type { Metadata } from "next";
import ConvoCraftContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "ConvoCraft — Conversational AI Platform | YashOrbit";
const description =
  "ConvoCraft is a no-code conversational AI platform for building and deploying chatbots and voice assistants across web, WhatsApp, and voice channels.";
const path = "/products/convocraft";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function ConvoCraftPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "ConvoCraft", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "ConvoCraft", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ConvoCraftContent />
    </>
  );
}
