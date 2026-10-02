"use client";

import { Rocket, Handshake, Building2, Headphones } from "lucide-react";
import StatsBand from "@/components/sections/StatsBand";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import { useText } from "@/components/cms/TextContext";

// Same figures already shown on /about/our-mission and /about/success-stories —
// reused verbatim here, never re-invented for this page.
const REAL_STATS = (tx: (key: string) => string) => ([
  { value: 12, suffix: "+", label: tx("offers.whyYashOrbitSection.projects-shipped"), icon: Rocket },
  { value: 100, suffix: "%", label: tx("offers.whyYashOrbitSection.client-satisfaction"), icon: Handshake },
  { value: 4, suffix: "+", label: tx("offers.whyYashOrbitSection.industries-served"), icon: Building2 },
  { value: 24, suffix: "/7", label: tx("offers.whyYashOrbitSection.support-availability"), icon: Headphones },
]);

const TRUST_ITEMS = (tx: (key: string) => string) => ([
  { title: tx("offers.whyYashOrbitSection.experienced-engineering-team"), description: tx("offers.whyYashOrbitSection.senior-engineers-not-a-rotating-pool-of-") },
  { title: tx("offers.whyYashOrbitSection.real-project-experience"), description: tx("offers.whyYashOrbitSection.every-offer-is-backed-by-production-grad") },
  { title: tx("offers.whyYashOrbitSection.senior-mentorship"), description: tx("offers.whyYashOrbitSection.training-and-internship-programs-are-led") },
  { title: tx("offers.whyYashOrbitSection.100-code-ownership"), description: tx("offers.whyYashOrbitSection.full-source-and-ip-ownership-on-every-so") },
  { title: tx("offers.whyYashOrbitSection.nda-protection"), description: tx("offers.whyYashOrbitSection.your-project-details-and-data-stay-confi") },
  { title: tx("offers.whyYashOrbitSection.transparent-engagement"), description: tx("offers.whyYashOrbitSection.clear-scope-clear-pricing-clear-timeline") },
]);

export default function WhyUsSection() {
  const tx = useText();
  return (
    <>
      <StatsBand title={tx("offers.whyYashOrbitSection.why-yashorbit")} description={tx("offers.whyYashOrbitSection.a-festival-discount-is-only-worth-it-if-")} stats={REAL_STATS(tx)} />
      <ChecklistGrid
        id="why-us"
        title={tx("offers.whyYashOrbitSection.built-for-trust-not-just-discounts")}
        description={tx("offers.whyYashOrbitSection.a-steep-discount-can-make-anyone-pause-h")}
        items={TRUST_ITEMS(tx)}
        columns={3}
        tone="muted"
      />
    </>
  );
}
