#!/usr/bin/env node
/**
 * Festival Offers demo seeder.
 *
 *   npm run offers:seed-demo
 *
 * DESTRUCTIVE for Festival Offers data only. Wipes `offer_campaigns` /
 * `offers` / `coupons` (never `offer_claims` — real claims are never wiped)
 * and rebuilds one live campaign spanning all 5 real service categories from
 * `src/lib/categories.ts`, referenced by category/subService slug only —
 * never a duplicated service record.
 *
 * After running, visit /offers on the public site, and manage it at
 * /lms/offers in the LMS panel (any existing LMS login works — the module has
 * no separate role gate).
 */

import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";

const OWNED_COLLECTIONS = ["offer_campaigns", "offers", "coupons"];

const now = new Date();
function daysFromNow(n) {
  return new Date(now.getTime() + n * 86400000);
}
function stamp(createdAt = now) {
  return { createdAt, updatedAt: createdAt, createdBy: null, updatedBy: null, deletedAt: null };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-offers-demo.mjs");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    for (const name of OWNED_COLLECTIONS) {
      await db.collection(name).deleteMany({});
    }

    const campaignId = randomUUID();
    const campaign = {
      _id: campaignId,
      name: "Diwali Tech Fest 2026",
      slug: "diwali-tech-fest-2026",
      campaignType: "festival",
      themePreset: "diwali",
      theme: {
        primaryColor: "#E56043",
        accentColor: "#1D428A",
        bannerHeadline: "Build More. Pay Less.",
        bannerSubheadline: "Exclusive limited-time offers on Software, AI, Training, Internships & Technology Talent.",
      },
      bannerImage: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?q=80&w=1600&auto=format&fit=crop",
      startDate: daysFromNow(-2),
      endDate: daysFromNow(12),
      status: "active",
      priority: 100,
      targetAudience: ["ALL"],
      isFeatured: true,
      faqs: [
        {
          question: "Can students claim client offers?",
          answer: "No — each offer lists the audience it's meant for. Student offers are for individuals learning or interning; client offers are for businesses commissioning work.",
        },
        {
          question: "Is there a limited number of seats?",
          answer: "Training and internship batch sizes are limited by real seat availability — ask during your consultation call for the current count.",
        },
      ],
      ...stamp(),
    };
    await db.collection("offer_campaigns").insertOne(campaign);

    const offers = [
      {
        _id: randomUUID(),
        campaignId,
        title: "Web App Development — Festival Special",
        description: "Scalable, production-grade web platforms built on React and Next.js.",
        badgeText: undefined,
        category: "software-development",
        subService: "web-app-development",
        audience: ["CLIENT"],
        pricing: { mode: "percentage", originalPrice: 200000, currency: "INR", percentage: 60 },
        benefits: ["Dedicated team", "Agile delivery", "100% code ownership", "Free consultation"],
        validFrom: daysFromNow(-2),
        validUntil: daysFromNow(12),
        priority: 90,
        isFeatured: true,
        isDealOfTheDay: false,
        isFlashDeal: false,
        status: "active",
        ...stamp(),
      },
      {
        _id: randomUUID(),
        campaignId,
        title: "AI Agent Development",
        description: "Autonomous AI agents for customer support and internal workflow automation.",
        category: "software-development",
        subService: "ai-agent",
        audience: ["CLIENT"],
        pricing: { mode: "percentage", originalPrice: 500000, currency: "INR", percentage: 50 },
        benefits: ["24/7 automation", "Workflow integration", "NDA protected"],
        validFrom: daysFromNow(-2),
        validUntil: daysFromNow(12),
        priority: 70,
        isFeatured: false,
        isDealOfTheDay: false,
        isFlashDeal: true,
        status: "active",
        ...stamp(),
      },
      {
        _id: randomUUID(),
        campaignId,
        title: "Automate Your Business",
        description: "Intelligent process automation for repetitive operational workflows.",
        badgeText: "UP TO 70% OFF",
        category: "ai-automations",
        subService: "intelligent-process-automation",
        audience: ["CLIENT"],
        pricing: { mode: "custom_quote", startingPriceLabel: "Custom Quote" },
        benefits: ["Limited festival offer", "Free process audit"],
        validFrom: daysFromNow(-2),
        validUntil: daysFromNow(12),
        priority: 60,
        isFeatured: false,
        isDealOfTheDay: false,
        isFlashDeal: false,
        status: "active",
        ...stamp(),
      },
      {
        _id: randomUUID(),
        campaignId,
        title: "Generative AI Training",
        description: "Industry-focused GenAI program with live projects and mentor support.",
        category: "industrial-training",
        subService: "generative-ai",
        audience: ["STUDENT"],
        pricing: { mode: "percentage", originalPrice: 60000, currency: "INR", percentage: 90 },
        benefits: ["Live Projects", "Mentor Support", "Industry Exposure", "Certificate"],
        validFrom: daysFromNow(-2),
        validUntil: daysFromNow(1),
        priority: 95,
        isFeatured: true,
        isDealOfTheDay: true,
        isFlashDeal: false,
        status: "active",
        ...stamp(),
      },
      {
        _id: randomUUID(),
        campaignId,
        title: "MERN Stack Training",
        description: "Full-stack MERN program with real project exposure.",
        category: "industrial-training",
        subService: "mern-stack",
        audience: ["STUDENT"],
        pricing: { mode: "percentage", originalPrice: 40000, currency: "INR", percentage: 75 },
        benefits: ["Live Projects", "Mentor Support", "Certificate"],
        validFrom: daysFromNow(-2),
        validUntil: daysFromNow(12),
        priority: 50,
        isFeatured: false,
        isDealOfTheDay: false,
        isFlashDeal: true,
        status: "active",
        ...stamp(),
      },
      {
        _id: randomUUID(),
        campaignId,
        title: "MERN Stack Internship",
        description: "Real project exposure, mentorship and a career pathway.",
        category: "internship-program",
        subService: "mern-stack",
        audience: ["INTERN"],
        pricing: { mode: "percentage", originalPrice: 20000, currency: "INR", percentage: 75 },
        benefits: ["Real project exposure", "Mentorship", "Certificate", "Career pathway"],
        validFrom: daysFromNow(-2),
        validUntil: daysFromNow(12),
        priority: 55,
        isFeatured: true,
        isDealOfTheDay: false,
        isFlashDeal: false,
        status: "active",
        ...stamp(),
      },
      {
        _id: randomUUID(),
        campaignId,
        title: "Festival Hiring Offer — Package-Based Team",
        description: "Pre-vetted developer team, fast onboarding, flexible engagement.",
        badgeText: "UP TO 50% OFF",
        category: "resource-augmentation",
        subService: "package-based-team",
        audience: ["HIRING"],
        pricing: { mode: "custom_quote", startingPriceLabel: "From $2,000/mo" },
        benefits: ["Pre-vetted talent", "Fast onboarding", "Flexible engagement"],
        validFrom: daysFromNow(-2),
        validUntil: daysFromNow(12),
        priority: 65,
        isFeatured: false,
        isDealOfTheDay: false,
        isFlashDeal: false,
        status: "active",
        ...stamp(),
      },
    ];
    await db.collection("offers").insertMany(offers);

    const coupon = {
      _id: randomUUID(),
      code: "FESTIVE90",
      campaignId,
      discountType: "percentage",
      discountAmount: 10,
      maxDiscountCap: 5000,
      applicableServices: [],
      applicableAudience: ["ALL"],
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      usageLimit: 500,
      usageCount: 0,
      perUserLimit: 1,
      isActive: true,
      ...stamp(),
    };
    await db.collection("coupons").insertOne(coupon);

    console.log(`Seeded 1 campaign ("${campaign.name}"), ${offers.length} offers across all 5 categories, 1 coupon (${coupon.code}).`);
    console.log("Visit /offers on the public site, and manage it at /lms/offers.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
