import type { Metadata } from "next";
import ComputerVisionContent from "./Content";
import { siteUrl, courseJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Computer Vision Training | YashOrbit";
const description =
  "Hands-on Computer Vision training covering OpenCV, CNNs, object detection, OCR, and video analytics — build and deploy real image and video intelligence systems.";
const path = "/industrial-training/computer-vision";

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

export default function ComputerVisionTrainingPage() {
  const jsonLd = [
    courseJsonLd({ name: "Computer Vision Training", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industrial Training", path: "/industrial-training" },
      { name: "Computer Vision", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ComputerVisionContent />
    </>
  );
}
