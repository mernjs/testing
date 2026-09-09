import "server-only";
import { isOpenAIConfigured } from "@/lib/openai";
import { isElevenLabsConfigured } from "@/lib/elevenlabs";
import type { ChatCitation } from "@/lib/chatbot-sessions";

/**
 * Scripted "demo mode" assistant.
 *
 * When the real OpenAI backend isn't configured, the Ask YashOrbit experience
 * still needs to be fully interactive for demos and design review. This module
 * produces grounded, Markdown-formatted answers from a small hand-written
 * knowledge base and streams them token-by-token so the chat window behaves
 * exactly as it would with a live model. The moment `OPENAI_API_KEY` is set,
 * `isDemoChat()` returns false and the real RAG pipeline takes over untouched.
 */

export function isDemoChat(): boolean {
  return !isOpenAIConfigured();
}

/** In demo mode, Voice Mode runs entirely on the browser's Web Speech APIs. */
export function isDemoVoice(): boolean {
  return isDemoChat() && !isElevenLabsConfigured();
}

export const DEMO_MODEL = "yashorbit-demo";

interface DemoTopic {
  id: string;
  keywords: string[];
  /** Sources surfaced as citation chips under the answer. */
  sources: { title: string; url: string }[];
  answer: string;
}

const SITE = "https://yashorbit.com";

const TOPICS: DemoTopic[] = [
  {
    id: "services",
    keywords: ["service", "services", "offer", "offering", "what do you do", "what does yashorbit do", "capabilities"],
    sources: [
      { title: "Our Services", url: `${SITE}/services` },
      { title: "Software Development", url: `${SITE}/software-development` },
    ],
    answer: `YashOrbit Technologies delivers four connected service lines:

- **Software development** — custom web, mobile, and cloud engineering, from MVPs to enterprise platform modernization.
- **AI & automations** — intelligent workflow automation, RPA, conversational AI, and custom ML models wired into your existing tools.
- **Resource augmentation** — vetted developers and delivery pods that plug into your team on a monthly basis.
- **Training & internships** — industrial training and structured internship programs in modern software and AI.

Most engagements start with a short discovery call to scope goals before we propose an approach.`,
  },
  {
    id: "software",
    keywords: ["software development", "web", "mobile app", "cloud", "engineering", "build an app", "development process", "tech stack"],
    sources: [{ title: "Software Development", url: `${SITE}/software-development` }],
    answer: `Our **software development** practice covers the full product lifecycle:

- **Web** — React/Next.js front-ends, Node and Python back-ends, API design, and third-party integrations.
- **Mobile** — cross-platform (React Native / Flutter) and native Android/iOS.
- **Cloud** — AWS/GCP infrastructure, CI/CD, observability, and SLA-backed support after launch.

AI-assisted workflows let us move faster than traditional timelines without cutting corners — an MVP typically runs 3–4 weeks, a full platform 6–10+ weeks. You'll get a realistic estimate during scoping.`,
  },
  {
    id: "ai",
    keywords: ["ai", "a.i", "automation", "automations", "machine learning", "ml", "rpa", "chatbot", "conversational", "llm", "agent"],
    sources: [
      { title: "AI & Automations", url: `${SITE}/ai-automations` },
      { title: "Our Products", url: `${SITE}/products` },
    ],
    answer: `YashOrbit's **AI & automation** work includes:

- **Process automation & RPA** — removing repetitive manual steps across operations, finance, and support.
- **Conversational AI** — assistants and chatbots (like this one) grounded in your own knowledge base.
- **Custom ML** — predictive analytics, computer vision, and document understanding models.
- **Integration** — connecting models to the tools your team already uses.

We also ship productized platforms such as a Predictive Analytics Engine — see the Products page for the current lineup.`,
  },
  {
    id: "industries",
    keywords: ["industry", "industries", "sector", "sectors", "domain", "verticals", "healthcare", "fintech", "edtech", "real estate"],
    sources: [{ title: "Industries We Serve", url: `${SITE}/industries` }],
    answer: `We build software across many sectors, with the deepest experience in **EdTech, FinTech, and Real Estate Tech**.

Other industries we regularly serve: Healthcare, E-commerce, Insurance, Agriculture, Education, Social Media, Travel, Construction, Hotels, and Finance.

Engagement models flex from early-stage startups building a first product through to enterprises modernizing decades-old systems.`,
  },
  {
    id: "training",
    keywords: ["training", "industrial training", "course", "learn", "curriculum", "upskill", "bootcamp"],
    sources: [{ title: "Training Programs", url: `${SITE}/industrial-training` }],
    answer: `Our **industrial training** programs are hands-on and project-based, run by the same engineers who deliver client work. Tracks include:

- Full-stack web development
- Conversational AI
- Computer Vision & Machine Learning
- Cloud & DevOps fundamentals

Each track combines guided lessons with a real deliverable you can show in a portfolio. Reach out through the contact form for the current schedule and fees.`,
  },
  {
    id: "internship",
    keywords: ["internship", "intern", "trainee", "fresher", "student", "final year"],
    sources: [{ title: "Internship Program", url: `${SITE}/internship-program` }],
    answer: `The **YashOrbit internship program** places students and recent graduates on structured tracks — Conversational AI, Computer Vision, full-stack development, and more.

Interns work on a scoped real-world project with mentor check-ins, code review, and a final showcase. It's designed to bridge the gap between coursework and production engineering. Apply via the Careers page.`,
  },
  {
    id: "start",
    keywords: ["start", "get started", "begin", "kick off", "how do i start", "engage", "hire you", "work with you", "onboard"],
    sources: [
      { title: "Contact Us", url: `${SITE}/contact` },
      { title: "How We Work", url: `${SITE}/about` },
    ],
    answer: `Getting started is simple:

1. **Reach out** through the [contact form](${SITE}/contact) or book a consultation call.
2. **Discovery** — a short conversation to understand your goals, constraints, and timeline.
3. **Proposal** — we come back with an approach, rough estimate, and engagement model.
4. **Kick-off** — a small, focused team starts delivering in weekly increments.

Our technical team typically responds within 24 hours.`,
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "cost", "budget", "quote", "rate", "how much", "estimate"],
    sources: [{ title: "Contact Us", url: `${SITE}/contact` }],
    answer: `Pricing depends on scope, so we quote each engagement after a short scoping conversation rather than publishing fixed rates.

As rough guidance: an MVP usually runs 3–4 weeks of focused delivery, and a full platform 6–10+ weeks. Resource-augmentation pods are billed monthly.

Share a project brief through the [contact page](${SITE}/contact) and we'll come back with a realistic estimate.`,
  },
  {
    id: "support",
    keywords: ["support", "maintenance", "sla", "after launch", "post launch", "warranty", "ongoing"],
    sources: [{ title: "How We Work", url: `${SITE}/about` }],
    answer: `Yes — **SLA-backed support** is a standard part of how we deliver, not a separate add-on. Support plans cover monitoring, bug fixes, and ongoing feature work after launch.`,
  },
  {
    id: "about",
    keywords: ["about", "who are you", "company", "team", "mission", "values", "leadership", "history", "where are you", "location", "office"],
    sources: [{ title: "About YashOrbit", url: `${SITE}/about` }],
    answer: `**YashOrbit Technologies Pvt. Ltd.** is a software development company that builds web, mobile, and AI/ML products for growing businesses, and runs industrial training and internship programs.

We work with both early-stage startups and established enterprises, and our office is in Logix Cyber Park, Sector 62, Noida. See the About page for the leadership team and case studies.`,
  },
  {
    id: "careers",
    keywords: ["career", "careers", "job", "jobs", "hiring", "vacancy", "openings", "apply", "work at yashorbit"],
    sources: [{ title: "Careers", url: `${SITE}/careers` }],
    answer: `We hire across engineering, design, and AI roles — recent openings have included Android and full-stack developers.

Browse current roles and apply on the [Careers page](${SITE}/careers). Internship applications go through the same page.`,
  },
  {
    id: "contact",
    keywords: ["contact", "email", "phone", "call", "reach", "get in touch", "talk to", "whatsapp", "number"],
    sources: [{ title: "Contact Us", url: `${SITE}/contact` }],
    answer: `You can reach YashOrbit here:

- **Email:** support@yashorbit.com
- **Phone / WhatsApp:** +91 8072278460
- **Office:** 4th Floor, Tower B, Logix Cyber Park, Sector 62, Noida, Uttar Pradesh 201309

Or send a project brief through the [contact form](${SITE}/contact) — the technical team replies within 24 hours.`,
  },
  {
    id: "products",
    keywords: ["product", "products", "platform", "platforms", "predictive analytics", "solution"],
    sources: [{ title: "Our Products", url: `${SITE}/products` }],
    answer: `Alongside custom work, YashOrbit ships its own **software products** — including a Predictive Analytics Engine and other AI platforms.

The [Products page](${SITE}/products) has the current lineup with feature details and demo requests.`,
  },
  {
    id: "resource-augmentation",
    keywords: ["resource augmentation", "staff augmentation", "hire developers", "dedicated team", "staffing", "developers on demand", "extend my team"],
    sources: [{ title: "Resource Augmentation", url: `${SITE}/resource-augmentation` }],
    answer: `**Resource augmentation** lets you add vetted YashOrbit engineers to your own team on a monthly basis — individual developers or a full delivery pod with a lead.

You keep control of priorities and process; we handle sourcing, ramp-up, and backup coverage. Good fit when you need to move faster without a long hiring cycle.`,
  },
];

const GREETING: DemoTopic = {
  id: "greeting",
  keywords: ["hi", "hello", "hey", "yo", "good morning", "good afternoon", "good evening", "namaste"],
  sources: [],
  answer: `Hi! I'm the YashOrbit AI Assistant. I can tell you about our services, products, the industries we work in, training and internship programs, or how to start a project. What would you like to know?`,
};

const FALLBACK_SOURCES = [
  { title: "Our Services", url: `${SITE}/services` },
  { title: "Contact Us", url: `${SITE}/contact` },
];

function scoreTopic(topic: DemoTopic, text: string): number {
  let score = 0;
  for (const kw of topic.keywords) {
    if (text.includes(kw)) score += kw.includes(" ") ? 3 : 1.5;
  }
  return score;
}

function toCitations(sources: { title: string; url: string }[], topicId: string): ChatCitation[] {
  return sources.map((s, i) => ({
    fileId: `demo-${topicId}-${i}`,
    kind: "website" as const,
    title: s.title,
    url: s.url,
  }));
}

export interface DemoAnswer {
  text: string;
  citations: ChatCitation[];
}

/** Picks the best-matching scripted answer for a user message. */
export function answerDemoQuestion(rawQuestion: string): DemoAnswer {
  const text = ` ${rawQuestion.toLowerCase().replace(/[^\w\s]/g, " ")} `;

  if (text.trim().length <= 4 || scoreTopic(GREETING, text) >= 1.5) {
    if (!TOPICS.some((t) => scoreTopic(t, text) >= 1.5)) {
      return { text: GREETING.answer, citations: [] };
    }
  }

  let best: DemoTopic | null = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const s = scoreTopic(topic, text);
    if (s > bestScore) {
      best = topic;
      bestScore = s;
    }
  }

  if (best && bestScore >= 1.5) {
    return { text: best.answer, citations: toCitations(best.sources, best.id) };
  }

  return {
    text: `I don't have a specific answer to that in the demo knowledge base, but here's the short version:

YashOrbit Technologies builds custom **web, mobile, and AI software**, offers **resource augmentation**, and runs **training and internship** programs.

For anything specific — pricing, timelines, a particular capability — the fastest path is the [contact page](${SITE}/contact); the technical team replies within 24 hours.`,
    citations: toCitations(FALLBACK_SOURCES, "fallback"),
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Streams `text` in small chunks with human-paced delays so the chat window's
 * streaming cursor, auto-scroll, and typing indicator all exercise the same
 * code paths as a live model response.
 */
export async function* streamDemoAnswer(text: string): AsyncGenerator<string> {
  // Break on word boundaries but emit 1–3 words per frame.
  const tokens = text.match(/\S+\s*/g) ?? [text];
  await sleep(450); // "thinking" beat before the first token
  let buffer = "";
  let sinceFlush = 0;
  for (const token of tokens) {
    buffer += token;
    sinceFlush += 1;
    const atBreak = /[.!?:\n]\s*$/.test(token);
    if (sinceFlush >= 2 || atBreak) {
      yield buffer;
      buffer = "";
      sinceFlush = 0;
      await sleep(atBreak ? 90 : 45);
    }
  }
  if (buffer) yield buffer;
}
