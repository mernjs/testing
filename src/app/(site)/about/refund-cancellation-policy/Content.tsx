"use client";

import {
  ReceiptText, FileText, Code2, GraduationCap, Ban, Banknote, Mail, Gavel, Calendar,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import LegalSection from "@/components/sections/LegalSection";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

const toc = [
  { id: "introduction", label: "Introduction & Scope" },
  { id: "development-engagements", label: "Development & Consulting Engagements" },
  { id: "training-programs", label: "Training Programs" },
  { id: "non-refundable-items", label: "Non-Refundable Items" },
  { id: "how-refunds-are-processed", label: "How Refunds Are Processed" },
  { id: "requesting-a-refund", label: "Requesting a Cancellation or Refund" },
  { id: "dispute-resolution", label: "Dispute Resolution" },
  { id: "contact-information", label: "Contact" },
  { id: "last-updated", label: "Last Updated" },
];

export default function RefundCancellationPolicyContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Refund & Cancellation Policy"
        subtitle="Fair terms if plans change."
        description="This policy explains when and how you can cancel an engagement with us, and what refund, if any, applies — whether it's a development project, a training program, or a direct purchase on our site."
        icon={ReceiptText}
        image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop"
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-32 p-6 rounded-2xl bg-muted/30 border border-border/50">
                <h3 className="text-lg font-bold text-foreground mb-4">On this page</h3>
                <ul className="space-y-3">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-12">
              <LegalSection
                id="introduction"
                title="Introduction & Scope"
                icon={FileText}
                paragraphs={[
                  brandify("This Policy explains when and how a client, trainee, or purchaser may cancel an engagement with YashOrbit Technologies Private Limited (\"YashOrbit\") and what refund, if any, applies."),
                  "It applies to client software development and consulting engagements governed by a Statement of Work, training and industrial-training program enrollments, and any direct digital purchase made through our Site. Where a specific SOW, Client Service Agreement, or training enrollment agreement states different refund terms, those specific terms govern over this general Policy.",
                ]}
              />

              <LegalSection
                id="development-engagements"
                title="Development & Consulting Engagements"
                icon={Code2}
                paragraphs={[
                  "How much of your payment is refundable depends on how far along the engagement is when you cancel:",
                ]}
                bullets={[
                  "Before work begins (post-signature, pre-kickoff) — full refund of any advance paid, less a 10% processing fee to cover administrative and pre-engagement costs already incurred",
                  "After a milestone is delivered and accepted — no refund for work already delivered and accepted; any advance for undelivered milestones is refunded",
                  "Mid-milestone, work in progress but not yet delivered — refund of the undelivered portion, calculated pro-rata based on actual effort or hours logged against that milestone",
                  "Client-caused delay leading to cancellation — refund calculated the same way, but we may also invoice for reasonably incurred costs, such as reserved team capacity, per the SOW",
                ]}
              />

              <LegalSection
                id="training-programs"
                title="Training Programs"
                icon={GraduationCap}
                paragraphs={[
                  "For our training and industrial-training programs, refunds depend on how close to the batch start date you cancel:",
                ]}
                bullets={[
                  "More than 7 days before batch start — full refund, less a 5% administrative fee",
                  "Within 7 days of batch start — 50% refund",
                  "After the batch has started — no refund; a one-time transfer to a future batch may be offered at our discretion",
                ]}
              />

              <LegalSection
                id="non-refundable-items"
                title="Non-Refundable Items"
                icon={Ban}
                paragraphs={[
                  "A few categories of spend aren't refundable, regardless of when you cancel:",
                ]}
                bullets={[
                  "Any milestone or deliverable already accepted by the client",
                  "Third-party costs already incurred on the client's behalf — licenses, domain registrations, paid API credits — unless recoverable from that third party",
                  "Custom-configured software, once development work has genuinely begun, beyond the pro-rata calculation above",
                ]}
              />

              <LegalSection
                id="how-refunds-are-processed"
                title="How Refunds Are Processed"
                icon={Banknote}
                paragraphs={[
                  "Approved refunds are processed to the original payment method within 15 business days of approval. Where a refund is due in a currency different from the original payment, we use the same foreign exchange rate reference policy applied at the time of original payment.",
                  "Subscription-based (SaaS) engagements can be cancelled mid-cycle, but fees already billed for the current billing cycle are generally non-refundable, consistent with standard SaaS practice — check your specific subscription agreement for exact terms. If YashOrbit cancels an engagement for reasons other than client breach, you receive a full refund of any amount paid for undelivered work, with no processing fee deducted.",
                ]}
              />

              <LegalSection
                id="requesting-a-refund"
                title="Requesting a Cancellation or Refund"
                icon={Mail}
                paragraphs={[
                  brandify("Send a written request to accounts@yashorbit.com or your account manager, stating the engagement or order reference and reason for cancellation. We'll confirm receipt within 3 business days and provide a refund decision within 10 business days."),
                ]}
              />

              <LegalSection
                id="dispute-resolution"
                title="Dispute Resolution"
                icon={Gavel}
                paragraphs={[
                  brandify("If you disagree with a refund decision, you may escalate in writing to legal@yashorbit.com for a second review before pursuing the dispute resolution process in your Client Service Agreement or our Terms & Conditions. Our total liability for any refund-related claim won't exceed the amount actually paid for the specific engagement or purchase in question."),
                ]}
              />

              <LegalSection
                id="contact-information"
                title="Contact"
                icon={Mail}
                paragraphs={[
                  brandify("Questions about a refund or cancellation? Reach out to accounts@yashorbit.com and we'll walk you through it."),
                ]}
              />

              <LegalSection
                id="last-updated"
                title="Last Updated"
                icon={Calendar}
                paragraphs={[
                  "This Refund & Cancellation Policy was last updated on August 17, 2026. The terms in effect at the time you sign your SOW or enrollment agreement govern that specific engagement, even if this Policy is later updated.",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Have a question before you commit?"
        description="Talk to our team about engagement structure, milestones, and payment terms before you sign anything."
        ctaLabel="Contact Us"
      />
    </div>
  );
}
