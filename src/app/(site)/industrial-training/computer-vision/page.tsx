import type { Metadata } from "next";
import ComputerVisionContent, { computerVisionFaqs } from "./Content";
import { socialMetadata, courseJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Computer Vision Training | YashOrbit";
const description =
  "Hands-on Computer Vision training covering OpenCV, CNNs, object detection, OCR, and video analytics — build and deploy real image and video intelligence systems.";
const path = "/industrial-training/computer-vision";

const image = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Computer Vision Training", "OpenCV", "CNNs", "Edge Deploy", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ComputerVisionTrainingPage() {
  const jsonLd = [
    courseJsonLd({ name: "Computer Vision Training", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industrial Training", path: "/industrial-training" },
      { name: "Computer Vision", path },
    ]),
    faqJsonLd(computerVisionFaqs),
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
