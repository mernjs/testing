"use client";

import FAQAccordion from "@/components/sections/FAQAccordion";

export default function OffersFaqSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return <FAQAccordion title="Frequently asked questions" faqs={faqs} tone="muted" />;
}
