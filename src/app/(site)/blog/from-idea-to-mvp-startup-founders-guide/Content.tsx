import ArticleHero from "@/components/sections/ArticleHero";
import ArticleBody, { ArticleBlock } from "@/components/sections/ArticleBody";
import NextPost from "@/components/sections/NextPost";
import RelatedPosts from "@/components/sections/RelatedPosts";
import DetailCTA from "@/components/sections/DetailCTA";
import { getBlogPost, getRelatedPosts, getNextPost } from "@/lib/blog";

const post = getBlogPost("from-idea-to-mvp-startup-founders-guide")!;
const related = getRelatedPosts(post.slug);
const next = getNextPost(post.slug);

const blocks: ArticleBlock[] = [
  {
    type: "lead",
    text: "An MVP has exactly one job: test your riskiest assumption as cheaply as possible. Most MVPs fail to do that job — not because they're poorly built, but because they're scoped wrong from the start, either as a stripped-down version of the full product vision or as a prototype so thin it can't actually test anything real.",
  },
  { type: "h2", id: "wrong-question", text: "The question founders usually ask, and the one they should ask" },
  {
    type: "p",
    text: "\"What's the minimum feature set for version one?\" feels like the right question, but it leads most founders to build a smaller version of their whole product — fewer features, same breadth, still months of work. The question that actually scopes a useful MVP is different: **what's the one assumption that, if wrong, means this business doesn't work — and what's the smallest thing we can build to find out?**",
  },
  {
    type: "p",
    text: "Those two questions produce very different products. The first produces a slimmed-down app with ten features instead of thirty. The second often produces something narrower and stranger-looking — sometimes barely software at all — that exists purely to answer one make-or-break question fast.",
  },
  { type: "h2", id: "riskiest-assumption", text: "Finding your riskiest assumption" },
  {
    type: "p",
    text: "Every startup idea rests on a stack of assumptions, and they're not equally risky. \"Users will pay for this\" is usually riskier than \"we can build the payment flow.\" \"Businesses will trust an AI agent with this task\" is usually riskier than \"the AI agent can technically do the task.\" The build risk is almost always lower than the market risk — yet founders instinctively spend their MVP budget derisking the part they're already confident about, because it's the part they know how to build.",
  },
  {
    type: "ul",
    items: [
      "Will the target user actually adopt a new tool for this, or route around it with something they already use?",
      "Will they pay what you need them to pay, at the volume you need?",
      "Does the core value proposition hold up in a real, messy use case — not the clean demo scenario?",
      "Is there a legal, trust, or behavior-change barrier bigger than the technical one?",
    ],
  },
  {
    type: "p",
    text: "Whichever of these keeps you up at night is the one your MVP needs to test. Everything else can wait, be faked, or be handled manually behind the scenes for now.",
  },
  { type: "h2", id: "two-mistakes", text: "The two mistakes that sink most MVPs" },
  { type: "h3", text: "Mistake one: building too much" },
  {
    type: "p",
    text: "This is the more common failure. A founder scopes an MVP that includes user accounts, an admin dashboard, a settings page, three user roles, and a polished onboarding flow — because it all feels necessary for a \"real\" product. Six months and a meaningful budget later, they finally learn whether anyone wants the core thing at all. By then, the money and the market timing that could have funded a pivot are both gone.",
  },
  { type: "h3", text: "Mistake two: building too little to learn anything real" },
  {
    type: "p",
    text: "The overcorrection is just as damaging — a landing page with a fake \"sign up\" button, or a clickable prototype nobody can actually use. These can validate interest, but they can't validate the thing that usually matters most: whether the product works well enough, in a real use case, that someone keeps using it after the novelty wears off. \"Would you use this\" and \"did you keep using this\" are different questions, and only a working, if narrow, product answers the second one.",
  },
  {
    type: "quote",
    text: "The right MVP is uncomfortably narrow. If it doesn't feel like you're leaving out something important, you probably haven't cut enough.",
  },
  { type: "h2", id: "what-to-fake", text: "What's safe to fake, and what isn't" },
  {
    type: "p",
    text: "A genuinely useful technique for keeping an MVP lean is deliberately doing manually, behind the scenes, whatever doesn't need to be automated yet to test the core assumption. If you're testing whether businesses want an AI-matched job board, you can run the matching manually for the first fifty users while the interface looks fully automated — you're testing demand and match quality, not your matching algorithm's engineering, yet.",
  },
  {
    type: "ul",
    items: [
      "**Safe to fake or handle manually:** back-office admin tools, complex automation, scale-related infrastructure, anything only relevant once you already have real users.",
      "**Not safe to fake:** the core interaction the user is actually there for. If your product is a scheduling tool, the scheduling has to genuinely work.",
    ],
  },
  { type: "h2", id: "timeline-and-cost", text: "What a real MVP timeline and cost typically looks like" },
  {
    type: "p",
    text: "A well-scoped MVP — narrow, focused on one core assumption, with manual processes standing in for anything non-essential — is usually buildable in 6-10 weeks with a small, focused team, not the 4-6 months a full-featured \"v1\" tends to take. That timeline difference isn't just about launching sooner; it's about how much runway is left to actually act on what you learn, whether that's doubling down, pivoting, or stopping before sinking more into the wrong direction.",
  },
  { type: "h2", id: "checklist", text: "A scoping checklist before you start building" },
  {
    type: "ol",
    items: [
      "**Name your riskiest assumption explicitly** — write it down as a sentence, not a vague feeling.",
      "**Design the smallest product that tests that specific assumption**, not a smaller version of your full vision.",
      "**List everything that can be handled manually behind the scenes** instead of built and automated on day one.",
      "**Set a decision point in advance** — what result would mean \"keep going,\" and what would mean \"pivot\"?",
      "**Protect your timeline** — a narrow MVP that ships in two months and gets a real answer beats a broader one that ships in six and gets the same answer, later and more expensively.",
    ],
  },
  {
    type: "p",
    text: "None of this is about building something embarrassing on purpose. It's about being disciplined enough to spend your limited early budget answering the one question that actually determines whether the rest of the product is worth building at all.",
  },
];

export default function MVPGuideContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <ArticleHero post={post} />
      <ArticleBody blocks={blocks} />
      <NextPost post={next} />
      <RelatedPosts posts={related} />
      <DetailCTA
        heading="Ready to scope your MVP the right way?"
        description="We'll help you identify your riskiest assumption and design the smallest product that actually tests it — then build it in weeks, not months."
        ctaLabel="Start Scoping Your MVP"
      />
    </div>
  );
}
