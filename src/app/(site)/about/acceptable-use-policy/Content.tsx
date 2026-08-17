"use client";

import {
  ShieldAlert, FileText, CheckCircle2, Ban, Bug, Copyright, Lock, AlertTriangle, Gavel, Mail, Calendar,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import LegalSection from "@/components/sections/LegalSection";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

const toc = [
  { id: "introduction", label: "Introduction & Scope" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "prohibited-activities", label: "Prohibited Activities" },
  { id: "security-responsibilities", label: "Security & Responsible Disclosure" },
  { id: "intellectual-property", label: "Intellectual Property Rights" },
  { id: "data-privacy", label: "Data Privacy" },
  { id: "enforcement", label: "Enforcement & Consequences" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact-information", label: "Contact" },
  { id: "last-updated", label: "Last Updated" },
];

export default function AcceptableUsePolicyContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Acceptable Use Policy"
        subtitle="Keeping our systems safe for everyone."
        description="This policy sets out the rules for using our website, systems, and any product or platform we operate, so they stay safe, lawful, and available for everyone."
        icon={ShieldAlert}
        image="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop"
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
                  brandify("This Acceptable Use Policy (\"AUP\") sets out the rules for using YashOrbit Technologies Private Limited's (\"YashOrbit\", \"we\", \"us\") website, systems, and any product or platform we operate."),
                  "It applies to anyone who accesses or uses our Site, our client-facing platforms, or any system we provide — including clients, vendors, contractors, and members of the public. For employees specifically, this AUP works alongside the Information Security and Acceptable Use of Company Assets sections of the Employee Handbook, which govern internal device and system use in more detail.",
                ]}
              />

              <LegalSection
                id="acceptable-use"
                title="Acceptable Use"
                icon={CheckCircle2}
                paragraphs={[
                  "You may use our systems only for their intended, lawful purpose — for example, browsing our Site, using a client portal we've provided you, or interacting with a product we've built for you.",
                ]}
              />

              <LegalSection
                id="prohibited-activities"
                title="Prohibited Activities"
                icon={Ban}
                paragraphs={[
                  "You must not use our systems to:",
                ]}
                bullets={[
                  "Attempt unauthorized access to any account, system, or data, including through hacking, phishing, or credential theft",
                  "Introduce viruses, malware, ransomware, or any other harmful code",
                  "Conduct or facilitate a denial-of-service attack or any activity that disrupts system availability",
                  "Scrape, crawl, or harvest data from our systems beyond normal, permitted use",
                  "Upload, transmit, or store unlawful, defamatory, obscene, or infringing content",
                  "Impersonate any person or entity, or misrepresent your affiliation with YashOrbit",
                  "Send unsolicited bulk communications (spam)",
                  "Reverse-engineer, decompile, or attempt to extract source code from any YashOrbit product, except as permitted by law",
                  "Use our systems in a way that violates any applicable law, including the Information Technology Act, 2000",
                ]}
              />

              <LegalSection
                id="security-responsibilities"
                title="Security & Responsible Disclosure"
                icon={Bug}
                paragraphs={[
                  "If we've provided you — as a client, vendor, or contractor — with account credentials or system access, you're responsible for keeping those credentials confidential and for all activity under your account.",
                  brandify("Report any suspected security vulnerability or incident involving our systems to security@yashorbit.com immediately. We welcome responsible disclosure and won't pursue legal action against good-faith security researchers who follow reasonable, non-destructive disclosure practices."),
                ]}
              />

              <LegalSection
                id="intellectual-property"
                title="Intellectual Property Rights"
                icon={Copyright}
                paragraphs={[
                  "Use of our systems doesn't grant you any ownership or license rights beyond what is expressly agreed in a separate contract, such as a Client Service Agreement or software license.",
                ]}
              />

              <LegalSection
                id="data-privacy"
                title="Data Privacy"
                icon={Lock}
                paragraphs={[
                  "Any personal data you submit through our systems is handled per our Privacy Policy. Please don't use our systems to submit another person's personal data without their consent.",
                ]}
              />

              <LegalSection
                id="enforcement"
                title="Enforcement & Consequences"
                icon={AlertTriangle}
                paragraphs={[
                  "Violation of this AUP may result in immediate suspension or termination of your access to our systems, without notice, in addition to any other legal remedy available to us.",
                  "Where a violation involves unlawful activity, we reserve the right to report the matter to the appropriate law enforcement or regulatory authority and to cooperate with any resulting investigation. You agree to indemnify YashOrbit against any claim, loss, or liability arising from your violation of this AUP.",
                ]}
              />

              <LegalSection
                id="governing-law"
                title="Governing Law"
                icon={Gavel}
                paragraphs={[
                  "This AUP is governed by the laws of India. Disputes are subject to the jurisdiction stated in our Terms & Conditions.",
                ]}
              />

              <LegalSection
                id="contact-information"
                title="Contact"
                icon={Mail}
                paragraphs={[
                  brandify("Found a security bug on our website? Report it responsibly to security@yashorbit.com — we appreciate good-faith security research."),
                ]}
              />

              <LegalSection
                id="last-updated"
                title="Last Updated"
                icon={Calendar}
                paragraphs={[
                  "This Acceptable Use Policy was last updated on August 17, 2026. We may revise this AUP periodically to address new risks or legal requirements; continued use after an update constitutes acceptance.",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Questions about acceptable use?"
        description="Reach out to our team any time — we're happy to clarify what's covered by this policy."
        ctaLabel="Contact Us"
      />
    </div>
  );
}
