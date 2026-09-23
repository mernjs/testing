#!/usr/bin/env node
// Standalone seeder: Navratri + Dussehra festival campaigns for the Festival Offers module
// (src/lib/offers/*). Independent of scripts/demo/growth.mjs's "diwali/summer/newyear/..."
// campaign set — uses its own `festoffer-` id prefix so the two seeders never collide and
// either can be re-run/wiped on its own.
//
// 56 offers across both campaigns (30 Navratri + 26 Dussehra), all at a flat 90% discount,
// deliberately varied across pricing mode (percentage/flat/custom_quote), pricing unit
// (fixed/hour/month/year), audience, segment (any/new_user/existing_user), limit kind
// (slots/quantity), and offer type tags (flash, combo, hourly, subscription, referral,
// first_time, renewal, hiring, course, service, seasonal, ...) — the same "marketplace"
// variety pattern as growth.mjs's MARKET table.
//
// Run: npm run db:seed-navratri-dussehra-offers
import { MongoClient } from "mongodb";
import { ago, fromNow, audit, NOW } from "./demo/lib.mjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-navratri-dussehra-offers.mjs");
  process.exit(1);
}

const CAT_AUDIENCES = {
  "software-development": ["CLIENT", "BUSINESS"],
  "ai-automations": ["BUSINESS", "CLIENT"],
  "industrial-training": ["STUDENT", "LEARNER"],
  "resource-augmentation": ["HIRING", "BUSINESS"],
  "internship-program": ["INTERN", "STUDENT"],
};
const CAT_ELIGIBILITY = {
  "software-development": ["Registered companies, startups and founders", "Project scope shared before kickoff"],
  "ai-automations": ["Businesses with an existing process to automate", "Discovery call required"],
  "industrial-training": ["Students and fresh graduates", "Laptop with internet access"],
  "resource-augmentation": ["Companies hiring 1+ developers", "Minimum 3-month engagement"],
  "internship-program": ["Final-year and pre-final-year students", "Minimum 8 hours/week commitment"],
};

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

const stripCfg = (msg) => ({ enabled: true, message: msg, discountText: "UP TO 90% OFF", ctaText: "Claim Offer", ctaActionType: "url", ctaActionValue: "/offers", showCountdown: true, allowClose: true });
const popupCfg = (tpl) => ({ enabled: true, template: tpl, ctaText: "Claim Offer", ctaActionType: "url", ctaActionValue: "/offers", showCountdown: true, triggerType: "delay", triggerValue: 8, frequency: "daily" });

const FAQS = [
  { question: "Can I combine a coupon with this offer?", answer: "Yes — coupon discounts stack with the offer discount, capped at the original price." },
  { question: "How do I use my YashOrbit credits?", answer: "Sign in with the same email and tick \"Use my credits\" in the claim form." },
  { question: "Until when is the offer valid?", answer: "Until the campaign end date shown in the countdown on the offers page." },
];

const DAY = 86400000;
// Fixed real calendar dates for the campaign windows, IST (+05:30) explicit so the exact
// instant is deterministic regardless of the machine/server timezone this script runs on.
// Built with plain Date math, not fromNow() — fromNow()/ago() always overwrite the
// hour/minute/second to a random "business hour" (see lib.mjs), which is fine for
// day-granularity demo dates but destroys exact-date precision like "starts Oct 11".
const navratriStart = new Date("2026-10-11T00:00:00+05:30");
const navratriEnd = new Date("2026-10-19T23:59:59+05:30");
// Dussehra/Vijayadashami falls right after Navratri's 9 nights end — a short sale window
// immediately following, so the two campaigns never overlap and stay in festival order.
const dussehraStart = new Date("2026-10-20T00:00:00+05:30");
const dussehraEnd = new Date("2026-10-24T23:59:59+05:30");
// Day offsets from "now" (this script's run time) — used only for the campaign's createdAt
// audit stamp and for offers'/coupons' own validFrom/validUntil, where fromNow()'s random-hour
// behavior is harmless (they don't drive page-state resolution, only cosmetic "unlocks in" pills).
const daysUntil = (d) => (d.getTime() - NOW) / DAY;

const CAMPAIGNS = [
  {
    key: "navratri",
    name: "Navratri Mega Sale 2026",
    campaignType: "festival",
    themePreset: "custom",
    theme: { primaryColor: "#C2185B", accentColor: "#F9A825", bannerHeadline: "Nine Nights, Nine Ways to Save", bannerSubheadline: "Up to 90% off across software, AI, training, hiring & internships this Navratri" },
    // Not live yet (starts Oct 11) — /offers shows the "coming soon"/"future" countdown teaser
    // first, then flips itself to the full live page automatically on Oct 11 — via
    // StateWatcher's router.refresh() — with no manual step or redeploy needed.
    startDate: navratriStart,
    endDate: navratriEnd,
    start: daysUntil(navratriStart),
    end: daysUntil(navratriEnd),
    status: "scheduled",
    priority: 95,
    popupTemplate: "festival",
  },
  {
    key: "dussehra",
    name: "Dussehra Vijay Sale 2026",
    campaignType: "festival",
    themePreset: "custom",
    theme: { primaryColor: "#B71C1C", accentColor: "#F57F17", bannerHeadline: "Vijayadashami — Victory Over High Prices", bannerSubheadline: "The most auspicious time to start something new — up to 90% off" },
    startDate: dussehraStart,
    endDate: dussehraEnd,
    start: daysUntil(dussehraStart),
    end: daysUntil(dussehraEnd),
    status: "scheduled",
    priority: 92,
    popupTemplate: "festival",
  },
];

const campaigns = CAMPAIGNS.map((c) => ({
  _id: `festoffer-camp-${c.key}`,
  name: c.name,
  slug: `festoffer-${c.key}`,
  campaignType: c.campaignType,
  themePreset: c.themePreset,
  theme: c.theme,
  startDate: c.startDate ?? fromNow(c.start),
  endDate: c.endDate ?? fromNow(c.end),
  status: c.status,
  priority: c.priority,
  targetAudience: ["ALL"],
  isFeatured: true,
  faqs: FAQS,
  display: { strip: stripCfg(`${c.name} is live — up to 90% off`), popup: popupCfg(c.popupTemplate), pageTargeting: { mode: "all", pages: [] } },
  ...audit(fromNow(c.start - 3)),
}));
const campWindow = Object.fromEntries(CAMPAIGNS.map((c) => [c.key, c]));

// ---------------------------------------------------------------------------
// Offers — [title, category, subService, mode, originalPrice|null, offerTypes[], overrides]
// mode: "percentage" (always 90%), "flat" (always 90% of originalPrice), "custom_quote" (no numeric price)
// ---------------------------------------------------------------------------

const NAVRATRI_OFFERS = [
  ["Navratri Website Launch Package", "software-development", "web-app-development", "percentage", 500000, ["seasonal", "service", "limited_time"], {}],
  ["Nine Nights Mobile App Sprint", "software-development", "mobile-app-development", "percentage", 600000, ["seasonal", "project", "limited_time"], { slots: 9, cta: "Book my 9-night sprint" }],
  ["Garba Special: SaaS MVP Build", "software-development", "all", "flat", 800000, ["seasonal", "project", "business"], {}],
  ["Navratri AI Chatbot Bonanza", "ai-automations", "conversational-ai-chatbots", "percentage", 350000, ["seasonal", "first_time"], { segment: "new_user", cta: "Claim my welcome offer" }],
  ["Shakti Automation Combo", "ai-automations", "intelligent-process-automation", "percentage", 400000, ["combo", "business", "seasonal"], { linked: { kind: "service", label: "Intelligent Process Automation", href: "/ai-automations" } }],
  ["Nine Colors of AI — Data Analytics Deal", "ai-automations", "ai-powered-data-analytics", "flat", 300000, ["seasonal", "client"], {}],
  ["Dandiya Nights Dev — Hourly Rate", "resource-augmentation", "hourly-on-demand", "percentage", 1500, ["hourly", "hiring", "flash"], { unit: "hour", hours: 108, slots: 20, cta: "Lock my hourly rate" }],
  ["Navratri Dedicated Developer — Monthly", "resource-augmentation", "single-resource", "percentage", 120000, ["hiring", "business", "subscription"], { unit: "month" }],
  ["Vijay Squad: Package-Based Team", "resource-augmentation", "package-based-team", "custom_quote", null, ["hiring", "business", "combo"], { label: "Custom Quote — up to 90% off", cta: "Request my squad quote" }],
  ["Navratri Project-Based Hiring Deal", "resource-augmentation", "project-based", "flat", 200000, ["hiring", "project", "limited_time"], {}],
  ["Full-Stack MERN Bootcamp — Navratri Batch", "industrial-training", "mern-stack", "percentage", 48000, ["course", "student", "seasonal"], {}],
  ["Generative AI Program — 9 Nights Offer", "industrial-training", "generative-ai", "percentage", 55000, ["course", "student", "flash"], { hours: 216, slots: 50, cta: "Enrol before Navratri ends" }],
  ["Agentic AI Career Track — Navratri", "industrial-training", "agentic-ai", "flat", 60000, ["course", "student", "first_time"], { segment: "new_user" }],
  ["Computer Vision Weekend Special", "industrial-training", "computer-vision", "percentage", 45000, ["course", "student", "flash"], { hours: 48, slots: 25 }],
  ["Conversational AI Course — Loyalty Upgrade", "industrial-training", "conversational-ai", "percentage", 40000, ["renewal", "course", "student"], { segment: "existing_user", cta: "Upgrade for Navratri" }],
  ["MEAN Stack Bootcamp — Navratri", "industrial-training", "mean-stack", "flat", 46000, ["course", "student"], {}],
  ["MERN Stack Internship — Navratri Intake", "internship-program", "mern-stack", "percentage", 12000, ["course", "student", "seasonal"], { slots: 60 }],
  ["Generative AI Internship — Festive Batch", "internship-program", "generative-ai", "flat", 15000, ["course", "student", "limited_time"], {}],
  ["Agentic AI Internship — First-Timer Offer", "internship-program", "agentic-ai", "percentage", 14000, ["course", "student", "first_time"], { segment: "new_user" }],
  ["Computer Vision Internship Combo", "internship-program", "computer-vision", "custom_quote", null, ["combo", "student"], { label: "Custom Quote — up to 90% off" }],
  ["Navratri Flash: 9-Hour Landing Page Build", "software-development", "web-app-development", "flat", 30000, ["flash", "project", "limited_time"], { hours: 9, slots: 9, cta: "Book my flash slot" }],
  ["Garba Night Referral Rewards", "software-development", "all", "custom_quote", null, ["referral"], { aud: ["ALL"], label: "₹500 credits per referral", cta: "Get my referral link", linked: { kind: "product", label: "YashOrbit Rewards", href: "/offers" } }],
  ["Navratri Annual Cloud Care Plan", "software-development", "all", "percentage", 240000, ["subscription", "business"], { unit: "year" }],
  ["Managed AI Support Plan — Monthly", "ai-automations", "ai-integration-services", "percentage", 25000, ["subscription", "business"], { unit: "month" }],
  ["Nine Nights Chatbot Licence Pack", "ai-automations", "conversational-ai-chatbots", "percentage", 45000, ["service", "limited_time"], { slots: 25, kind: "quantity", hours: 180 }],
  ["Navratri QA & Automation Engineer Rate", "resource-augmentation", "hourly-on-demand", "flat", 1200, ["hourly", "hiring"], { unit: "hour" }],
  ["AI Engineer — Navratri Hourly Rate", "resource-augmentation", "hourly-on-demand", "percentage", 2500, ["hourly", "hiring", "flash"], { unit: "hour", hours: 72, slots: 10 }],
  ["Dedicated Team of 4 — Navratri Special", "resource-augmentation", "package-based-team", "percentage", 480000, ["hiring", "business", "subscription"], { unit: "month" }],
  ["Deal of the Navratri: Website + SEO + Hosting Combo", "software-development", "all", "percentage", 150000, ["combo", "service", "seasonal"], { isDealOfTheDay: true, isFeatured: true }],
  ["Data Science Career Track — 9 Nights Offer", "industrial-training", "all", "percentage", 45000, ["course", "student", "seasonal"], {}],
];

const DUSSEHRA_OFFERS = [
  ["Vijayadashami Website Launch Package", "software-development", "web-app-development", "percentage", 500000, ["seasonal", "service", "limited_time"], {}],
  ["Shastra Puja Special: Mobile App MVP", "software-development", "mobile-app-development", "flat", 600000, ["seasonal", "project"], {}],
  ["Ravana Dahan Flash: 24-Hour Landing Page", "software-development", "web-app-development", "flat", 25000, ["flash", "project", "limited_time"], { hours: 24, slots: 10, cta: "Book my flash slot" }],
  ["Vijay Sale: SaaS Platform Build", "software-development", "all", "custom_quote", null, ["business", "project"], { label: "Custom Quote — up to 90% off", cta: "Request my Vijay Sale quote" }],
  ["New Beginnings AI Chatbot Deal", "ai-automations", "conversational-ai-chatbots", "percentage", 350000, ["seasonal", "first_time"], { segment: "new_user" }],
  ["Dussehra Robotic Process Automation Combo", "ai-automations", "robotic-process-automation", "percentage", 420000, ["combo", "business"], { linked: { kind: "service", label: "Robotic Process Automation", href: "/ai-automations" } }],
  ["Predictive AI Workflows — Loyalty Upgrade", "ai-automations", "predictive-ai-workflows", "percentage", 380000, ["renewal", "business"], { segment: "existing_user" }],
  ["Document Intelligence — Vijayadashami Deal", "ai-automations", "document-intelligence", "flat", 280000, ["seasonal", "service"], {}],
  ["MERN Stack Bootcamp — Vijayadashami Batch", "industrial-training", "mern-stack", "percentage", 48000, ["course", "student", "seasonal"], {}],
  ["Generative AI Program — Victory Batch", "industrial-training", "generative-ai", "flat", 55000, ["course", "student"], {}],
  ["Agentic AI Career Track — First-Timer Offer", "industrial-training", "agentic-ai", "percentage", 52000, ["course", "student", "first_time"], { segment: "new_user" }],
  ["Conversational AI Weekend Flash", "industrial-training", "conversational-ai", "flat", 42000, ["flash", "course", "student"], { hours: 30, slots: 20 }],
  ["Computer Vision Career Track — Loyalty", "industrial-training", "computer-vision", "percentage", 46000, ["renewal", "course"], { segment: "existing_user" }],
  ["MERN Stack Internship — Vijayadashami Intake", "internship-program", "mern-stack", "percentage", 12000, ["course", "student"], {}],
  ["Generative AI Internship — New Beginnings", "internship-program", "generative-ai", "flat", 15000, ["course", "student", "first_time"], { segment: "new_user" }],
  ["Agentic AI Internship Combo", "internship-program", "agentic-ai", "custom_quote", null, ["combo", "student"], { label: "Custom Quote — up to 90% off" }],
  ["Conversational AI Internship — Victory Batch", "internship-program", "conversational-ai", "percentage", 14000, ["course", "student"], {}],
  ["Senior Developer — Vijayadashami Hourly Rate", "resource-augmentation", "hourly-on-demand", "percentage", 1500, ["hourly", "hiring", "flash"], { unit: "hour", hours: 60, slots: 15 }],
  ["Dedicated Developer — Monthly Victory Plan", "resource-augmentation", "single-resource", "flat", 130000, ["hiring", "subscription"], { unit: "month" }],
  ["Package-Based Team — Shastra Puja Special", "resource-augmentation", "package-based-team", "percentage", 500000, ["hiring", "business"], { unit: "month" }],
  ["Project-Based Hiring — Vijay Sale", "resource-augmentation", "project-based", "percentage", 220000, ["hiring", "project", "limited_time"], {}],
  ["Refer & Earn — Vijayadashami Bonus", "software-development", "all", "custom_quote", null, ["referral"], { aud: ["ALL"], label: "₹750 credits per referral", cta: "Get my referral link", linked: { kind: "product", label: "YashOrbit Rewards", href: "/offers" } }],
  ["Annual Cloud Care Plan — Vijayadashami", "software-development", "all", "percentage", 240000, ["subscription", "business"], { unit: "year" }],
  ["Deal of Vijayadashami: AI + App Bundle", "ai-automations", "all", "percentage", 260000, ["combo", "business", "seasonal"], { isDealOfTheDay: true, isFeatured: true, linked: { kind: "service", label: "AI & App Bundle", href: "/ai-automations" } }],
  ["Chatbot Starter Kit — Vijayadashami Licences", "ai-automations", "conversational-ai-chatbots", "percentage", 45000, ["service", "limited_time"], { slots: 25, kind: "quantity", hours: 96 }],
  ["Data Science Career Track — Victory Offer", "industrial-training", "all", "flat", 45000, ["course", "student", "seasonal"], {}],
];

function buildOffers(campaignKey, defs) {
  const c = campWindow[campaignKey];
  return defs.map(([title, category, subService, mode, price, offerTypes, o], i) => {
    const pricing = { mode, currency: "INR", unit: o.unit ?? "fixed" };
    if (mode !== "custom_quote") pricing.originalPrice = price;
    if (mode === "percentage") pricing.percentage = 90;
    if (mode === "flat") pricing.flatDiscountAmount = Math.round(price * 0.9);
    if (mode === "custom_quote") pricing.startingPriceLabel = o.label ?? "Custom Quote — up to 90% off";

    const validUntil = o.hours ? new Date(NOW + o.hours * 3600000) : fromNow(c.end);
    return {
      _id: `festoffer-${campaignKey}-${i + 1}`,
      campaignId: `festoffer-camp-${campaignKey}`,
      title,
      description: `${title} — festival pricing valid for a limited period, with expert delivery and full support.`,
      category,
      subService,
      audience: o.aud ?? CAT_AUDIENCES[category],
      eligibility: CAT_ELIGIBILITY[category],
      offerTypes,
      segment: o.segment ?? "any",
      limitKind: o.kind ?? "slots",
      linked: o.linked ?? null,
      ctaText: o.cta,
      claimLimit: o.slots ?? null,
      pricing,
      benefits: ["Festive pricing — limited period only", "Senior-led delivery & dedicated support", "Certificate / documentation included where applicable"],
      validFrom: fromNow(c.start),
      validUntil,
      priority: 100 - i,
      isFeatured: o.isFeatured ?? i % 6 === 0,
      isDealOfTheDay: o.isDealOfTheDay ?? false,
      isFlashDeal: offerTypes.includes("flash"),
      status: "active",
      ...audit(fromNow(c.start - 1)),
    };
  });
}

const offers = [...buildOffers("navratri", NAVRATRI_OFFERS), ...buildOffers("dussehra", DUSSEHRA_OFFERS)];

// ---------------------------------------------------------------------------
// Coupons — small festive top-ups that stack additively with each offer's own 90% discount
// ---------------------------------------------------------------------------

const COUPON_DEFS = [
  ["NAVRATRI5", "percentage", 5, null, 5000, "navratri", 500, 1],
  ["GARBA300", "flat", 300, 2000, null, "navratri", 300, 1],
  ["SHAKTI10", "percentage", 10, 20000, 8000, "navratri", 150, 2],
  ["VIJAY5", "percentage", 5, null, 5000, "dussehra", 500, 1],
  ["RAVAN300", "flat", 300, 2000, null, "dussehra", 300, 1],
  ["SHASTRA10", "percentage", 10, 20000, 8000, "dussehra", 150, 2],
];
const coupons = COUPON_DEFS.map(([code, discountType, discountAmount, minOrderValue, maxDiscountCap, campaignKey, usageLimit, perUserLimit], i) => {
  const c = campWindow[campaignKey];
  const doc = {
    _id: `festoffer-coupon-${campaignKey}-${i + 1}`,
    code,
    discountType,
    discountAmount,
    applicableServices: [],
    applicableAudience: ["ALL"],
    campaignId: `festoffer-camp-${campaignKey}`,
    startDate: fromNow(c.start),
    endDate: fromNow(c.end),
    usageLimit,
    usageCount: 0,
    perUserLimit,
    isActive: true,
    ...audit(fromNow(c.start - 1)),
  };
  if (minOrderValue) doc.minOrderValue = minOrderValue;
  if (maxDiscountCap) doc.maxDiscountCap = maxDiscountCap;
  return doc;
});

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db();

  const campaignIds = campaigns.map((c) => c._id);
  await db.collection("offers").deleteMany({ campaignId: { $in: campaignIds } });
  await db.collection("coupons").deleteMany({ campaignId: { $in: campaignIds } });
  await db.collection("offer_campaigns").deleteMany({ _id: { $in: campaignIds } });

  await db.collection("offer_campaigns").insertMany(campaigns);
  await db.collection("offers").insertMany(offers);
  await db.collection("coupons").insertMany(coupons);

  console.log(`✓ Campaigns: ${campaigns.map((c) => c.name).join(", ")}`);
  console.log(`✓ Offers: ${offers.length} (${NAVRATRI_OFFERS.length} Navratri + ${DUSSEHRA_OFFERS.length} Dussehra), all at 90% off`);
  console.log(`✓ Coupons: ${coupons.length}`);
} finally {
  await client.close();
}
