import type { Metadata } from "next";
import PrivacyPolicyContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Privacy Policy | YashOrbit";
const description =
  "YashOrbit's Privacy Policy — how we collect, use, and protect your information, including cookies, data protection, third-party services, and your rights.";
const path = "/about/privacy-policy";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Privacy Policy", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <PrivacyPolicyContent />
    </>
  );
}
