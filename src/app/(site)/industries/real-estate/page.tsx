import type { Metadata } from "next";
import RealEstateContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Real Estate Software Development | YashOrbit";
const description =
  "Real Estate technology — property management platforms, immersive 3D virtual tours, and automated leasing workflows built for agents, owners, and tenants.";
const path = "/industries/real-estate";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function RealEstatePage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Real Estate", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <RealEstateContent />
    </>
  );
}
