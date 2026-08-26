import ArticleHero from "@/components/sections/ArticleHero";
import ArticleBody, { ArticleBlock } from "@/components/sections/ArticleBody";
import NextPost from "@/components/sections/NextPost";
import RelatedPosts from "@/components/sections/RelatedPosts";
import DetailCTA from "@/components/sections/DetailCTA";
import { getBlogPost, getRelatedPosts, getNextPost } from "@/lib/blog";

const post = getBlogPost("staff-augmentation-vs-outsourcing")!;
const related = getRelatedPosts(post.slug);
const next = getNextPost(post.slug);

const blocks: ArticleBlock[] = [
  {
    type: "lead",
    text: "\"Should we hire, augment our team, or outsource the whole thing?\" sounds like one decision. It's actually three separate questions bundled together — how much control you want to keep, how predictable you need the cost to be, and how fast you need to move — and the right model depends on how you answer each one, not on which option sounds more professional.",
  },
  { type: "h2", id: "three-models", text: "The three models, defined honestly" },
  {
    type: "p",
    text: "**Staff augmentation** means adding vetted individual developers or specialists directly into your existing team, working under your processes, your management, and your tools. **Full project outsourcing** means handing an entire scope — often a full product build — to an external team that manages its own process and delivers a result. **Hybrid engagement** blends both: an external team leads execution while staying integrated with your internal stakeholders on direction and review.",
  },
  {
    type: "p",
    text: "None of these is inherently better. They optimize for different things, and the mistake most companies make is picking one based on habit or budget optics rather than what their specific project actually needs.",
  },
  { type: "h2", id: "control", text: "Question one: how much control do you need to keep?" },
  {
    type: "p",
    text: "If your product requires deep, ongoing institutional knowledge — a complex domain, tight integration with proprietary systems, or a roadmap that shifts week to week based on internal decisions — staff augmentation keeps that knowledge inside your team and under your direct management. You set the priorities daily; the augmented engineer executes inside your existing sprint process.",
  },
  {
    type: "p",
    text: "If the scope is well-defined and doesn't require your team's day-to-day involvement to execute well — a defined feature set, a rebuild with clear requirements, a specific product to ship — outsourcing the full project frees your internal team to focus on what only they can do, while an external team owns delivery against an agreed scope.",
  },
  { type: "h2", id: "cost", text: "Question two: how predictable does the cost need to be?" },
  {
    type: "p",
    text: "Staff augmentation is typically priced by time — monthly or hourly — which means cost scales with however long the engagement runs. That's ideal when scope is genuinely uncertain or evolving, because you're not locking in a price against requirements that will change. Full project outsourcing is more often priced against a defined scope, giving you a fixed number to plan against — but that only works well when the scope is actually fixed; a moving target under a fixed-price contract is where outsourcing relationships go wrong.",
  },
  {
    type: "callout",
    title: "A model that splits the difference",
    text: "Hourly or on-demand engagement — paying only for the hours actually used against your priorities that week — works well for companies with real but unpredictable workload spikes, where committing to either a full-time augmented resource or a fixed-scope project overstates the actual need.",
  },
  { type: "h2", id: "speed", text: "Question three: how fast do you need to move?" },
  {
    type: "p",
    text: "Staff augmentation is usually faster to start — you're plugging a specialist into a process that already exists, not standing up a new team's workflow from zero. Full project outsourcing takes longer to spin up properly (scoping, requirements alignment, environment setup) but can move faster once running, because the external team isn't context-switching between your priorities and their own other work the way an internal hire might.",
  },
  {
    type: "h2", id: "matching-need-to-model", text: "Matching your actual need to the right model" },
  {
    type: "ul",
    items: [
      "**Need one specialist skill your team is missing** — a senior mobile engineer, a specific AI/ML background — for an ongoing roadmap: **staff augmentation, single resource.**",
      "**Need to stand up an entire capability quickly** — a full mobile team, a dedicated AI pod — without a lengthy hiring cycle: **a package-based, pre-built team.**",
      "**Have unpredictable, spiky workload** that doesn't justify a full-time hire or a fixed-scope contract: **hourly or on-demand engagement.**",
      "**Have a clearly scoped project with a defined end state** and want a single accountable delivery team: **project-based outsourcing.**",
    ],
  },
  {
    type: "quote",
    text: "The engagements that go badly are rarely a bad vendor. They're usually a mismatch — a fixed-price contract against a moving target, or a full outsourced build for a project that actually needed one specialist embedded in an existing team.",
  },
  { type: "h2", id: "red-flags", text: "What to watch for either way" },
  {
    type: "ul",
    items: [
      "**Vague seniority claims.** \"Senior developers\" should mean a specific, verifiable track record, not a title assigned for the pitch.",
      "**No trial period or short initial engagement.** A model that only offers long-term lock-in from day one is optimizing for their retention, not your fit.",
      "**Communication that only happens through account managers**, with no direct access to the people actually doing the work.",
      "**No clear IP and confidentiality terms** spelled out before work starts, regardless of which model you choose.",
    ],
  },
  {
    type: "p",
    text: "The right answer genuinely differs project to project, sometimes engagement to engagement within the same company. The useful exercise isn't picking a permanent philosophy — it's asking these three questions fresh for each new need, and choosing the model that actually fits the scope in front of you.",
  },
];

export default function StaffAugmentationContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <ArticleHero post={post} />
      <ArticleBody blocks={blocks} />
      <NextPost post={next} />
      <RelatedPosts posts={related} />
      <DetailCTA
        heading="Not sure which engagement model fits your project?"
        description="Tell us your scope, timeline, and how involved you want to stay. We'll recommend the model that actually fits — not just the one we happen to sell most."
        ctaLabel="Discuss Your Team Needs"
      />
    </div>
  );
}
