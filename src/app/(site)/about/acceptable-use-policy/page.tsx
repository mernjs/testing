import type { Metadata } from "next";
import AcceptableUsePolicyContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Acceptable Use Policy | YashOrbit";
const description =
  "YashOrbit's Acceptable Use Policy — the rules for using our website and systems, prohibited activities, security responsibilities, and responsible disclosure.";
const path = "/about/acceptable-use-policy";

const image = "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Acceptable Use Policy", "AUP", "Responsible Disclosure", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AcceptableUsePolicyPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Acceptable Use Policy", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <AcceptableUsePolicyContent />
    </>
  );
}
