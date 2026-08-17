"use client";

import {
  Scale, FileText, UserCheck, Compass, Copyright, KeyRound, CreditCard, Lock,
  ShieldAlert, Network, XCircle, Gavel, Mail, Calendar,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import LegalSection from "@/components/sections/LegalSection";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

const toc = [
  { id: "introduction", label: "Introduction & Scope" },
  { id: "eligibility", label: "Eligibility" },
  { id: "use-of-site", label: "Use of the Site" },
  { id: "intellectual-property", label: "Intellectual Property Rights" },
  { id: "accounts", label: "Accounts & Security" },
  { id: "payment-terms", label: "Payment & Commercial Terms" },
  { id: "confidentiality-privacy", label: "Confidentiality & Data Privacy" },
  { id: "warranties-liability", label: "Warranties & Limitation of Liability" },
  { id: "third-party-links", label: "Third-Party Links" },
  { id: "term-termination", label: "Term & Termination" },
  { id: "governing-law", label: "Governing Law & Dispute Resolution" },
  { id: "contact-information", label: "Contact" },
  { id: "last-updated", label: "Last Updated" },
];

export default function TermsAndConditionsContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Terms & Conditions"
        subtitle="The ground rules for using our site."
        description="These Terms govern your access to and use of our website. Your specific project terms with us are set out separately, in your signed Client Service Agreement, MSA, and Statement of Work."
        icon={Scale}
        image="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1200&auto=format&fit=crop"
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
                  brandify("These Terms & Conditions (\"Terms\") govern your access to and use of the YashOrbit Technologies Private Limited (\"YashOrbit\", \"we\", \"us\") website and any related digital properties (together, the \"Site\"). By using the Site, you agree to these Terms."),
                  "These Terms govern general use of our Site only. They do not govern the commercial terms of any specific project or engagement — those are set out in the applicable Client Service Agreement, Master Service Agreement, and Statement of Work executed with you separately.",
                ]}
              />

              <LegalSection
                id="eligibility"
                title="Eligibility"
                icon={UserCheck}
                paragraphs={[
                  "You must be at least 18 years old, or accessing the Site under the supervision of a parent or guardian, and legally capable of entering a binding agreement under Indian law (the Indian Contract Act, 1872) to use this Site for any transactional purpose.",
                ]}
              />

              <LegalSection
                id="use-of-site"
                title="Use of the Site"
                icon={Compass}
                paragraphs={[
                  "You may use the Site to learn about our services, contact us, and, where offered, access client-facing tools or portals we provide.",
                  "You agree to use the Site only for lawful purposes and in accordance with our Acceptable Use Policy, which is incorporated into these Terms by reference.",
                ]}
              />

              <LegalSection
                id="intellectual-property"
                title="Intellectual Property Rights"
                icon={Copyright}
                paragraphs={[
                  "All content on the Site — including our name, logo, and branding, text, graphics, and code — is owned by or licensed to YashOrbit and protected under Indian and international intellectual property law. Nothing in these Terms transfers any ownership of that content to you.",
                  "You may not copy, reproduce, distribute, or create derivative works from Site content without our prior written consent, except as necessary for normal browsing use. Any feedback or suggestions you provide about our Site or services may be used by us without obligation or compensation to you.",
                ]}
              />

              <LegalSection
                id="accounts"
                title="Accounts & Security"
                icon={KeyRound}
                paragraphs={[
                  "If the Site offers account creation, such as a client portal, you're responsible for maintaining the confidentiality of your login credentials and for all activity under your account.",
                  brandify("Notify us immediately at security@yashorbit.com if you suspect unauthorized access to your account."),
                ]}
              />

              <LegalSection
                id="payment-terms"
                title="Payment & Commercial Terms"
                icon={CreditCard}
                paragraphs={[
                  "The Site itself does not process payments for our core software development or consulting services — those are governed by the commercial terms in your Client Service Agreement, MSA, and SOW.",
                  "Where the Site offers any direct payment feature, such as for a training course or digital product, the applicable price, currency, and payment method will be clearly displayed before you complete a purchase, and our Refund & Cancellation Policy will apply.",
                ]}
              />

              <LegalSection
                id="confidentiality-privacy"
                title="Confidentiality & Data Privacy"
                icon={Lock}
                paragraphs={[
                  "Any confidential information exchanged as part of a business relationship with us is governed by the Mutual NDA or the confidentiality clauses in your Client Service Agreement — not by these general Terms.",
                  "Our collection and use of personal data through the Site is governed by our Privacy Policy and Cookie Policy, incorporated into these Terms by reference.",
                ]}
              />

              <LegalSection
                id="warranties-liability"
                title="Warranties & Limitation of Liability"
                icon={ShieldAlert}
                paragraphs={[
                  "The Site and its content are provided \"as is\" and \"as available.\" We don't warrant that the Site will be uninterrupted, error-free, or free of harmful components, though we take reasonable steps to ensure it is. Nothing on the Site constitutes professional, legal, or financial advice.",
                  "To the maximum extent permitted by law, YashOrbit isn't liable for any indirect, incidental, special, or consequential damages arising from your use of the Site. Nothing in these Terms limits liability for fraud, gross negligence, or any liability that can't be excluded under applicable Indian law.",
                  "You agree to indemnify and hold YashOrbit harmless from any claim, loss, or damage arising from your misuse of the Site or violation of these Terms.",
                ]}
              />

              <LegalSection
                id="third-party-links"
                title="Third-Party Links"
                icon={Network}
                paragraphs={[
                  "The Site may contain links to third-party websites. We don't endorse and aren't responsible for the content or practices of those sites.",
                ]}
              />

              <LegalSection
                id="term-termination"
                title="Term & Termination"
                icon={XCircle}
                paragraphs={[
                  "These Terms remain in effect for as long as you use the Site. We may suspend or restrict your access to the Site at our discretion, particularly in the event of a violation of these Terms or the Acceptable Use Policy.",
                ]}
              />

              <LegalSection
                id="governing-law"
                title="Governing Law & Dispute Resolution"
                icon={Gavel}
                paragraphs={[
                  "These Terms are governed by the laws of India. The courts at Bengaluru have exclusive jurisdiction over any dispute arising from these Terms.",
                  brandify("We encourage you to first raise any concern with us directly at legal@yashorbit.com. If unresolved within 30 days, either party may pursue the matter through the courts identified above, or through arbitration if separately agreed."),
                ]}
              />

              <LegalSection
                id="contact-information"
                title="Contact"
                icon={Mail}
                paragraphs={[
                  brandify("Questions about these Terms, or want permission to use content from our website in your own materials? Reach out to legal@yashorbit.com."),
                ]}
              />

              <LegalSection
                id="last-updated"
                title="Last Updated"
                icon={Calendar}
                paragraphs={[
                  "These Terms & Conditions were last updated on August 17, 2026. We may update these Terms from time to time; continued use of the Site after an update constitutes acceptance of the revised Terms. Material changes will be highlighted on the Site.",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Have questions about our Terms?"
        description="Reach out to our team any time — we're happy to walk through exactly what these Terms mean for you."
        ctaLabel="Contact Us"
      />
    </div>
  );
}
