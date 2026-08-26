import ArticleHero from "@/components/sections/ArticleHero";
import ArticleBody, { ArticleBlock } from "@/components/sections/ArticleBody";
import RelatedPosts from "@/components/sections/RelatedPosts";
import DetailCTA from "@/components/sections/DetailCTA";
import { getBlogPost, getRelatedPosts } from "@/lib/blog";

const post = getBlogPost("native-vs-cross-platform-mobile-development")!;
const related = getRelatedPosts(post.slug);

const blocks: ArticleBlock[] = [
  {
    type: "lead",
    text: "\"Should we go native or cross-platform?\" is one of the first questions in almost every mobile project kickoff, and it usually gets answered with a strong opinion instead of a calculation. The honest answer is that both are the right choice often — the trick is knowing which variables in your specific project should decide it.",
  },
  { type: "h2", id: "what-changed", text: "What actually changed in this debate" },
  {
    type: "p",
    text: "Cross-platform tooling used to mean a real compromise: janky animations, delayed access to new OS features, and a UI that never quite felt native. That gap has narrowed dramatically. Modern cross-platform frameworks — React Native and Flutter chief among them — now render with near-native performance for the vast majority of business app use cases, and both have mature ecosystems for camera, push notifications, payments, and biometric auth.",
  },
  {
    type: "p",
    text: "That means the decision has shifted from \"which one performs better\" to a more useful set of questions about your team, your timeline, and how deep your app needs to go into platform-specific capability.",
  },
  { type: "h2", id: "when-cross-platform-wins", text: "When cross-platform is the right call" },
  {
    type: "ul",
    items: [
      "**You need to validate demand on both iOS and Android without doubling your budget.** One codebase, two app store listings — this is the single biggest cost lever in mobile development.",
      "**Your team is small or full-stack-leaning.** A five-person team maintaining one React Native codebase moves faster than the same team split across two native codebases.",
      "**Your app is primarily forms, lists, content, and standard interactions** — most business apps, from marketplaces to internal tools to booking platforms, fall squarely here.",
      "**You expect frequent product iteration.** Shipping a feature once instead of twice, twice as fast, compounds significantly over a year of weekly releases.",
    ],
  },
  { type: "h2", id: "when-native-wins", text: "When native is the right call" },
  {
    type: "ul",
    items: [
      "**Your app is performance-critical in a way users will actually notice** — high-frame-rate gaming, real-time audio/video processing, or complex custom animations that need to feel perfect.",
      "**You need deep, immediate access to new OS-level features** the moment a platform ships them, rather than waiting for a cross-platform bridge to catch up.",
      "**Your team already has separate iOS and Android specialists** and cross-platform would mean retraining rather than accelerating them.",
      "**Regulatory or hardware-integration requirements** demand direct, unabstracted access to platform APIs — certain healthcare, fintech, or IoT-adjacent apps land here.",
    ],
  },
  {
    type: "quote",
    text: "The teams that regret their mobile stack choice usually didn't choose wrong on technical merits — they chose based on which option sounded more impressive, not which one matched their actual constraints.",
  },
  { type: "h2", id: "cost-and-timeline", text: "What it actually does to your budget and timeline" },
  {
    type: "p",
    text: "This is the part the framework debate usually skips. A cross-platform build with one team typically costs 30-45% less than building and maintaining separate native iOS and Android apps, and ships to both platforms in roughly the same calendar time it takes to ship one native platform alone. That gap narrows the more platform-specific, deeply custom functionality your app needs — every native module you have to bridge in eats into the savings.",
  },
  {
    type: "p",
    text: "For most first-version products and a large share of mature ones, that trade-off favors cross-platform. It's worth running the numbers on your specific feature list rather than assuming either direction by default.",
  },
  {
    type: "callout",
    title: "How we scope mobile projects",
    text: "We build in both native and cross-platform, and the first thing we do on a new mobile engagement is map your feature list against exactly these trade-offs — before recommending a stack. It's part of our standard mobile app development discovery process.",
  },
  { type: "h2", id: "hybrid-path", text: "A middle path worth knowing about" },
  {
    type: "p",
    text: "It's not always all-or-nothing. Some teams ship the core app in a cross-platform framework and drop into native code for the one or two screens that genuinely need it — a camera-heavy scanning feature, for instance, or a screen with complex custom animation. Both major cross-platform frameworks support this kind of native module bridging cleanly, so you don't have to pick a single lane for the entire app if your requirements are mostly standard with one or two exceptions.",
  },
  { type: "h2", id: "checklist", text: "A quick framework to decide" },
  {
    type: "ol",
    items: [
      "**List your must-have features and mark which ones need deep platform-specific access.** If it's zero to two features out of twenty, cross-platform is almost always the better economics.",
      "**Check your team's existing skills.** Retraining costs real time — factor it into the comparison honestly.",
      "**Estimate your iteration cadence.** Weekly releases favor one shared codebase; a slower-moving, highly polished flagship app can justify two.",
      "**Price both paths against your actual feature list**, not a generic estimate — the gap is feature-dependent, not fixed.",
    ],
  },
  {
    type: "p",
    text: "There's no universally correct answer here, and any framework that tells you otherwise is selling something. The right choice is the one that matches your team, your budget, and what your specific app actually needs to do — which is exactly the kind of decision worth spending a real discovery conversation on before writing a line of code.",
  },
];

export default function MobileStackContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <ArticleHero post={post} />
      <ArticleBody blocks={blocks} />
      <RelatedPosts posts={related} />
      <DetailCTA
        heading="Weighing native against cross-platform for your app?"
        description="Send us your feature list. We'll map it against both paths and give you a straight cost and timeline comparison before you commit."
        ctaLabel="Get a Free Assessment"
      />
    </div>
  );
}
