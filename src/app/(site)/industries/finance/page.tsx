import type { Metadata } from "next";
import FinanceContent, { financeFaqs } from "./Content";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Finance Software Development | YashOrbit";
const description =
  "Secure, compliant Finance software development — payment gateways, fraud detection, lending platforms, and blockchain integration engineered for PCI-DSS and KYC/AML compliance.";
const path = "/industries/finance";

const image = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Finance Software Development", "PCI-DSS Compliant", "Fraud Detection", "Real-Time Payments", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function FinancePage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Finance", path },
    ]),
    faqJsonLd(financeFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <FinanceContent />
    </>
  );
}
