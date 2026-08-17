import type { Metadata } from "next";
import RefundCancellationPolicyContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Refund & Cancellation Policy | YashOrbit";
const description =
  "YashOrbit's Refund & Cancellation Policy — refund terms for development engagements, training programs, non-refundable items, and how to request a cancellation.";
const path = "/about/refund-cancellation-policy";

const image = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Refund Policy", "Cancellation Policy", "Consumer Protection", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function RefundCancellationPolicyPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Refund & Cancellation Policy", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <RefundCancellationPolicyContent />
    </>
  );
}
