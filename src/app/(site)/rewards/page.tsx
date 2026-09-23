import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import { getRewardsGuide } from "@/lib/wallet/guide";
import { GUIDE_FAQS } from "@/lib/wallet/earn-guide";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd, defaultOgImage } from "@/lib/seo";
import RewardsContent from "./Content";

const title = "Ways to Earn YO Credits — Rewards, Offers & Coupons Guide | YashOrbit";
const description =
  "Every way to earn YashOrbit credits — signup, journey stages, referrals, daily visits and more — how much you get, when, what to complete, and how to use credits with offers and coupon codes.";
const path = "/rewards";

const baseMetadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image: defaultOgImage }),
};

export const generateMetadata = () => withSeoOverrides("/rewards", baseMetadata);

// Amounts come from the live reward rules, so this page is rendered per request.
export const dynamic = "force-dynamic";

export default async function RewardsPage() {
  const [guide, user] = await Promise.all([getRewardsGuide(), getCurrentPortalUser()]);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Rewards", path },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(GUIDE_FAQS)) }} />
      <RewardsContent guide={guide} signedIn={Boolean(user)} defaultAudience={user?.role ?? "trainee"} faqs={GUIDE_FAQS} />
    </>
  );
}
