import type { Metadata } from "next";
import CareersContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Careers — Join Our Team | YashOrbit";
const description =
  "Explore open roles at YashOrbit across Engineering, Design, and Business — including MERN Developer, GenAI Developer, AI/ML Engineer, Android & iOS Developer, UI/UX Designer, and more.";
const path = "/careers";
const image = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit careers",
    "MERN Developer jobs",
    "GenAI Developer jobs",
    "AI/ML Engineer jobs",
    "Android App Developer jobs",
    "iOS App Developer jobs",
    "UI/UX Designer jobs",
    "Business Analyst jobs",
    "Project Manager jobs",
    "Digital Marketing jobs",
    "software jobs Noida",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function CareersPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Careers", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <CareersContent />
    </>
  );
}
