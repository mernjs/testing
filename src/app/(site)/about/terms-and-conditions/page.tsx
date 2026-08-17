import type { Metadata } from "next";
import TermsAndConditionsContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Terms & Conditions | YashOrbit";
const description =
  "YashOrbit's Terms & Conditions — eligibility, intellectual property, accounts, payment terms, warranties, liability, and governing law for use of our website.";
const path = "/about/terms-and-conditions";

const image = "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Terms and Conditions", "Terms of Use", "Legal Terms", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function TermsAndConditionsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Terms & Conditions", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <TermsAndConditionsContent />
    </>
  );
}
