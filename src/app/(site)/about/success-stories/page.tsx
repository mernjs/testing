import type { Metadata } from "next";
import SuccessStoriesContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Success Stories | YashOrbit";
const description =
  "Explore case studies, client wins, and project statistics behind the software YashOrbit has delivered for startups and enterprises across industries.";
const path = "/about/success-stories";

const image = "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Success Stories", "12+ Projects", "Real Case Studies", "Early Momentum", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function SuccessStoriesPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Success Stories", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <SuccessStoriesContent />
    </>
  );
}
