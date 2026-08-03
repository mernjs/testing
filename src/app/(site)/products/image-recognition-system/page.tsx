import type { Metadata } from "next";
import ImageRecognitionSystemContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Image Recognition System — Serverless Computer Vision at Scale | YashOrbit";
const description =
  "A serverless computer vision system processing 1M+ images across 800+ devices to detect blank captures and alert admins in real time.";
const path = "/products/image-recognition-system";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function ImageRecognitionSystemPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "Image Recognition System", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "Image Recognition System", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ImageRecognitionSystemContent />
    </>
  );
}
