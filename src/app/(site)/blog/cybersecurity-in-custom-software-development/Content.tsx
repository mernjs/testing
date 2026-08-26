import ArticleHero from "@/components/sections/ArticleHero";
import ArticleBody, { ArticleBlock } from "@/components/sections/ArticleBody";
import RelatedPosts from "@/components/sections/RelatedPosts";
import DetailCTA from "@/components/sections/DetailCTA";
import { getBlogPost, getRelatedPosts } from "@/lib/blog";

const post = getBlogPost("cybersecurity-in-custom-software-development")!;
const related = getRelatedPosts(post.slug);

const blocks: ArticleBlock[] = [
  {
    type: "lead",
    text: "Security is usually treated as a phase — something that happens in a penetration test right before launch, or worse, right after an incident. But the software that holds up under real-world attack traffic was built differently from the start: security wasn't a phase, it was a set of default decisions made throughout the build.",
  },
  { type: "h2", id: "why-bolted-on-fails", text: "Why \"bolt it on later\" doesn't actually work" },
  {
    type: "p",
    text: "A pre-launch security audit is a useful safety net, but it's a poor substitute for building securely from the start, for a simple reason: a lot of the most serious vulnerabilities are architectural, not superficial. Fixing how authentication tokens are handled, how data is isolated between tenants, or how permissions are checked often means touching core logic across the whole application — work that's cheap during initial development and expensive to retrofit into a system already in production with real users and real data.",
  },
  {
    type: "p",
    text: "The businesses that get burned aren't usually the ones who skipped security entirely. They're the ones who treated it as a checklist to run once, instead of a set of habits the engineering team follows on every feature.",
  },
  { type: "h2", id: "auth", text: "Authentication and authorization: get the boring parts right" },
  {
    type: "p",
    text: "Most breaches don't involve a sophisticated exploit — they involve a basic access control mistake. A user who can see another user's data by changing an ID in the URL. An admin endpoint that checks whether you're logged in, but not whether you're allowed to be there. These are unglamorous bugs, and that's exactly why they're common: they don't show up in a demo, only under adversarial testing.",
  },
  {
    type: "ul",
    items: [
      "**Authorization checks on every request**, not just at the UI layer — the API itself has to enforce who can see and change what.",
      "**Short-lived, properly scoped tokens** instead of long-lived credentials that become a bigger liability the longer they're valid.",
      "**Multi-factor authentication** for anything touching sensitive data or admin capability, not just as an optional user setting.",
      "**Rate limiting on authentication endpoints** specifically, since these are the most targeted for automated credential-stuffing attacks.",
    ],
  },
  { type: "h2", id: "data-handling", text: "Data handling: encrypt, minimize, and classify" },
  {
    type: "p",
    text: "Two questions catch most data-handling problems before they become incidents: what data are we actually storing that we don't need to, and is what we do store protected the way its sensitivity requires? Collecting less data reduces your exposure automatically — you can't leak what you never stored. For what you do keep, encryption in transit is table stakes, and encryption at rest matters more than most teams initially budget for, especially for anything classified as personal or financial data.",
  },
  {
    type: "p",
    text: "Data classification sounds like enterprise process overhead, but even a lightweight version — tagging fields as public, internal, or sensitive at the schema level — makes it far easier to apply the right protection consistently instead of relying on every engineer remembering by hand.",
  },
  { type: "h2", id: "dependencies", text: "Dependency hygiene: the risk you inherit, not the risk you create" },
  {
    type: "p",
    text: "A modern application is built on hundreds of third-party packages, and a meaningful share of real-world breaches trace back to a known vulnerability in a dependency that simply wasn't updated. This is one of the highest-leverage, lowest-effort parts of application security: automated dependency scanning, a defined patching cadence, and pinning to specific known-good versions rather than always-latest, catch this class of problem before it becomes exploitable.",
  },
  {
    type: "callout",
    title: "A practical minimum",
    text: "If you do nothing else, run automated vulnerability scanning on every dependency on every build, and treat a critical-severity finding as a blocking issue, not a backlog item. It's a small process change that closes one of the most commonly exploited gaps.",
  },
  { type: "h2", id: "infrastructure", text: "Infrastructure: least privilege as a default, not an afterthought" },
  {
    type: "p",
    text: "The principle of least privilege — every service, credential, and person having exactly the access they need and nothing more — sounds obvious and is routinely ignored under deadline pressure. A database credential with full admin rights used for a read-only reporting service. A cloud storage bucket left publicly readable during testing and never locked back down. These aren't sophisticated attacks; they're configuration mistakes that automated scanners on the open internet find within hours of exposure.",
  },
  {
    type: "ul",
    items: [
      "Separate credentials per service, scoped to only what that service needs to do.",
      "Infrastructure defined as code, so access changes are reviewed the same way application code changes are.",
      "Regular, automated audits of public-facing storage and endpoints — not a one-time check at launch.",
    ],
  },
  { type: "h2", id: "cost-argument", text: "The cost argument, not just the risk argument" },
  {
    type: "p",
    text: "Security work often gets deprioritized because its value is invisible — a breach that didn't happen doesn't show up in a quarterly report. But the cost comparison is stark once you run it: fixing an authorization flaw during development might take an afternoon. Fixing it after a breach means incident response, customer notification, potential regulatory exposure, and lasting reputational damage, on top of the same afternoon of engineering work you'd have needed anyway. Building it in from the start isn't the cautious option — it's the cheaper one.",
  },
  {
    type: "quote",
    text: "The businesses that treat security as a feature to be prioritized against other features usually end up paying for it twice — once in delayed launch, and again in incident response.",
  },
  { type: "h2", id: "questions-to-ask", text: "Questions worth asking your development team, or your vendor" },
  {
    type: "ol",
    items: [
      "Are authorization checks enforced server-side on every endpoint, or only in the UI?",
      "What's our dependency update and vulnerability scanning cadence?",
      "Which data fields are classified as sensitive, and is that classification reflected in how they're encrypted and accessed?",
      "Do we follow least-privilege access for every service credential, or are some using broader permissions than they need?",
      "When did we last run an actual penetration test, versus an internal review?",
    ],
  },
  {
    type: "p",
    text: "None of this requires a dedicated security team from day one — it requires making these questions part of the standard development process instead of a separate, deferred phase. That shift alone closes the gap that most preventable breaches fall through.",
  },
];

export default function CybersecurityContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <ArticleHero post={post} />
      <ArticleBody blocks={blocks} />
      <RelatedPosts posts={related} />
      <DetailCTA
        heading="Not sure your application's security holds up?"
        description="We build security into custom software from the first sprint, not the last. Talk to us about a security-focused technical review."
        ctaLabel="Request a Review"
      />
    </div>
  );
}
