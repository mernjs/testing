import type { Metadata } from "next";
import ImageRecognitionSystemContent from "./Content";
import { imageRecognitionSystemFaqs } from "./faqs";
import { socialMetadata, softwareApplicationJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Image Recognition System — Serverless Computer Vision at Scale | YashOrbit";
const description =
  "A serverless computer vision system processing 1M+ images across 800+ devices to detect blank captures and alert admins in real time.";
const path = "/products/image-recognition-system";

const image = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Image Recognition System", "Computer Vision", "Serverless", "Fleet Monitoring", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ImageRecognitionSystemPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "Image Recognition System", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "Image Recognition System", path },
    ]),
    faqJsonLd(imageRecognitionSystemFaqs),
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
