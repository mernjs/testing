#!/usr/bin/env node
// Realistic demo-data seeder for the whole admin panel.
// Run with: npm run seed-demo   (== node --env-file=.env scripts/seed-demo-data.mjs)
//
// Inserts ~200 core records (150 leads across the 5 category collections +
// 50 career applications) plus supporting data for the other admin
// dashboards (chatbot conversations, voice conversations, campaign spend) so
// every page in the admin panel has real-looking content instead of empty
// zero-states.
//
// This is NOT idempotent — re-running it inserts another batch on top of
// whatever's already there (job_positions is the one exception, upserted by
// slug). Safe to run against a fresh/demo database; don't run repeatedly
// against a database you care about without cleaning up between runs.

import { MongoClient, ObjectId } from "mongodb";
import { randomUUID, randomBytes, createHash } from "node:crypto";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db();

// --------------------------------------------------------------------------
// Small helpers
// --------------------------------------------------------------------------

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function choice(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function weightedChoice(pairs) {
  const total = pairs.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [value, w] of pairs) {
    if (r < w) return value;
    r -= w;
  }
  return pairs[pairs.length - 1][0];
}
function chance(p) {
  return Math.random() < p;
}
/** Days-ago biased toward recent (growth-trend look), 0..maxDays. */
function recentDaysAgo(maxDays) {
  return Math.floor(Math.random() ** 1.6 * maxDays);
}
function dateDaysAgo(days, hourJitter = true) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  if (hourJitter) {
    d.setHours(randInt(6, 22), randInt(0, 59), randInt(0, 59), 0);
  }
  return d;
}
function campaignKeyFor(name) {
  if (typeof name !== "string") return undefined;
  const key = name
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, " ")
    .replace(/[^a-z0-9 &/.\-]+/g, "")
    .trim();
  return key.length > 0 ? key : undefined;
}
function hex(n) {
  return randomBytes(n).toString("hex");
}
function slugifyEmail(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/)
    .join(randInt(0, 1) ? "." : "");
}

// --------------------------------------------------------------------------
// Name / contact pools (mix of Indian + international, matching a real
// India-based B2B software company's inbound mix)
// --------------------------------------------------------------------------

const FIRST_NAMES = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Rohan",
  "Ananya", "Diya", "Saanvi", "Aadhya", "Kavya", "Myra", "Anika", "Riya", "Priya", "Neha",
  "Rahul", "Amit", "Vikram", "Karan", "Nikhil", "Sandeep", "Rajesh", "Suresh", "Manish", "Deepak",
  "Pooja", "Sneha", "Kritika", "Meera", "Shreya", "Anjali", "Divya", "Nisha", "Swati", "Ritu",
  "James", "Michael", "David", "John", "Robert", "William", "Daniel", "Matthew", "Andrew", "Chris",
  "Sarah", "Emily", "Jessica", "Amanda", "Laura", "Rachel", "Emma", "Olivia", "Sophia", "Grace",
  "Muhammad", "Ahmed", "Omar", "Ali", "Hassan", "Fatima", "Aisha", "Zainab", "Mariam", "Layla",
  "Wei", "Jun", "Yuki", "Hiro", "Min", "Ji-woo", "Chen", "Ling", "Sung", "Haruto",
];
const LAST_NAMES = [
  "Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Reddy", "Rao", "Nair", "Iyer",
  "Mehta", "Shah", "Joshi", "Chopra", "Malhotra", "Kapoor", "Bansal", "Agarwal", "Saxena", "Tiwari",
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Anderson", "Taylor",
  "Khan", "Ansari", "Siddiqui", "Chaudhry", "Malik",
  "Wang", "Li", "Zhang", "Chen", "Kim", "Park", "Tanaka", "Suzuki", "Yamamoto",
];
const COMPANY_WORDS_A = ["Nimbus", "Vertex", "Quantum", "Orbit", "Falcon", "Lumina", "Zenith", "Apex", "Nexus", "Stratos", "Horizon", "Catalyst", "Ironclad", "Bluewave", "Redstone", "Silverline"];
const COMPANY_WORDS_B = ["Tech", "Systems", "Labs", "Solutions", "Digital", "Ventures", "Industries", "Global", "Networks", "Innovations"];
const EMAIL_DOMAINS = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "proton.me"];

function randomName() {
  return `${choice(FIRST_NAMES)} ${choice(LAST_NAMES)}`;
}
function randomCompany() {
  return `${choice(COMPANY_WORDS_A)} ${choice(COMPANY_WORDS_B)}`;
}
function randomEmail(name) {
  const domain = chance(0.35) ? `${randomCompany().toLowerCase().replace(/\s+/g, "")}.com` : choice(EMAIL_DOMAINS);
  return `${slugifyEmail(name)}${randInt(1, 999)}@${domain}`;
}
function randomPhone() {
  if (chance(0.85)) return `+91 ${randInt(70000, 99999)}${randInt(10000, 99999)}`;
  return `+1 ${randInt(200, 999)}${randInt(1000000, 9999999)}`;
}

// --------------------------------------------------------------------------
// 1. Job positions (upsert — matches the site's static jobs-data.ts exactly)
// --------------------------------------------------------------------------

const JOBS = [
  { slug: "mern-developer", title: "MERN Developer", category: "Engineering & Development", experience: "1–4 Years" },
  { slug: "genai-developer", title: "GenAI Developer", category: "Engineering & Development", experience: "1–3 Years" },
  { slug: "ai-ml-engineer", title: "AI/ML Engineer", category: "Engineering & Development", experience: "2–5 Years" },
  { slug: "android-app-developer", title: "Android App Developer", category: "Engineering & Development", experience: "1–4 Years" },
  { slug: "ios-app-developer", title: "iOS App Developer", category: "Engineering & Development", experience: "1–4 Years" },
  { slug: "quality-analyst", title: "Quality Analyst", category: "Engineering & Development", experience: "1–3 Years" },
  { slug: "ui-ux-designer", title: "UI/UX Designer", category: "Design", experience: "1–4 Years" },
  { slug: "business-development-manager", title: "Business Development Manager", category: "Business & Operations", experience: "2–6 Years" },
  { slug: "business-analyst", title: "Business Analyst", category: "Business & Operations", experience: "1–4 Years" },
  { slug: "project-manager", title: "Project Manager", category: "Business & Operations", experience: "2–6 Years" },
  { slug: "bid-executive", title: "Bid Executive", category: "Business & Operations", experience: "1–3 Years" },
  { slug: "accounts-manager", title: "Accounts Manager", category: "Business & Operations", experience: "2–5 Years" },
  { slug: "mis-executive", title: "MIS Executive", category: "Business & Operations", experience: "1–3 Years" },
  { slug: "hr-executive", title: "HR Executive", category: "Business & Operations", experience: "1–4 Years" },
  { slug: "technical-content-writer", title: "Technical Content Writer", category: "Marketing & Content", experience: "1–3 Years" },
  { slug: "digital-marketing", title: "Digital Marketing", category: "Marketing & Content", experience: "1–4 Years" },
];
const LOCATION = "Noida, India · Hybrid";

console.log("Seeding job_positions…");
const positionsCol = db.collection("job_positions");
await positionsCol.createIndex({ slug: 1 }, { unique: true }).catch(() => {});
const positionIds = {};
for (const job of JOBS) {
  const now = new Date();
  const res = await positionsCol.findOneAndUpdate(
    { slug: job.slug },
    {
      $setOnInsert: {
        slug: job.slug,
        title: job.title,
        category: job.category,
        isOpen: true,
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true, returnDocument: "after" }
  );
  positionIds[job.slug] = res._id ?? res.value?._id;
}
console.log(`  ${JOBS.length} positions ensured.`);

// --------------------------------------------------------------------------
// 2. Campaigns + daily metrics (seeded first so leads can attribute to them)
// --------------------------------------------------------------------------

console.log("Seeding campaigns + campaign_metrics…");
const campaignsCol = db.collection("campaigns");
const metricsCol = db.collection("campaign_metrics");
const importsCol = db.collection("campaign_imports");
await campaignsCol.createIndex({ platform: 1, nameKey: 1 }, { unique: true }).catch(() => {});
await metricsCol.createIndex({ campaignId: 1, date: 1, breakdown: 1 }, { unique: true }).catch(() => {});

const CAMPAIGN_DEFS = [
  { platform: "meta", name: "Meta - Lead Gen Spring 2026", baseSpend: 1800, currency: "INR" },
  { platform: "meta", name: "Meta - Retargeting Q1", baseSpend: 900, currency: "INR" },
  { platform: "google", name: "Google - Search Brand Terms", baseSpend: 2200, currency: "INR" },
  { platform: "google", name: "Google - Performance Max", baseSpend: 1600, currency: "INR" },
  { platform: "linkedin", name: "LinkedIn - Decision Maker ABM", baseSpend: 3200, currency: "INR" },
  { platform: "linkedin", name: "LinkedIn - Content Promotion", baseSpend: 1100, currency: "INR" },
];

const seededCampaigns = [];
const METRIC_DAYS = 60;
for (const def of CAMPAIGN_DEFS) {
  const nameKey = campaignKeyFor(def.name);
  const now = new Date();
  const upserted = await campaignsCol.findOneAndUpdate(
    { platform: def.platform, nameKey },
    {
      $setOnInsert: {
        platform: def.platform,
        name: def.name,
        nameKey,
        status: "active",
        ...(def.platform === "meta" ? { objective: "LEAD_GENERATION" } : {}),
        firstReportDate: dateDaysAgo(METRIC_DAYS, false),
        lastReportDate: dateDaysAgo(0, false),
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true, returnDocument: "after" }
  );
  const campaignId = upserted._id ?? upserted.value?._id;
  seededCampaigns.push({ ...def, nameKey, campaignId });

  const importDoc = {
    _id: new ObjectId(),
    adminId: new ObjectId(),
    platform: def.platform,
    kind: "performance",
    filename: `${def.platform}-report-${nameKey.replace(/\s+/g, "-")}.csv`,
    fileSize: randInt(5000, 40000),
    status: "completed",
    rowsTotal: METRIC_DAYS,
    rowsImported: METRIC_DAYS,
    rowsUpdated: 0,
    rowsSkipped: 0,
    rowsError: 0,
    errors: [],
    currency: def.currency,
    undoable: false,
    createdAt: dateDaysAgo(METRIC_DAYS),
  };
  await importsCol.insertOne(importDoc);

  const metricRows = [];
  for (let d = METRIC_DAYS - 1; d >= 0; d--) {
    const date = dateDaysAgo(d, false);
    const dayFactor = 0.7 + Math.random() * 0.6; // daily spend jitter
    const spend = Math.round(def.baseSpend * dayFactor * 100) / 100;
    const clicks = Math.round(spend / randInt(15, 45));
    const impressions = clicks * randInt(20, 60);
    const leadsReported = Math.max(0, Math.round(clicks * (0.02 + Math.random() * 0.05)));
    metricRows.push({
      _id: new ObjectId(),
      campaignId,
      platform: def.platform,
      nameKey,
      date,
      breakdown: "all",
      spend,
      currency: def.currency,
      impressions,
      clicks,
      ...(def.platform === "meta" ? { linkClicks: Math.round(clicks * 0.8) } : {}),
      leadsReported,
      importId: importDoc._id,
      createdAt: date,
      updatedAt: date,
    });
  }
  await metricsCol.insertMany(metricRows);
}
console.log(`  ${seededCampaigns.length} campaigns, ${seededCampaigns.length * METRIC_DAYS} metric rows.`);

// --------------------------------------------------------------------------
// 3. Leads — 30 per category × 5 categories = 150
// --------------------------------------------------------------------------

const CATEGORIES = [
  { slug: "software-development", collection: "leads_software_development", resume: false, subServices: ["web-app-development", "mobile-app-development", "desktop-app-development", "prediction-and-forecasting", "ai-agent", "ai-ml-solutions", "vision-intelligence", "ar-vr"] },
  { slug: "ai-automations", collection: "leads_ai_automations", resume: false, subServices: ["intelligent-process-automation", "conversational-ai-chatbots", "ai-powered-data-analytics", "document-intelligence", "predictive-ai-workflows", "ai-integration-services", "robotic-process-automation"] },
  { slug: "industrial-training", collection: "leads_industrial_training", resume: true, subServices: ["mern-stack", "mean-stack", "generative-ai", "agentic-ai", "conversational-ai", "computer-vision"] },
  { slug: "resource-augmentation", collection: "leads_resource_augmentation", resume: false, subServices: ["single-resource", "package-based-team", "hourly-on-demand", "project-based"] },
  { slug: "internship-program", collection: "leads_internship_program", resume: true, subServices: ["mern-stack", "mean-stack", "generative-ai", "agentic-ai", "conversational-ai", "computer-vision"] },
];

const PROJECT_BRIEFS = [
  "Looking to build a customer-facing web portal with a React frontend and Node backend. Timeline is roughly 3 months.",
  "We need to automate our invoice processing workflow — currently all manual, high error rate.",
  "Exploring a mobile app for our field sales team, offline-first with periodic sync.",
  "Want a proof-of-concept for a computer vision quality-inspection system on our production line.",
  "Our internal chatbot needs to answer HR policy questions from a knowledge base of PDFs.",
  "Need a dashboard to forecast demand across 40 retail locations using historical sales data.",
  "Migrating a legacy desktop app to a modern web stack, roughly 20 screens.",
  "Looking for a dedicated developer for 3-6 months to extend our existing SaaS product.",
  "Interested in an AR try-on feature for our e-commerce storefront.",
  "Need help integrating our CRM with WhatsApp Business API for lead follow-up.",
];
const LEAD_SOURCES_ORGANIC = ["contact-page", "homepage-hero"];
const LEAD_STATUS_WEIGHTS = [["new", 15], ["in_progress", 25], ["completed", 45], ["rejected", 15]];

let leadsInserted = 0;
for (const cat of CATEGORIES) {
  const col = db.collection(cat.collection);
  const docs = [];
  for (let i = 0; i < 30; i++) {
    const name = randomName();
    const daysAgo = recentDaysAgo(90);
    const createdAt = dateDaysAgo(daysAgo);
    const status = weightedChoice(LEAD_STATUS_WEIGHTS);
    const useAdSource = chance(0.18);
    const source = useAdSource ? choice(["meta", "google", "linkedin"]) : choice(LEAD_SOURCES_ORGANIC);
    let campaign, campaignKeyVal, attribution;
    if (useAdSource) {
      const matching = seededCampaigns.filter((c) => c.platform === source);
      const picked = choice(matching);
      campaign = picked.name;
      campaignKeyVal = picked.nameKey;
      attribution = { method: "utm", at: createdAt };
    }
    const doc = {
      category: cat.slug,
      name,
      phone: randomPhone(),
      createdAt,
      updatedAt: chance(0.5) ? dateDaysAgo(Math.max(0, daysAgo - randInt(0, 4))) : createdAt,
      status,
    };
    if (chance(0.9)) doc.email = randomEmail(name);
    if (chance(0.75)) doc.message = choice(PROJECT_BRIEFS);
    if (chance(0.8)) doc.subService = choice(cat.subServices);
    if (chance(0.3)) doc.notes = choice(["Follow up next week.", "Waiting on budget approval.", "Strong fit — prioritize.", "Needs more scoping detail."]);
    if (source) doc.source = source;
    if (campaign) {
      doc.campaign = campaign;
      doc.campaignKey = campaignKeyVal;
      doc.attribution = attribution;
    }
    if (status === "completed" && chance(0.6)) {
      doc.dealValue = randInt(50, 2000) * 1000;
    }
    if (cat.resume) {
      doc.resume = {
        storageKey: `${randomUUID()}.pdf`,
        filename: `${name.replace(/\s+/g, "_")}_Resume.pdf`,
        contentType: "application/pdf",
        size: randInt(80_000, 1_800_000),
      };
    }
    docs.push(doc);
  }
  await col.insertMany(docs);
  leadsInserted += docs.length;
  console.log(`  ${cat.collection}: ${docs.length} leads`);
}
console.log(`  Total leads: ${leadsInserted}`);

// --------------------------------------------------------------------------
// 4. Career applications — 50
// --------------------------------------------------------------------------

console.log("Seeding career_applications…");
const applicationsCol = db.collection("career_applications");
const APP_STATUS_WEIGHTS = [
  ["new", 20], ["under_review", 20], ["shortlisted", 15], ["interview_scheduled", 12],
  ["selected", 8], ["hired", 10], ["rejected", 15],
];
const APP_SOURCES = ["careers-page", "linkedin", "referral", "naukri", "indeed"];
const COVER_NOTES = [
  "Excited about the GenAI work you're shipping — would love to contribute.",
  "I've attached my resume; happy to walk through my recent projects on a call.",
  "Referred by a current team member, very interested in the role.",
  "Relocating to Noida next month, actively interviewing.",
  "",
];

const appDocs = [];
for (let i = 0; i < 50; i++) {
  const job = choice(JOBS);
  const name = randomName();
  const daysAgo = recentDaysAgo(90);
  const createdAt = dateDaysAgo(daysAgo);
  const doc = {
    positionId: positionIds[job.slug] ?? null,
    positionSlug: job.slug,
    positionTitle: job.title,
    name,
    email: randomEmail(name),
    phone: randomPhone(),
    resume: {
      storageKey: `${randomUUID()}.pdf`,
      filename: `${name.replace(/\s+/g, "_")}_Resume.pdf`,
      contentType: "application/pdf",
      size: randInt(80_000, 1_800_000),
    },
    status: weightedChoice(APP_STATUS_WEIGHTS),
    source: choice(APP_SOURCES),
    createdAt,
    updatedAt: chance(0.5) ? dateDaysAgo(Math.max(0, daysAgo - randInt(0, 6))) : createdAt,
  };
  const cover = choice(COVER_NOTES);
  if (cover) doc.coverNote = cover;
  if (chance(0.3)) doc.notes = choice(["Strong portfolio.", "Good culture fit from screening call.", "Salary expectation above budget.", "Waiting on manager decision."]);
  appDocs.push(doc);
}
await applicationsCol.insertMany(appDocs);
console.log(`  ${appDocs.length} applications`);

// --------------------------------------------------------------------------
// 5. Chatbot conversations — 50 text sessions
// --------------------------------------------------------------------------

console.log("Seeding chat_sessions / chat_messages / chat_visitors…");
const sessionsCol = db.collection("chat_sessions");
const messagesCol = db.collection("chat_messages");
const visitorsCol = db.collection("chat_visitors");
await sessionsCol.createIndex({ sessionId: 1 }, { unique: true }).catch(() => {});

const DEVICES = [["desktop", 55], ["mobile", 35], ["tablet", 10]];
const BROWSERS = [["Chrome", 55], ["Safari", 20], ["Edge", 12], ["Firefox", 8], ["Samsung Internet", 5]];
const OSES = { desktop: ["Windows", "macOS", "Linux", "ChromeOS"], mobile: ["Android", "iOS"], tablet: ["Android", "iOS"] };
const SOURCE_PAGES = ["/", "/services", "/services/ai-agent", "/contact", "/about", "/industrial-training", "/resource-augmentation", "/ai-automations", "/careers"];
const USER_QUESTIONS = [
  "What services does YashOrbit offer?",
  "Do you build mobile apps?",
  "How much does a custom web app usually cost?",
  "Can you help with AI chatbots for our website?",
  "What's the difference between your training program and internship?",
  "Do you offer dedicated developers on an hourly basis?",
  "How long does a typical project take?",
  "Can I see some of your past work?",
  "Do you have any open positions right now?",
  "What tech stack do you specialize in?",
];
const ASSISTANT_ANSWERS = [
  "YashOrbit offers five service pillars: software development, AI & automations, industrial training, resource augmentation, and internships. Which one are you exploring?",
  "Yes — we build native and cross-platform mobile apps for iOS and Android, from MVPs to production-scale products.",
  "It depends on scope, but most custom web apps range from a few weeks to a few months. Happy to connect you with our team for a scoped estimate.",
  "Absolutely — we build RAG-powered chatbots trained on your own knowledge base, similar to this assistant.",
  "Our industrial training is mentor-led and project-based for job readiness; internships place you directly on live client codebases with senior mentorship.",
  "Yes, we offer hourly, project-based, and dedicated team engagement models depending on your needs.",
  "Timelines vary by scope — small features can ship in weeks, larger platforms typically take a few months.",
  "You can check out our Products and Services pages for case studies, or I can connect you with our team directly.",
  "Yes! Check our Careers page — we're currently hiring across engineering, design, and business roles.",
  "We work primarily with React/Node (MERN), Angular (MEAN), Python for AI/ML, and native mobile stacks.",
];

let voiceModeChatSessionSlots = [];
for (let i = 0; i < 50; i++) {
  const sessionId = randomUUID();
  const visitorId = randomUUID();
  const device = weightedChoice(DEVICES);
  const browser = weightedChoice(BROWSERS);
  const os = choice(OSES[device]);
  const daysAgo = recentDaysAgo(30);
  const startedAt = dateDaysAgo(daysAgo);
  const msgCount = randInt(2, 12);
  let lastActivityAt = startedAt;

  const msgs = [];
  let firstUserMsg = null;
  for (let m = 0; m < msgCount; m++) {
    const isUser = m % 2 === 0;
    const ts = new Date(startedAt.getTime() + m * randInt(20_000, 120_000));
    lastActivityAt = ts;
    if (isUser) {
      const content = choice(USER_QUESTIONS);
      if (!firstUserMsg) firstUserMsg = content;
      msgs.push({
        _id: new ObjectId(),
        sessionId,
        role: "user",
        content,
        ...(chance(0.02) ? { flaggedInjection: true } : {}),
        createdAt: ts,
      });
    } else {
      const erroredOut = chance(0.03);
      const hasCitations = !erroredOut && chance(0.3);
      msgs.push({
        _id: new ObjectId(),
        sessionId,
        role: "assistant",
        content: erroredOut ? "" : choice(ASSISTANT_ANSWERS),
        model: "gpt-4.1-mini",
        responseTimeMs: randInt(600, 4200),
        promptTokens: randInt(200, 900),
        completionTokens: randInt(40, 260),
        ...(erroredOut ? { error: "upstream_timeout" } : {}),
        ...(hasCitations ? { citations: [{ fileId: `file_${hex(8)}`, kind: "website", title: choice(["Services Overview", "AI Automations", "Careers"]) }] } : {}),
        createdAt: ts,
      });
    }
  }
  if (msgs.length) await messagesCol.insertMany(msgs);

  const status = daysAgo < 1 && chance(0.15) ? "active" : "ended";
  await sessionsCol.insertOne({
    sessionId,
    visitorId,
    ipHash: hex(16),
    userAgent: `Mozilla/5.0 (compatible; ${browser}/${randInt(100, 130)}.0; ${os})`,
    device,
    browser,
    os,
    sourcePage: choice(SOURCE_PAGES),
    title: firstUserMsg ? firstUserMsg.slice(0, 80) : null,
    startedAt,
    lastActivityAt,
    messageCount: msgs.length,
    status,
    createdAt: startedAt,
    updatedAt: lastActivityAt,
  });

  if (chance(0.5)) {
    const name = randomName();
    await visitorsCol.updateOne(
      { _id: visitorId },
      {
        $set: {
          name,
          email: chance(0.8) ? randomEmail(name) : null,
          phone: chance(0.5) ? randomPhone() : null,
          company: chance(0.6) ? randomCompany() : null,
          ipHash: hex(16),
          capturedAt: startedAt,
          updatedAt: startedAt,
        },
      },
      { upsert: true }
    );
  }
}
console.log("  50 chat sessions seeded.");

// --------------------------------------------------------------------------
// 6. Voice conversations — 20 sessions (own chat_session + voice records)
// --------------------------------------------------------------------------

console.log("Seeding voice_conversations / voice_messages / voice_transcripts…");
const voiceConvCol = db.collection("voice_conversations");
const voiceMsgCol = db.collection("voice_messages");
const voiceTranscriptCol = db.collection("voice_transcripts");
await voiceConvCol.createIndex({ sessionId: 1 }, { unique: true }).catch(() => {});

const VOICE_IDS = ["Rachel", "Adam", "Bella", "Antoni", "Elli"];

for (let i = 0; i < 20; i++) {
  const sessionId = randomUUID();
  const visitorId = randomUUID();
  const device = weightedChoice(DEVICES);
  const browser = weightedChoice(BROWSERS);
  const os = choice(OSES[device]);
  const daysAgo = recentDaysAgo(30);
  const startedAt = dateDaysAgo(daysAgo);
  const turns = randInt(2, 6);
  const voiceId = choice(VOICE_IDS);

  const conversationId = new ObjectId();
  let lastActivityAt = startedAt;
  let totalDuration = 0;
  let msgCount = 0;
  const chatMsgs = [];
  const voiceMsgs = [];
  const transcripts = [];

  for (let t = 0; t < turns; t++) {
    const userTs = new Date(startedAt.getTime() + t * randInt(15_000, 60_000));
    const userAudioMs = randInt(1500, 6000);
    const userText = choice(USER_QUESTIONS);
    const transcriptId = new ObjectId();
    transcripts.push({
      _id: transcriptId,
      sessionId,
      voiceMessageId: null,
      rawText: userText,
      languageCode: "en",
      languageProbability: 0.9 + Math.random() * 0.09,
      audioDurationSecs: userAudioMs / 1000,
      model: "scribe-v1",
      createdAt: userTs,
    });
    const userChatMsg = { _id: new ObjectId(), sessionId, role: "user", content: userText, voice: true, createdAt: userTs };
    chatMsgs.push(userChatMsg);
    voiceMsgs.push({
      _id: new ObjectId(),
      sessionId,
      conversationId,
      chatMessageId: userChatMsg._id,
      role: "user",
      text: userText,
      audioDurationMs: userAudioMs,
      sttMs: randInt(200, 900),
      transcriptId,
      createdAt: userTs,
    });

    const assistTs = new Date(userTs.getTime() + randInt(1000, 3000));
    const assistAudioMs = randInt(2000, 8000);
    const assistText = choice(ASSISTANT_ANSWERS);
    const assistChatMsg = { _id: new ObjectId(), sessionId, role: "assistant", content: assistText, voice: true, model: "gpt-4.1-mini", responseTimeMs: randInt(600, 3000), createdAt: assistTs };
    chatMsgs.push(assistChatMsg);
    voiceMsgs.push({
      _id: new ObjectId(),
      sessionId,
      conversationId,
      chatMessageId: assistChatMsg._id,
      role: "assistant",
      text: assistText,
      audioDurationMs: assistAudioMs,
      audioStorageKey: `voice/${randomUUID()}.mp3`,
      audioBytes: randInt(30_000, 200_000),
      ttsMs: randInt(300, 1500),
      voiceId,
      createdAt: assistTs,
    });

    totalDuration += userAudioMs + assistAudioMs;
    msgCount += 2;
    lastActivityAt = assistTs;
  }

  await messagesCol.insertMany(chatMsgs);
  await voiceMsgCol.insertMany(voiceMsgs);
  await voiceTranscriptCol.insertMany(transcripts);

  await sessionsCol.insertOne({
    sessionId,
    visitorId,
    ipHash: hex(16),
    userAgent: `Mozilla/5.0 (compatible; ${browser}/${randInt(100, 130)}.0; ${os})`,
    device,
    browser,
    os,
    sourcePage: "/ask",
    title: chatMsgs[0]?.content.slice(0, 80) ?? null,
    startedAt,
    lastActivityAt,
    messageCount: msgCount,
    status: "ended",
    createdAt: startedAt,
    updatedAt: lastActivityAt,
  });

  await voiceConvCol.insertOne({
    sessionId,
    visitorId,
    device,
    browser,
    os,
    sourcePage: "/ask",
    voiceId,
    startedAt,
    lastActivityAt,
    durationMs: totalDuration,
    voiceMessageCount: msgCount,
    status: "ended",
  });
}
console.log("  20 voice conversations seeded.");

// --------------------------------------------------------------------------
await client.close();
console.log("\nDone. Seeded:");
console.log("  150 leads (30 x 5 categories)");
console.log("  50 career applications");
console.log("  6 campaigns + 360 daily metric rows");
console.log("  50 chatbot conversations");
console.log("  20 voice conversations");
