import type { Metadata } from "next";
import InternshipProgramContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Internship Program | YashOrbit";
const description =
  "Paid, mentor-led internships across MERN Stack, MEAN Stack, Generative AI, Agentic AI, Conversational AI, and Computer Vision — real, client-adjacent work from week one.";
const path = "/internship-program";
const image = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Internship Program",
    "Paid Internship",
    "MERN Stack internship",
    "MEAN Stack internship",
    "Generative AI internship",
    "Agentic AI internship",
    "Conversational AI internship",
    "Computer Vision internship",
    "YashOrbit",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function InternshipProgramPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Internship Program", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <InternshipProgramContent />
    </>
  );
}
