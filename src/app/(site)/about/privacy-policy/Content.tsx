"use client";

import {
  ShieldCheck, FileText, ClipboardList, Workflow, Share2, Archive, Cookie, Network,
  Globe, UserCheck, Baby, Lock, Mail, Calendar,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import LegalSection from "@/components/sections/LegalSection";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

const toc = [
  { id: "introduction", label: "Introduction & Scope" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-information", label: "How We Use Information" },
  { id: "how-we-share-information", label: "How We Share Information" },
  { id: "data-retention", label: "Data Retention" },
  { id: "cookies-policy", label: "Cookies Policy" },
  { id: "data-protection", label: "Data Protection & Security" },
  { id: "cross-border-transfers", label: "Cross-Border Data Transfers" },
  { id: "user-rights", label: "Your Rights" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "contact-information", label: "Grievance Redressal & Contact" },
  { id: "last-updated", label: "Last Updated" },
];

export default function PrivacyPolicyContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Privacy Policy"
        subtitle="Your data, secured and respected."
        description="We take your privacy seriously. This policy outlines exactly how we collect, use, and protect your information in compliance with India's Digital Personal Data Protection Act, 2023 and, where applicable, the GDPR."
        icon={ShieldCheck}
        image="https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=1200&auto=format&fit=crop"
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
                  brandify("This Privacy Policy explains what personal data YashOrbit Technologies Private Limited (\"YashOrbit\", \"we\", \"us\", or \"our\") collects, why we collect it, how we use and protect it, and what rights you have over it — whether you're a website visitor, a job applicant, a client, or an end user of a product we've built. We've tried to write this in plain language rather than dense legal jargon, because you should actually be able to understand what you're agreeing to."),
                  "This Policy applies to personal data we collect through our website, our recruitment process, and our client and vendor relationships. Where we process personal data on behalf of a client — for example, building software that stores that client's own customers' data — the client's own privacy policy governs that end-user relationship, and our handling of that data is governed by the Data Processing Agreement executed with that client, not this Policy.",
                  "By using our website or engaging our services, you agree to the practices described in this policy. If you don't agree with these terms, we'd ask that you refrain from using our site or contact us directly with your concerns.",
                ]}
              />

              <LegalSection
                id="information-we-collect"
                title="Information We Collect"
                icon={ClipboardList}
                paragraphs={[
                  "We collect information in a few different ways: directly from you when you fill out a contact form, apply for a role, or engage us as a client, automatically through your use of our website, and occasionally from third parties like analytics or background-verification partners.",
                ]}
                bullets={[
                  "Contact & identity data — name, email, phone number, company name, and job title",
                  "Account data — login credentials and preferences, if you create an account with us",
                  "Recruitment data — resume, work history, education, interview notes, and background verification results, for job applicants",
                  "Technical & usage data — IP address, browser type, device information, and pages visited, collected automatically via cookies and analytics tools",
                  "Communication data — emails, chat messages, and meeting notes generated through our interactions with you",
                  "Client & vendor business data — company details, billing information, and contract terms, where we have a business relationship",
                ]}
              />

              <LegalSection
                id="how-we-use-information"
                title="How We Use Information"
                icon={Workflow}
                paragraphs={[
                  "We process personal data only where we have a valid legal basis — your consent, the necessity of processing to perform a contract with you, our legitimate business interests, or a legal obligation we must comply with.",
                ]}
                bullets={[
                  "Responding to inquiries and providing requested information",
                  "Delivering, managing, and supporting our services to clients",
                  "Processing job applications and managing recruitment",
                  "Improving our website, products, and services through analytics",
                  "Sending updates, newsletters, or marketing communications, where you've opted in",
                  "Complying with legal, tax, and regulatory obligations",
                  "Detecting, preventing, and investigating security incidents or fraud",
                ]}
              />

              <LegalSection
                id="how-we-share-information"
                title="How We Share Information"
                icon={Share2}
                paragraphs={[
                  "We do not sell your personal data. We share it only in a limited set of circumstances, and only to the extent necessary:",
                ]}
                bullets={[
                  "With service providers who help us operate — cloud hosting, email delivery, analytics, and payment processing — bound by confidentiality and data protection obligations",
                  "With professional advisors, such as lawyers or auditors, where necessary",
                  "With government or regulatory authorities where legally required",
                  "With a successor entity in the event of a merger, acquisition, or restructuring, subject to equivalent protection of your data",
                ]}
              />

              <LegalSection
                id="data-retention"
                title="Data Retention"
                icon={Archive}
                paragraphs={[
                  "We retain personal data only for as long as necessary for the purpose it was collected, or as required by applicable law — for example, statutory financial and tax record retention periods under Indian law.",
                  "Recruitment data for unsuccessful candidates is retained for 12 months, after which it's securely deleted unless you consent to longer retention for future opportunities.",
                ]}
              />

              <LegalSection
                id="cookies-policy"
                title="Cookies Policy"
                icon={Cookie}
                paragraphs={[
                  "Our website uses cookies and similar technologies to improve your browsing experience, understand how visitors use our site, and remember your preferences. Cookies are small text files stored on your device.",
                  "You can accept or customize non-essential cookies through the consent banner shown on your first visit, or control them at any time through your browser settings. Disabling certain cookies may affect the functionality of parts of our website.",
                ]}
                bullets={[
                  "Strictly necessary cookies required for the site to function — these can't be disabled",
                  "Analytics & performance cookies (e.g. Google Analytics, Microsoft Clarity) that help us understand site usage patterns",
                  "Functional cookies that remember preferences like theme settings",
                  "Marketing & advertising cookies (e.g. Meta Pixel, LinkedIn Insight Tag) used to measure campaign effectiveness, where applicable",
                ]}
              />

              <LegalSection
                id="data-protection"
                title="Data Protection & Security"
                icon={ShieldCheck}
                paragraphs={[
                  "We implement appropriate technical and organizational measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction — including encryption in transit, access controls, multi-factor authentication, and regular security reviews.",
                  "While we take data protection seriously and follow industry best practices, no method of transmission over the internet or electronic storage is 100% secure. In the unlikely event of a data breach affecting your personal data, we'll notify you and the relevant authority as required by applicable law, without undue delay.",
                ]}
              />

              <LegalSection
                id="cross-border-transfers"
                title="Cross-Border Data Transfers"
                icon={Globe}
                paragraphs={[
                  "As an India-based company serving international clients, we may transfer personal data outside India, including to cloud infrastructure providers. Where we do so, we rely on appropriate safeguards, such as standard contractual clauses, adequacy determinations, or the data importer's certification under a recognized framework.",
                ]}
              />

              <LegalSection
                id="user-rights"
                title="Your Rights"
                icon={UserCheck}
                paragraphs={[
                  "Subject to applicable law, you have rights over your personal data. To exercise any of these, simply contact our Data Protection Officer using the details below.",
                ]}
                bullets={[
                  "Access the personal data we hold about you",
                  "Correct inaccurate or incomplete data",
                  "Request erasure of your data, subject to our legal retention obligations",
                  "Withdraw consent at any time, where processing is based on consent",
                  "Object to or restrict certain processing, including direct marketing",
                  "Request a copy of your data in a portable format, where applicable under GDPR",
                  "Nominate another individual to exercise these rights on your behalf in the event of your death or incapacity, as provided under India's Digital Personal Data Protection Act, 2023",
                  "Lodge a complaint with the Data Protection Board of India, or, for EU/UK data subjects, your local supervisory authority",
                ]}
              />

              <LegalSection
                id="childrens-privacy"
                title="Children's Privacy"
                icon={Baby}
                paragraphs={[
                  "Our services are not directed at children. We do not knowingly collect personal data from individuals under 18. If we learn we've inadvertently collected such data, we'll delete it promptly, consistent with the consent requirements for processing a child's data under Indian law.",
                ]}
              />

              <LegalSection
                id="contact-information"
                title="Grievance Redressal & Contact"
                icon={Mail}
                paragraphs={[
                  "If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your information, we encourage you to reach out directly to our Data Protection Officer.",
                  brandify("You can contact us at privacy@yashorbit.com. We'll acknowledge your request within 7 days and aim to resolve it within 30 days, or as required by applicable law."),
                ]}
              />

              <LegalSection
                id="last-updated"
                title="Last Updated"
                icon={Calendar}
                paragraphs={[
                  "This Privacy Policy was last updated on August 17, 2026. We may update this policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. Material changes will be notified via our website or by email, and reflected by updating the date above.",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Questions about your data?"
        description="Reach out to our team any time — we're happy to walk through exactly how your information is handled."
        ctaLabel="Contact Us"
      />
    </div>
  );
}
