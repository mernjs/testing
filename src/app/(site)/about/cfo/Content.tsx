"use client";

import { Calculator, Calendar, TrendingUp, ShieldCheck, FileBarChart } from "lucide-react";
import ExecutiveProfile from "@/components/sections/ExecutiveProfile";
import { brandify } from "@/lib/brand";

// Temporary placeholder photo — swap for Shikha's actual headshot when available.
const PHOTO = "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1200&auto=format&fit=crop";

export default function CfoContent() {
  return (
    <ExecutiveProfile
      name="Shikha Singh"
      role="Chief Financial Officer"
      tagline={brandify("Chief Financial Officer, YashOrbit")}
      heroDescription={brandify("Keeping YashOrbit's growth financially disciplined — the compliance, reporting, and pricing structures that let ambition and financial control move together, not against each other.")}
      heroIcon={Calculator}
      photo={PHOTO}
      bioParagraphs={[
        "Shikha qualified as a Chartered Accountant and spent the years that followed in corporate finance and investment analysis roles, working across statutory reporting, budgeting, and financial planning for growing companies. That combination of compliance discipline and analytical rigor became the foundation of how she runs a finance function.",
        brandify("She joined YashOrbit as Chief Financial Officer, where she owns financial planning, statutory compliance, and pricing strategy across the company's services, products, and training lines."),
      ]}
      bioStats={[
        { label: "Years in Finance", value: "8+", icon: Calendar },
        { label: "Revenue Lines Managed", value: "3", icon: TrendingUp },
        { label: "On-time Statutory Filings", value: "100%", icon: ShieldCheck },
        { label: "Focus", value: "Financial Planning & Compliance", icon: FileBarChart },
      ]}
      overviewTitle="Leadership overview"
      overviewDescription="How Shikha approaches running the company's finances."
      overviewItems={[
        { title: "Compliance Is a Floor, Not a Goal", description: "\"Meeting statutory requirements is the minimum bar. A finance function should also tell leadership something useful about the business.\"" },
        { title: "Forecast in Ranges, Not Single Numbers", description: "\"A single-point forecast just tells you where you'll be wrong. I plan around a range and revisit it monthly.\"" },
        { title: "Price to Protect Margin, Not Just Win the Deal", description: "\"Every commercial term gets checked against real delivery cost before it's approved, not after.\"" },
        { title: "Clear Numbers, No Jargon", description: "\"If a leadership team member can't understand a financial report in five minutes, I've written it wrong.\"" },
      ]}
      expertiseItems={[
        { title: "Financial Planning & Analysis", description: "Building budgets, forecasts, and margin models that reflect how the business actually operates." },
        { title: "Statutory Compliance & Audit", description: "Managing tax filings, statutory obligations, and audit readiness across the company's financial calendar." },
        { title: "Pricing & Unit Economics", description: "Structuring commercial terms across project work, products, and training so every revenue line is priced sustainably." },
        { title: "Treasury & Cash Flow Management", description: "Maintaining a current, accurate view of cash position and runway to support confident planning decisions." },
      ]}
      responsibilityItems={[
        { title: "Financial Planning & Reporting", description: "Owns budgeting, forecasting, and monthly financial reporting to the leadership team." },
        { title: "Statutory Compliance", description: "Manages tax filings, statutory registrations, and audit coordination across the company's obligations." },
        { title: "Pricing Strategy", description: "Sets and reviews commercial pricing models across services, products, and training." },
        { title: "Treasury Management", description: "Tracks cash position and runway, and plans spending and hiring decisions around it." },
      ]}
      achievementsDescription={brandify("A few of the milestones Shikha has led at YashOrbit.")}
      achievements={[
        { title: brandify("Rebuilt YashOrbit's Financial Reporting Framework"), description: "Introduced monthly financial reporting to the leadership team, replacing ad hoc reviews with a consistent, data-driven cadence.", skills: ["Financial Reporting", "Process Design"] },
        { title: "Structured Pricing Across Every Revenue Line", description: "Reworked commercial models for project work, resource augmentation, and training to reflect true delivery cost.", skills: ["Pricing Strategy", "Unit Economics"] },
        { title: "Maintained a Clean Compliance Record", description: "Kept statutory filings and audit documentation consistently on schedule since joining the company.", skills: ["Statutory Compliance", "Audit Readiness"] },
      ]}
      visionStatement={brandify("I want YashOrbit's finances to be a source of confidence for the leadership team, not a source of surprises. That means clean books, defensible pricing, and forecasts the team can actually plan around — so every strategic decision is made with a clear, accurate picture of what the company can afford.")}
      visionQuote="Good financial management should be quiet. If the monthly close is dramatic or the numbers keep surprising leadership, something upstream went wrong — my job is to make sure that doesn't happen."
      ctaHeading="Want to talk with our finance leadership?"
      ctaDescription="For engagements with non-standard commercial terms or procurement requirements, we're glad to bring Shikha directly into the conversation."
    />
  );
}
