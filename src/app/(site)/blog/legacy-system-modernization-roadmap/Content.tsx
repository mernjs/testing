import ArticleHero from "@/components/sections/ArticleHero";
import ArticleBody, { ArticleBlock } from "@/components/sections/ArticleBody";
import RelatedPosts from "@/components/sections/RelatedPosts";
import DetailCTA from "@/components/sections/DetailCTA";
import { getBlogPost, getRelatedPosts } from "@/lib/blog";

const post = getBlogPost("legacy-system-modernization-roadmap")!;
const related = getRelatedPosts(post.slug);

const blocks: ArticleBlock[] = [
  {
    type: "lead",
    text: "Full rewrites of legacy systems have a bad track record — projects that promise to replace an old system in six months routinely run two or three years over, and a meaningful share are quietly abandoned mid-way, leaving the company running the same fragile system it started with, now with less budget and morale to try again. The roadmap that actually works looks nothing like a rewrite.",
  },
  { type: "h2", id: "why-rewrites-fail", text: "Why the full rewrite so often fails" },
  {
    type: "p",
    text: "A legacy system that's been running a business for a decade contains more business logic than anyone remembers writing down. Edge cases handled in a one-off patch three years ago. A quirk in how a specific report gets calculated that a specific customer relies on. None of that is documented — it's encoded in the running system itself. A rewrite has to rediscover all of it from scratch, usually by breaking something in production and finding out which customer complains.",
  },
  {
    type: "p",
    text: "Meanwhile, the business doesn't pause while the rewrite happens. New feature requests keep coming in, and the old system has to keep receiving them, which means the rewrite is now chasing a moving target — replicating not just what the system does today, but everything added to it during the two years the rewrite has been in progress.",
  },
  { type: "h2", id: "strangler-pattern", text: "The approach that actually works: incremental replacement" },
  {
    type: "p",
    text: "The alternative — often called the strangler fig pattern, after the vine that gradually envelops and replaces its host tree — replaces a legacy system piece by piece, in production, while the old system keeps running everything not yet migrated. A routing layer sits in front of both systems, directing each request to whichever one currently owns that piece of functionality. As modules get rebuilt, more traffic shifts to the new system, until eventually nothing routes to the old one and it can be retired.",
  },
  {
    type: "p",
    text: "This approach trades a single high-risk cutover for a series of small, reversible ones. If a newly migrated module has a problem, you route traffic back to the legacy version while you fix it — nobody experiences a business-wide outage over a bug in one feature.",
  },
  { type: "h2", id: "assessment", text: "Phase one: assessment, before any code changes" },
  {
    type: "p",
    text: "Modernization that starts with code instead of assessment is modernization that rediscovers the rewrite's usual problems under a different name. A proper assessment maps three things before any migration work begins: which modules are business-critical versus rarely used, which parts of the system carry the most undocumented complexity, and which integrations — internal or third-party — depend on the current system's specific behavior.",
  },
  {
    type: "ul",
    items: [
      "**Usage analysis**, not assumptions — some \"critical\" legacy modules turn out to be used by three people a month, and some quiet ones turn out to run the whole order pipeline.",
      "**Complexity mapping**, so the hardest, riskiest modules are scheduled with the most buffer and the most testing, not saved for last out of avoidance.",
      "**Integration inventory**, since a system that quietly feeds five other internal tools needs a much more careful migration than a standalone module.",
    ],
  },
  { type: "h2", id: "sequencing", text: "Phase two: sequencing the migration" },
  {
    type: "p",
    text: "The sequence matters as much as the technique. A common, effective pattern is to start with a module that's meaningfully complex enough to prove the new architecture actually works, but not so business-critical that a mistake there is catastrophic — a real test, with a contained blast radius. Success there builds both technical confidence in the routing layer and organizational confidence in the approach, before tackling the modules that genuinely can't afford downtime.",
  },
  {
    type: "quote",
    text: "The goal of the first migrated module isn't to deliver the biggest win. It's to prove the pattern works, with a failure mode the business can absorb if something goes wrong.",
  },
  { type: "h2", id: "change-management", text: "The part that's not technical: change management" },
  {
    type: "p",
    text: "A modernization project can be architecturally sound and still fail organizationally, because the people who've worked around the legacy system's quirks for years have workflows built on its specific behavior — and a technically correct replacement that changes those workflows without warning creates real resistance, not because the new system is worse, but because nobody prepared the humans using it.",
  },
  {
    type: "ul",
    items: [
      "**Involve the people who use the system daily** in the assessment phase — they know undocumented behavior no architecture diagram will surface.",
      "**Communicate each migration phase before it ships**, not after something breaks and people are asking why.",
      "**Run both systems in parallel long enough** for users to build trust in the new one before the old one is retired.",
    ],
  },
  { type: "h2", id: "roadmap", text: "A realistic phased roadmap" },
  {
    type: "ol",
    items: [
      "**Assessment (2-4 weeks):** usage analysis, complexity mapping, and integration inventory across the full legacy system.",
      "**Routing layer and pilot migration (4-8 weeks):** build the traffic-routing infrastructure and migrate one contained, moderately complex module as proof.",
      "**Incremental migration (ongoing, module by module):** sequence remaining modules from lowest-risk to highest, each shipped and validated independently.",
      "**Parallel run and validation:** keep both systems live for critical modules until the new system has a real production track record.",
      "**Legacy retirement:** decommission the old system only once nothing routes to it and stakeholders have signed off.",
    ],
  },
  {
    type: "p",
    text: "This roadmap takes longer to show a finished result than a rewrite promises upfront — but it's the version that actually finishes, with a working business throughout, instead of a two-year bet that either pays off completely or leaves you back where you started.",
  },
];

export default function LegacyModernizationContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <ArticleHero post={post} />
      <ArticleBody blocks={blocks} />
      <RelatedPosts posts={related} />
      <DetailCTA
        heading="Living with a legacy system that's holding your team back?"
        description="We'll run an assessment of your current system and map a phased modernization path — no risky big-bang rewrite required."
        ctaLabel="Start an Assessment"
      />
    </div>
  );
}
