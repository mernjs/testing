import type { Metadata } from "next";
import IndustriesContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Industries We Serve — Healthcare, FinTech, EdTech & More | YashOrbit";
const description =
  "Tailored software for Healthcare, Ecommerce, Insurance, Agriculture, Education, Real Estate, Social Media, Travel, Construction, Hotels, and Finance.";
const path = "/industries";
const image = "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit industries",
    "healthcare software development",
    "ecommerce development",
    "insurance software",
    "agriculture technology",
    "education technology",
    "real estate software",
    "fintech software development",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function IndustriesPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <IndustriesContent />
    </>
  );
}
