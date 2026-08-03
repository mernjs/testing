"use client";

import {
  ShieldCheck, FileText, ClipboardList, Workflow, Cookie, Network, UserCheck, Lock, Mail, Calendar,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import LegalSection from "@/components/sections/LegalSection";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

const toc = [
  { id: "introduction", label: "Introduction" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-information", label: "How We Use Information" },
  { id: "cookies-policy", label: "Cookies Policy" },
  { id: "data-protection", label: "Data Protection" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "user-rights", label: "User Rights" },
  { id: "security-measures", label: "Security Measures" },
  { id: "contact-information", label: "Contact Information" },
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
        description="We take your privacy seriously. This policy outlines exactly how we collect, use, and protect your information in compliance with global standards."
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
                title="Introduction"
                icon={FileText}
                paragraphs={[
                  brandify("This Privacy Policy explains how YashOrbit (\"we\", \"us\", or \"our\") collects, uses, discloses, and safeguards information when you visit our website or use our services. We've tried to write this in plain language rather than dense legal jargon, because you should actually be able to understand what you're agreeing to."),
                  "By using our website or engaging our services, you agree to the practices described in this policy. If you don't agree with these terms, we'd ask that you refrain from using our site or contact us directly with your concerns.",
                ]}
              />

              <LegalSection
                id="information-we-collect"
                title="Information We Collect"
                icon={ClipboardList}
                paragraphs={[
                  "We collect information in a few different ways: directly from you when you fill out a contact form or request a consultation, automatically through your use of our website, and occasionally from third parties like analytics partners.",
                ]}
                bullets={[
                  "Contact details you provide, such as your name, email address, and company name",
                  "Project details you share with us through inquiry or consultation forms",
                  "Technical data such as IP address, browser type, and device information",
                  "Usage data, including pages visited and time spent on our site",
                  "Cookies and similar tracking technologies, described in more detail below",
                ]}
              />

              <LegalSection
                id="how-we-use-information"
                title="How We Use Information"
                icon={Workflow}
                paragraphs={[
                  "We use the information we collect for legitimate business purposes directly related to operating our website and delivering our services.",
                ]}
                bullets={[
                  "Responding to inquiries and consultation requests",
                  "Providing, maintaining, and improving our services",
                  "Sending relevant updates about projects you've engaged us for",
                  "Analyzing website usage to improve content and user experience",
                  "Meeting legal, regulatory, and contractual obligations",
                ]}
              />

              <LegalSection
                id="cookies-policy"
                title="Cookies Policy"
                icon={Cookie}
                paragraphs={[
                  "Our website uses cookies and similar technologies to improve your browsing experience, understand how visitors use our site, and remember your preferences. Cookies are small text files stored on your device.",
                  "You can control or disable cookies through your browser settings at any time. Disabling certain cookies may affect the functionality of parts of our website.",
                ]}
                bullets={[
                  "Essential cookies required for core site functionality",
                  "Analytics cookies that help us understand site usage patterns",
                  "Preference cookies that remember choices like theme settings",
                ]}
              />

              <LegalSection
                id="data-protection"
                title="Data Protection"
                icon={ShieldCheck}
                paragraphs={[
                  "We implement appropriate technical and organizational measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
                  "While we take data protection seriously and follow industry best practices, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
                ]}
              />

              <LegalSection
                id="third-party-services"
                title="Third-Party Services"
                icon={Network}
                paragraphs={[
                  "We may share information with trusted third-party service providers who help us operate our website and deliver our services, such as hosting providers, analytics platforms, and communication tools.",
                  "These third parties are only given access to the information necessary to perform their specific functions, and are contractually obligated to keep it confidential and secure. We do not sell your personal information to third parties.",
                ]}
              />

              <LegalSection
                id="user-rights"
                title="User Rights"
                icon={UserCheck}
                paragraphs={[
                  "Depending on your location, you may have certain rights regarding your personal information under applicable data protection laws. To exercise any of these rights, simply contact us using the details below.",
                ]}
                bullets={[
                  "The right to access the personal information we hold about you",
                  "The right to request correction of inaccurate information",
                  "The right to request deletion of your personal information",
                  "The right to object to or restrict certain processing",
                  "The right to withdraw consent where processing is based on consent",
                ]}
              />

              <LegalSection
                id="security-measures"
                title="Security Measures"
                icon={Lock}
                paragraphs={[
                  "We maintain a range of security measures designed to protect the confidentiality, integrity, and availability of the information we handle.",
                ]}
                bullets={[
                  "Encryption of data in transit using industry-standard protocols",
                  "Access controls limiting who within our team can view sensitive information",
                  "Regular review of our systems and practices for potential vulnerabilities",
                  "Secure hosting infrastructure with reputable cloud providers",
                ]}
              />

              <LegalSection
                id="contact-information"
                title="Contact Information"
                icon={Mail}
                paragraphs={[
                  "If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your information, we encourage you to reach out directly.",
                  "You can contact us at support@yashorbit.com or through our contact page, and we'll respond as promptly as we can.",
                ]}
              />

              <LegalSection
                id="last-updated"
                title="Last Updated"
                icon={Calendar}
                paragraphs={[
                  "This Privacy Policy was last updated on July 30, 2026. We may update this policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. Material changes will be reflected by updating the date above.",
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
