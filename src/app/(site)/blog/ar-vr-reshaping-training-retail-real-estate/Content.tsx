import ArticleHero from "@/components/sections/ArticleHero";
import ArticleBody, { ArticleBlock } from "@/components/sections/ArticleBody";
import RelatedPosts from "@/components/sections/RelatedPosts";
import DetailCTA from "@/components/sections/DetailCTA";
import { getBlogPost, getRelatedPosts } from "@/lib/blog";

const post = getBlogPost("ar-vr-reshaping-training-retail-real-estate")!;
const related = getRelatedPosts(post.slug);

const blocks: ArticleBlock[] = [
  {
    type: "lead",
    text: "AR and VR spent the better part of a decade being described as \"the next big thing,\" which is usually what people say about a technology that hasn't found its business case yet. It has now, in a handful of specific, unglamorous applications — and the companies quietly getting value from it aren't building metaverse platforms, they're solving concrete operational problems.",
  },
  { type: "h2", id: "training", text: "Training: rehearsal without the risk" },
  {
    type: "p",
    text: "The clearest, most measurable AR/VR use case today is training for situations that are expensive, dangerous, or logistically hard to practice repeatedly in the real world. A technician learning to service industrial equipment, a new hire learning a warehouse safety procedure, a surgical team rehearsing a rare procedure — VR lets someone practice the exact motions and decision points as many times as needed, with mistakes that cost nothing instead of mistakes that cost equipment, safety, or a real patient outcome.",
  },
  {
    type: "p",
    text: "The measurable win here isn't novelty, it's repetition at low cost. A company running physical equipment training might get each new hire through a supervised session once or twice before they're on their own. A VR module can be run as many times as it takes to build real muscle memory, and it can be updated centrally the moment a procedure changes — no need to retrain instructors across every location.",
  },
  { type: "h2", id: "retail", text: "Retail: reducing the guesswork before purchase" },
  {
    type: "p",
    text: "Retail's AR use case solves a specific, expensive problem: return rates driven by products that didn't match what the customer expected. Augmented reality try-on and placement — seeing how furniture actually looks in your specific room, how a pair of glasses actually fits your face — closes the gap between what a product photo suggests and what a customer receives, and the return-rate data from companies that have implemented this well shows a measurable, direct effect.",
  },
  {
    type: "p",
    text: "Virtual showrooms extend this further for categories where an in-person visit was previously required — automotive configuration, high-end furniture, home renovation planning — letting a customer explore options remotely with a level of detail a static catalog page can't match.",
  },
  { type: "h2", id: "real-estate", text: "Real estate: qualifying interest before a physical visit" },
  {
    type: "p",
    text: "Property tours are the AR/VR use case with the most straightforward economics: a virtual walkthrough costs a fraction of a physical showing and can reach a buyer who's evaluating multiple cities, not just multiple listings in one. For commercial real estate and new development in particular — where the physical property may not even be built yet — a VR walkthrough of the finished space lets buyers commit earlier in the process than a floor plan and renderings alone could achieve.",
  },
  {
    type: "p",
    text: "The practical effect for agents and developers isn't replacing in-person visits entirely — it's filtering for genuine interest before investing the time and cost of a physical showing, so those in-person visits convert at a meaningfully higher rate.",
  },
  {
    type: "quote",
    text: "The AR/VR projects that deliver ROI share a pattern: they replace something expensive to repeat in the physical world — a demo, a showing, a training session — with a virtual version that costs a fraction as much to run again.",
  },
  { type: "h2", id: "getting-the-economics-right", text: "Getting the economics right before building" },
  {
    type: "p",
    text: "The projects that disappoint are usually the ones scoped around the technology's novelty rather than a specific, recurring cost it removes. Before committing budget, it's worth answering a direct question: what physical-world activity does this replace or reduce, and how many times does that activity currently happen per month? A training module that replaces a session run twice a year has a much longer payback period than one replacing a session run weekly across a dozen locations.",
  },
  {
    type: "ul",
    items: [
      "**Identify the specific repeated cost** — a physical demo, a training session, a site visit — the AR/VR experience is meant to reduce.",
      "**Estimate real frequency**, not hoped-for frequency, of that activity today.",
      "**Scope the first build narrowly** around one use case with clear, trackable metrics, rather than a broad platform meant to cover everything eventually.",
      "**Plan for content updates from the start** — a training module or product catalog that goes stale within months loses its value fast if updating it isn't built into the workflow.",
    ],
  },
  { type: "h2", id: "hardware-reality", text: "A note on hardware, honestly" },
  {
    type: "p",
    text: "Headset adoption remains the practical constraint for consumer-facing VR experiences — not every customer owns one, so a retail or real estate use case built purely for VR headsets has a smaller reachable audience than one built for AR on a phone, which nearly every customer already carries. For enterprise training use cases, this constraint mostly disappears — the company provides the headset as part of the training program, the same way it would provide any other equipment.",
  },
  {
    type: "p",
    text: "This is worth deciding upfront rather than discovering after a build: consumer-facing use cases generally favor phone-based AR for reach, while internal training use cases can lean into full VR immersion without the same adoption barrier.",
  },
];

export default function ARVRContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <ArticleHero post={post} />
      <ArticleBody blocks={blocks} />
      <RelatedPosts posts={related} />
      <DetailCTA
        heading="Have a repeated physical process AR or VR could replace?"
        description="We'll help you scope an AR/VR pilot around a specific, measurable cost — training, showings, or product visualization — before committing to a full build."
        ctaLabel="Explore AR/VR for Your Business"
      />
    </div>
  );
}
