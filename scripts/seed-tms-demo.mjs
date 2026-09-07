#!/usr/bin/env node
/**
 * TMS demo seeder. Run with:  npm run tms:seed-demo
 *
 * DESTRUCTIVE for TMS data only: wipes the `training_*` collections it owns
 * plus the `tms_counters` sequences, then rebuilds one internally-consistent
 * dataset. Never touches leads / campaigns / chatbot / hrms_* / pms_* /
 * admin_users.
 *
 * Phase 1 seeds settings + the program catalogue. Later phases extend this
 * script with batches, students, applications, enrolments, payments, etc.
 */

import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";

const OWNED_COLLECTIONS = [
  "training_programs",
  "training_batches",
  "training_students",
  "training_applications",
  "student_enrollments",
  "class_schedules",
  "live_projects",
  "assignments",
  "assignment_submissions",
  "certificates",
  "payments",
  "placement_records",
  "training_settings",
  "training_audit_logs",
  "training_notifications",
];

const OWNED_COUNTERS = [
  "program_code",
  "batch_code",
  "student_code",
  "application_code",
  "certificate_number",
  "invoice_number",
];

function stamp(actorId = null) {
  const now = new Date();
  return { createdAt: now, updatedAt: now, createdBy: actorId, updatedBy: actorId, deletedAt: null };
}

const PROGRAMS = [
  {
    name: "MERN Stack Industrial Training",
    category: "industrial",
    technology: "MERN Stack",
    durationWeeks: 24,
    mode: "hybrid",
    fees: 45000,
    liveProjectCount: 3,
    placementAssistance: true,
    description: "Mentor-led full-stack training on MongoDB, Express, React and Node with real client projects.",
    learningOutcomes: [
      "Build and deploy production React applications",
      "Design REST and real-time APIs with Node and Express",
      "Model data and run aggregations in MongoDB",
      "Ship 3 portfolio-grade live projects",
    ],
    tools: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Git"],
  },
  {
    name: "MEAN Stack Industrial Training",
    category: "industrial",
    technology: "MEAN Stack",
    durationWeeks: 24,
    mode: "hybrid",
    fees: 45000,
    liveProjectCount: 3,
    placementAssistance: true,
    description: "Angular-first full-stack training with TypeScript end to end.",
    learningOutcomes: ["Master Angular and RxJS", "Build typed APIs with Node", "Deploy to the cloud"],
    tools: ["Angular", "TypeScript", "Node.js", "MongoDB", "RxJS"],
  },
  {
    name: "Generative AI Industrial Training",
    category: "industrial",
    technology: "Generative AI",
    durationWeeks: 16,
    mode: "online",
    fees: 55000,
    liveProjectCount: 2,
    placementAssistance: true,
    description: "Hands-on LLM application engineering — prompting, RAG, evaluation and deployment.",
    learningOutcomes: ["Build RAG pipelines", "Evaluate and guardrail LLM output", "Ship an AI product"],
    tools: ["Python", "LangChain", "Vector DBs", "OpenAI API", "FastAPI"],
  },
  {
    name: "Agentic AI Industrial Training",
    category: "industrial",
    technology: "Agentic AI",
    durationWeeks: 16,
    mode: "online",
    fees: 60000,
    liveProjectCount: 2,
    placementAssistance: true,
    description: "Design multi-step, tool-using AI agents with planning, memory and evaluation.",
    learningOutcomes: ["Design agent architectures", "Wire tool use and memory", "Measure agent reliability"],
    tools: ["Python", "LangGraph", "MCP", "Vector DBs"],
  },
  {
    name: "Conversational AI Industrial Training",
    category: "industrial",
    technology: "Conversational AI",
    durationWeeks: 14,
    mode: "online",
    fees: 50000,
    liveProjectCount: 2,
    placementAssistance: true,
    description: "Build voice and chat assistants — NLU, dialog management and telephony integration.",
    learningOutcomes: ["Design dialog flows", "Integrate speech-to-text and TTS", "Deploy a live assistant"],
    tools: ["Python", "Rasa", "Twilio", "ElevenLabs"],
  },
  {
    name: "Computer Vision Industrial Training",
    category: "industrial",
    technology: "Computer Vision",
    durationWeeks: 16,
    mode: "offline",
    fees: 52000,
    liveProjectCount: 2,
    placementAssistance: true,
    description: "Image and video understanding — detection, segmentation and on-device inference.",
    learningOutcomes: ["Train detection and segmentation models", "Optimise inference", "Deploy to edge devices"],
    tools: ["Python", "PyTorch", "OpenCV", "ONNX"],
  },
  {
    name: "Full-Stack Web Internship",
    category: "internship",
    technology: "MERN Stack",
    durationWeeks: 12,
    mode: "hybrid",
    fees: 15000,
    liveProjectCount: 1,
    placementAssistance: false,
    description: "Real-world internship track shipping features on a live web product with mentor guidance.",
    learningOutcomes: ["Work in a real sprint cadence", "Own features end to end", "Ship to production"],
    tools: ["React", "Node.js", "MongoDB", "Git"],
  },
  {
    name: "Mobile App Internship",
    category: "internship",
    technology: "React Native",
    durationWeeks: 12,
    mode: "hybrid",
    fees: 15000,
    liveProjectCount: 1,
    placementAssistance: false,
    description: "Cross-platform mobile internship building and releasing a real app.",
    learningOutcomes: ["Build cross-platform UI", "Integrate native modules", "Release to stores"],
    tools: ["React Native", "Expo", "TypeScript"],
  },
  {
    name: "AI Solutions Internship",
    category: "internship",
    technology: "Generative AI",
    durationWeeks: 12,
    mode: "online",
    fees: 18000,
    liveProjectCount: 1,
    placementAssistance: false,
    description: "Apply LLMs to a real business problem alongside the AI delivery team.",
    learningOutcomes: ["Scope an AI use case", "Build and evaluate a prototype", "Hand off to production"],
    tools: ["Python", "LangChain", "FastAPI"],
  },
  {
    name: "Data Engineering Internship",
    category: "internship",
    technology: "Data Science",
    durationWeeks: 12,
    mode: "online",
    fees: 16000,
    liveProjectCount: 1,
    placementAssistance: false,
    description: "Build and operate data pipelines feeding analytics and ML.",
    learningOutcomes: ["Model warehouses", "Build ELT pipelines", "Monitor data quality"],
    tools: ["Python", "SQL", "Airflow", "dbt"],
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-tms-demo.mjs");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    await Promise.all([
      ...OWNED_COLLECTIONS.map((name) => db.collection(name).deleteMany({})),
      db.collection("tms_counters").deleteMany({ _id: { $in: OWNED_COUNTERS } }),
    ]);

    // Settings singleton.
    await db.collection("training_settings").updateOne(
      { _id: "config" },
      {
        $set: {
          technologySuggestions: [
            "MERN Stack", "MEAN Stack", "Generative AI", "Agentic AI", "Conversational AI",
            "Computer Vision", "Data Science", "DevOps", "React Native", "Flutter",
          ],
          defaultCurrency: "INR",
          certificateNumberFormat: "YO-TMS-{yyyy}-{n}",
          defaultClassDurationMinutes: 90,
          institute: {
            name: "YashOrbit Training",
            addressLine: "YashOrbit Technologies, Sector 62",
            city: "Noida",
            email: "training@yashorbit.com",
            phone: "+91 90000 00000",
            website: "https://www.yashorbit.com",
            signatoryName: "Training Head",
            signatoryTitle: "Head of Training",
          },
          updatedAt: new Date(),
          updatedBy: null,
        },
      },
      { upsert: true }
    );

    // Programs — deterministic PRG-#### codes.
    const programDocs = PROGRAMS.map((p, i) => ({
      _id: randomUUID(),
      programCode: `PRG-${String(i + 1).padStart(4, "0")}`,
      name: p.name,
      category: p.category,
      technology: p.technology,
      durationWeeks: p.durationWeeks,
      mode: p.mode,
      fees: p.fees,
      currency: "INR",
      description: p.description,
      learningOutcomes: p.learningOutcomes,
      tools: p.tools,
      liveProjectCount: p.liveProjectCount,
      certificateIncluded: true,
      placementAssistance: p.placementAssistance,
      status: "active",
      ...stamp(),
    }));
    await db.collection("training_programs").insertMany(programDocs);
    await db.collection("tms_counters").updateOne(
      { _id: "program_code" },
      { $set: { seq: programDocs.length } },
      { upsert: true }
    );

    console.log(`\nSeeded TMS demo data:`);
    console.log(`  · 1 settings document`);
    console.log(`  · ${programDocs.length} programs (all active)`);
    console.log(`\nGrant yourself access with:  npm run tms:grant`);
    console.log(`Then sign in at /tms/login.`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
