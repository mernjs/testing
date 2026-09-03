import type { Metadata } from "next";
import ComputerVisionInternshipContent from "./Content";
import { computerVisionInternshipFaqs } from "./faqs";
import { socialMetadata, courseJsonLd, internshipJobPostingJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Computer Vision Internship | YashOrbit";
const description =
  "A paid, 8–12 week Computer Vision internship — work on real image and video pipelines, detection, and OCR systems deployed to production, under a dedicated mentor.";
const path = "/internship-program/computer-vision";

const image = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Computer Vision Internship", "Paid Internship", "OpenCV Internship", "Deep Learning Internship", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ComputerVisionInternshipPage() {
  const jsonLd = [
    internshipJobPostingJsonLd({
      title: "Computer Vision Intern",
      description,
      path,
      skills: ["Python", "OpenCV", "PyTorch", "YOLO", "OCR", "Image Processing"],
      responsibilities: [
        "Annotate and preprocess image datasets for model training.",
        "Train and evaluate object detection and OCR models.",
        "Optimize model inference speeds for web and edge deployment.",
        "Support senior engineers with model benchmarking.",
      ],
    }),
    courseJsonLd({ name: "Computer Vision Internship", description, path, duration: "P12W", credential: "Computer Vision Internship Certificate" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Internship Program", path: "/internship-program" },
      { name: "Computer Vision", path },
    ]),
    faqJsonLd(computerVisionInternshipFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ComputerVisionInternshipContent />
    </>
  );
}
