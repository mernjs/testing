import type { Metadata } from "next";
import InsuranceContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Insurance Software Development | YashOrbit";
const description =
  "Custom Insurance technology — automated underwriting, digital claims platforms, and policyholder portals built to speed up processing without cutting corners on risk.";
const path = "/industries/insurance";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function InsurancePage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Insurance", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <InsuranceContent />
    </>
  );
}
