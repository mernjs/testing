// AI Bots demo data: four logins (admin / manager / user / limited user) and a starter set of bots. Bots are DATA — the app
// renders every one of them through the same pages. No OpenAI resources are created here: each bot's vector store is created
// on its first knowledge upload, and chats create their OpenAI Conversation on the first message.
// Idempotent: every bot it creates has a `demo-aibots-` id and is replaced on each run.
import { ObjectId } from "mongodb";
import { hashPassword } from "./lib.mjs";

const PASSWORD = "Demo@12345";
const D = "demo-aibots-";

export const AIBOTS_DEMO_ACCOUNTS = [
  { email: "demo.aibots.admin@yashorbit.com", label: "AI Bots Admin (everything)", roles: ["aibots_admin"] },
  { email: "demo.aibots.manager@yashorbit.com", label: "AI Bots Manager (build bots, review chats)", roles: ["aibots_manager"] },
  { email: "demo.aibots.user@yashorbit.com", label: "AI Bots User (sales — sees sales bots)", roles: ["aibots_user", "lms_agent"] },
  { email: "demo.aibots.limited@yashorbit.com", label: "AI Bots User (only open bots)", roles: ["aibots_user"] },
];

const BOTS = [
  {
    key: "discovery", name: "Discovery Call AI", icon: "phone", color: "sky", category: "Pre-sales",
    description: "Prepares discovery-call agendas and questions, then turns call notes into a structured summary.",
    instructions: "You are Discovery Call AI for YashOrbit. Help the sales team prepare for and follow up on client discovery calls.\n- Before a call: produce an agenda and 10–15 probing questions tailored to the client's industry.\n- After a call: turn raw notes into Summary, Pain points, Goals, Budget/Timeline signals, Risks and Next steps.\n- Ask for missing context (client, industry, call goal) before guessing.",
    starterPrompts: ["Prepare a discovery call for a mid-size logistics company", "Summarise these call notes into next steps"],
  },
  {
    key: "meeting", name: "Meeting Assistant AI", icon: "calendar", color: "violet", category: "Delivery",
    description: "Turns meeting notes or transcripts into minutes, decisions and action items with owners.",
    instructions: "You are Meeting Assistant AI. Convert meeting notes or transcripts into: Attendees, Key discussion points, Decisions, Action items (owner, due date), Open questions. Be concise and never invent owners or dates — mark them TBD.",
    starterPrompts: ["Write minutes from these notes", "List action items with owners"],
  },
  {
    key: "proposal", name: "ProposalGPT", icon: "file-text", color: "indigo", category: "Sales", allowAttachments: true,
    description: "Drafts client proposals from YashOrbit's company profile, services, case studies and pricing.",
    instructions: "You are ProposalGPT, YashOrbit's proposal writer. Use the knowledge base (company profile, services, previous proposals, case studies, pricing) as the source of truth.\nStructure: Executive summary, Understanding of requirements, Proposed solution, Approach & timeline, Team, Commercials, Why YashOrbit.\nNever invent prices or case studies that aren't in the knowledge base — say what is missing.",
    starterPrompts: ["Draft a proposal for a healthcare appointment app", "Which case studies fit a fintech client?"],
    access: { mode: "restricted", roles: ["lms_agent", "lms_manager"], userIds: [] },
  },
  {
    key: "requirements", name: "Requirement Analyzer AI", icon: "search", color: "emerald", category: "Business Analysis", allowAttachments: true,
    description: "Reviews requirements for gaps, ambiguity and conflicts against BRD/FRD templates and business rules.",
    instructions: "You are Requirement Analyzer AI. Review the requirements the user provides against the templates, guidelines and business rules in your knowledge base. Report: Ambiguities, Missing requirements, Conflicts, Non-functional gaps, and Clarifying questions — each with a short rationale.",
    starterPrompts: ["Review these requirements for gaps", "What questions should I ask the client?"],
  },
  {
    key: "brd", name: "BRD Generator AI", icon: "clipboard", color: "amber", category: "Business Analysis",
    description: "Generates a Business Requirements Document from discovery notes using the standard BRD template.",
    instructions: "You are BRD Generator AI. Produce a Business Requirements Document following the BRD template in your knowledge base: Background, Objectives, Scope (in/out), Stakeholders, Business requirements (numbered), Assumptions, Constraints, Success metrics.",
    starterPrompts: ["Create a BRD from these discovery notes"],
  },
  {
    key: "sow", name: "SOW Generator AI", icon: "scale", color: "rose", category: "Sales", status: "inactive",
    description: "Drafts statements of work — scope, deliverables, milestones and acceptance criteria. (Inactive demo bot.)",
    instructions: "You are SOW Generator AI. Draft a Statement of Work: Scope, Deliverables, Milestones, Acceptance criteria, Assumptions, Change control, Commercial terms placeholder.",
    starterPrompts: [],
  },
];

export async function seedAibots(db) {
  const now = new Date();
  const passwordHash = hashPassword(PASSWORD);
  const users = {};
  for (const a of AIBOTS_DEMO_ACCOUNTS) {
    const local = a.email.split("@")[0].replace("demo.aibots.", "");
    const userId = (await db.collection("admin_users").findOne({ email: a.email }, { projection: { _id: 1 } }))?._id ?? new ObjectId();
    await db.collection("admin_users").updateOne(
      { email: a.email },
      { $set: { email: a.email, passwordHash, roles: a.roles, permissionOverrides: {}, userType: "employee", employeeId: null, mustChangePassword: false, failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: null }, $setOnInsert: { _id: userId, createdAt: now } },
      { upsert: true }
    );
    users[local] = userId.toString();
  }

  await db.collection("aibots_bots").deleteMany({ _id: new RegExp(`^${D}`) });
  const docs = BOTS.map((b) => ({
    _id: `${D}${b.key}`,
    name: b.name,
    icon: b.icon,
    color: b.color,
    description: b.description,
    category: b.category,
    instructions: b.instructions,
    model: "gpt-4.1-mini",
    temperature: 0.4,
    allowAttachments: b.allowAttachments ?? false,
    starterPrompts: b.starterPrompts,
    access: b.access ?? { mode: "all", roles: [], userIds: [] },
    status: b.status ?? "active",
    vectorStoreId: null,
    createdAt: now,
    updatedAt: now,
    createdBy: users.manager,
    updatedBy: users.manager,
    deletedAt: null,
  }));
  await db.collection("aibots_bots").insertMany(docs);
  return { bots: docs.length, active: docs.filter((d) => d.status === "active").length };
}
