"use client";

import { Rocket, Handshake, Building2, Headphones } from "lucide-react";
import StatsBand from "@/components/sections/StatsBand";
import ChecklistGrid from "@/components/sections/ChecklistGrid";

// Same figures already shown on /about/our-mission and /about/success-stories —
// reused verbatim here, never re-invented for this page.
const REAL_STATS = [
  { value: 12, suffix: "+", label: "Projects Shipped", icon: Rocket },
  { value: 100, suffix: "%", label: "Client Satisfaction", icon: Handshake },
  { value: 4, suffix: "+", label: "Industries Served", icon: Building2 },
  { value: 24, suffix: "/7", label: "Support Availability", icon: Headphones },
];

const TRUST_ITEMS = [
  { title: "Experienced Engineering Team", description: "Senior engineers, not a rotating pool of freelancers." },
  { title: "Real Project Experience", description: "Every offer is backed by production-grade delivery, not a portfolio filler." },
  { title: "Senior Mentorship", description: "Training and internship programs are led by working engineers." },
  { title: "100% Code Ownership", description: "Full source and IP ownership on every software engagement." },
  { title: "NDA Protection", description: "Your project details and data stay confidential, always." },
  { title: "Transparent Engagement", description: "Clear scope, clear pricing, clear timelines — no hidden costs." },
];

export default function WhyYashOrbitSection() {
  return (
    <>
      <StatsBand title="Why YashOrbit?" description="A festival discount is only worth it if the work behind it is real." stats={REAL_STATS} />
      <ChecklistGrid
        id="why-yashorbit"
        title="Built for trust, not just discounts"
        description="A steep discount can make anyone pause — here's exactly what backs every festival offer on this page."
        items={TRUST_ITEMS}
        columns={3}
        tone="muted"
      />
    </>
  );
}
