import type { Metadata } from "next";
import FinanceContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Finance Software Development | YashOrbit";
const description =
  "Secure, compliant Finance software development — payment gateways, fraud detection, lending platforms, and blockchain integration engineered for PCI-DSS and KYC/AML compliance.";
const path = "/industries/finance";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function FinancePage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Finance", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <FinanceContent />
    </>
  );
}
