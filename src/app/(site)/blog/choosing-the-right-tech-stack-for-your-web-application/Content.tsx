import ArticleHero from "@/components/sections/ArticleHero";
import ArticleBody, { ArticleBlock } from "@/components/sections/ArticleBody";
import NextPost from "@/components/sections/NextPost";
import RelatedPosts from "@/components/sections/RelatedPosts";
import DetailCTA from "@/components/sections/DetailCTA";
import { getBlogPost, getRelatedPosts, getNextPost } from "@/lib/blog";

const post = getBlogPost("choosing-the-right-tech-stack-for-your-web-application")!;
const related = getRelatedPosts(post.slug);
const next = getNextPost(post.slug);

const blocks: ArticleBlock[] = [
  {
    type: "lead",
    text: "Every year, a new framework claims to have solved web development. Every year, teams rebuild working products chasing it. The tech stack conversation gets treated as a taste question — React or Vue, Node or Django — when it's actually a constraints question, and constraints are specific to your team, your timeline, and what your product needs to survive its first year.",
  },
  { type: "h2", id: "not-which-framework", text: "The real question isn't \"which framework\"" },
  {
    type: "p",
    text: "Ask ten engineers which stack is best and you'll get ten confident, contradictory answers — because \"best\" isn't a property of a framework, it's a fit between a framework and a situation. A stack that's right for a two-person team validating an idea in six weeks is often wrong for a 40-person engineering org running a system that can't go down. Both teams building the same category of product can make opposite, equally correct choices.",
  },
  {
    type: "p",
    text: "So before comparing technologies, it helps to name what's actually being optimized for. In our experience scoping projects across early-stage startups and established enterprises, it almost always comes down to four things: **how fast you need to ship**, **how big your team is and what it already knows**, **how unpredictable your traffic or scale will be**, and **how long this system needs to stay maintainable**. Rank those honestly for your situation, and most stack debates resolve themselves.",
  },
  { type: "h2", id: "team-not-ambitions", text: "Start with your team, not your ambitions" },
  {
    type: "p",
    text: "The single biggest predictor of whether a stack decision goes well isn't the technology — it's whether the team building on it actually knows it well. A team of five TypeScript engineers will ship a better product faster on a framework they're fluent in than on an objectively \"more scalable\" one they're learning on the job. Technical debt from an unfamiliar stack compounds quietly: every bug takes longer to diagnose, every code review takes longer to trust, and every new hire takes longer to onboard.",
  },
  {
    type: "p",
    text: "This is why we push back, gently, when a client asks for a specific trendy framework purely because a competitor uses it. The right first question is always: who's going to maintain this in eighteen months, and what do they already know how to do well?",
  },
  { type: "h2", id: "frontend", text: "Frontend: match the framework to your actual traffic pattern" },
  {
    type: "p",
    text: "For most business web applications today, a React-based meta-framework covers the vast majority of real needs — it has the deepest hiring pool, the most mature tooling, and handles both content-heavy marketing pages and interactive dashboards well. The decision that actually matters more than \"which framework\" is **rendering strategy**: static generation for content that rarely changes, server rendering for pages that need to be fast and SEO-visible on first load, and client-side rendering for the parts of the app that behave like a tool, not a page.",
  },
  {
    type: "ul",
    items: [
      "**Marketing sites and content-heavy pages**: static generation, so pages load instantly and rank well without extra infrastructure.",
      "**Dashboards and logged-in tools**: client-side rendering is fine — SEO doesn't matter, and interactivity does.",
      "**Product pages, search results, anything that needs to be both fast and indexable**: server rendering is usually worth the added complexity.",
    ],
  },
  { type: "h2", id: "backend", text: "Backend: boring technology is usually the right technology" },
  {
    type: "p",
    text: "There's a reason so much production software still runs on Node.js, Python, or Java: these ecosystems have already had their painful edge cases discovered and documented by someone else. A backend built on a mature, well-documented runtime with a large hiring pool will almost always beat a backend built on this year's exciting new language, because the cost of a stack isn't just what it takes to write — it's what it takes to debug, hire for, and keep secure for years.",
  },
  {
    type: "p",
    text: "The exception is when a specific technical requirement genuinely demands something else — real-time processing at extreme scale, for instance, or a machine learning pipeline that's naturally Python-first. In those cases, the unusual choice is justified by a concrete constraint, not by novelty.",
  },
  { type: "h2", id: "database", text: "Database: the one decision that's expensive to reverse" },
  {
    type: "p",
    text: "Frontend frameworks and backend languages can be swapped out piece by piece over time without too much pain. Databases can't — migrating a production database with real user data is one of the riskiest operations in software engineering, so it's worth spending real time on this decision upfront rather than defaulting to whatever's familiar.",
  },
  {
    type: "ul",
    items: [
      "**Relational (PostgreSQL, MySQL)**: the right default for most business applications — structured data, relationships between records, and the need for strong consistency.",
      "**Document (MongoDB and similar)**: a good fit when your data shape genuinely varies record to record, or you're moving fast on a schema that's still evolving.",
      "**Specialized stores (vector databases, time-series databases)**: only bring these in alongside a primary database when you have a specific workload that needs them — AI-powered search or high-frequency metrics, for example.",
    ],
  },
  {
    type: "callout",
    title: "How we approach this with clients",
    text: "On every new build, we run a short technical discovery specifically to answer these four questions before touching a single line of code — because the cost of the wrong stack shows up months later as rewrite work, not at kickoff when it's cheap to fix. It's part of how we scope both our web app development and mobile app development engagements.",
  },
  { type: "h2", id: "same-product-different-stack", text: "The same product can justify opposite stacks" },
  {
    type: "p",
    text: "A three-person startup validating a B2B SaaS idea and a 200-employee enterprise replacing an internal tool might both be \"building a web application,\" but they're solving different problems. The startup should optimize almost entirely for speed of iteration — a monorepo, a hosted database, minimal DevOps overhead, and a framework the whole team already knows, so a pivot next month doesn't cost weeks of rework. The enterprise should optimize more for maintainability, access control, and integration with existing systems, even if that means a slightly slower initial build.",
  },
  {
    type: "p",
    text: "Neither is more \"correct\" than the other. The mistake is importing one team's optimization criteria into the other team's decision — a startup adopting enterprise-grade infrastructure it doesn't need yet, or an enterprise adopting a startup's move-fast tooling for a system that needs five years of stability.",
  },
  { type: "h2", id: "self-check", text: "A quick framework to self-answer" },
  {
    type: "ol",
    items: [
      "**Write down your real constraint, not your ideal one.** Is it time-to-launch, team familiarity, expected scale, or long-term maintainability? Rank all four honestly.",
      "**Check what your team already knows well.** Unfamiliar technology has a hidden cost that rarely shows up in the initial estimate.",
      "**Separate rendering strategy from framework choice** for the frontend — most frameworks support several rendering strategies, so pick per page-type, not once for the whole app.",
      "**Default to a mature, well-documented backend runtime** unless a specific technical requirement forces a different choice.",
      "**Spend disproportionate time on the database decision** relative to how quick it feels — it's the one piece that's genuinely expensive to change later.",
    ],
  },
  {
    type: "p",
    text: "None of this is about picking the newest tools or the most familiar ones by default — it's about being explicit about the trade-off you're making instead of inheriting one by accident. Get that part right, and the actual framework names end up mattering a lot less than the industry debate makes them seem.",
  },
];

export default function TechStackContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <ArticleHero post={post} />
      <ArticleBody blocks={blocks} />
      <NextPost post={next} />
      <RelatedPosts posts={related} />
      <DetailCTA
        heading="Not sure what the right stack is for your project?"
        description="Tell us what you're building and where it needs to be in a year. We'll help you scope a stack that fits your team and timeline, not the trend cycle."
        ctaLabel="Talk to Our Team"
      />
    </div>
  );
}
