#!/usr/bin/env node
/**
 * TMS demo seeder — one internally-consistent dataset that exercises every
 * feature of the Training Management System.
 *
 *   npm run tms:seed-demo
 *
 * DESTRUCTIVE for TMS data only. Wipes the `training_*` / `class_attendance` /
 * `tms_*` collections it owns and the student portal logins it created
 * (`admin_users.seededBy === "tms-demo"`), then rebuilds. It also `$addToSet`s
 * the `mentor` role onto a few existing HRMS employee logins so batches get a
 * real mentor — those accounts are otherwise untouched. Never touches leads /
 * campaigns / chatbot / pms_* / your own admin accounts.
 *
 * After running, grant yourself staff access with `npm run tms:grant`
 * (roles: super_admin  — or  tms_admin) and sign in at /tms/login.
 * Seeded students sign in at /tms/login with  <email shown below> / Yashorbit@2026
 */

import { MongoClient, ObjectId } from "mongodb";
import { randomUUID, randomBytes, scryptSync } from "node:crypto";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const OWNED_COLLECTIONS = [
  "training_programs",
  "training_batches",
  "training_students",
  "training_applications",
  "student_enrollments",
  "class_schedules",
  "class_attendance",
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
  "live_project_code",
];

const STUDENT_PASSWORD = "Yashorbit@2026";
const SCRYPT_KEYLEN = 64;

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

function stamp(actorId = null) {
  const now = new Date();
  return { createdAt: now, updatedAt: now, createdBy: actorId, updatedBy: actorId, deletedAt: null };
}
const isoDate = (d) => d.toISOString().slice(0, 10);
const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

const PROGRAMS = [
  { name: "MERN Stack Industrial Training", category: "industrial", technology: "MERN Stack", durationWeeks: 24, mode: "hybrid", fees: 45000, liveProjectCount: 3, placementAssistance: true,
    description: "Mentor-led full-stack training on MongoDB, Express, React and Node with three live client projects.",
    learningOutcomes: ["Build and deploy production React apps", "Design REST and real-time APIs", "Model data and run aggregations in MongoDB", "Ship 3 portfolio-grade projects"],
    tools: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Git"] },
  { name: "MEAN Stack Industrial Training", category: "industrial", technology: "MEAN Stack", durationWeeks: 24, mode: "hybrid", fees: 45000, liveProjectCount: 3, placementAssistance: true,
    description: "Angular-first full-stack training with TypeScript end to end.",
    learningOutcomes: ["Master Angular and RxJS", "Build typed APIs with Node", "Deploy to the cloud"],
    tools: ["Angular", "TypeScript", "Node.js", "MongoDB", "RxJS"] },
  { name: "Generative AI Industrial Training", category: "industrial", technology: "Generative AI", durationWeeks: 16, mode: "online", fees: 55000, liveProjectCount: 2, placementAssistance: true,
    description: "Hands-on LLM application engineering — prompting, RAG, evaluation and deployment.",
    learningOutcomes: ["Build RAG pipelines", "Evaluate and guardrail LLM output", "Ship an AI product"],
    tools: ["Python", "LangChain", "Vector DBs", "OpenAI API", "FastAPI"] },
  { name: "Agentic AI Industrial Training", category: "industrial", technology: "Agentic AI", durationWeeks: 16, mode: "online", fees: 60000, liveProjectCount: 2, placementAssistance: true,
    description: "Design multi-step, tool-using AI agents with planning, memory and evaluation.",
    learningOutcomes: ["Design agent architectures", "Wire tool use and memory", "Measure agent reliability"],
    tools: ["Python", "LangGraph", "MCP", "Vector DBs"] },
  { name: "Conversational AI Industrial Training", category: "industrial", technology: "Conversational AI", durationWeeks: 14, mode: "online", fees: 50000, liveProjectCount: 2, placementAssistance: true,
    description: "Build voice and chat assistants — NLU, dialog management and telephony integration.",
    learningOutcomes: ["Design dialog flows", "Integrate speech-to-text and TTS", "Deploy a live assistant"],
    tools: ["Python", "Rasa", "Twilio", "ElevenLabs"] },
  { name: "Computer Vision Industrial Training", category: "industrial", technology: "Computer Vision", durationWeeks: 16, mode: "offline", fees: 52000, liveProjectCount: 2, placementAssistance: true,
    description: "Image and video understanding — detection, segmentation and on-device inference.",
    learningOutcomes: ["Train detection and segmentation models", "Optimise inference", "Deploy to edge devices"],
    tools: ["Python", "PyTorch", "OpenCV", "ONNX"] },
  { name: "Full-Stack Web Internship", category: "internship", technology: "MERN Stack", durationWeeks: 12, mode: "hybrid", fees: 15000, liveProjectCount: 1, placementAssistance: false,
    description: "Real-world internship track shipping features on a live web product with mentor guidance.",
    learningOutcomes: ["Work in a real sprint cadence", "Own features end to end", "Ship to production"],
    tools: ["React", "Node.js", "MongoDB", "Git"] },
  { name: "Mobile App Internship", category: "internship", technology: "React Native", durationWeeks: 12, mode: "hybrid", fees: 15000, liveProjectCount: 1, placementAssistance: false,
    description: "Cross-platform mobile internship building and releasing a real app.",
    learningOutcomes: ["Build cross-platform UI", "Integrate native modules", "Release to stores"],
    tools: ["React Native", "Expo", "TypeScript"] },
  { name: "AI Solutions Internship", category: "internship", technology: "Generative AI", durationWeeks: 12, mode: "online", fees: 18000, liveProjectCount: 1, placementAssistance: false,
    description: "Apply LLMs to a real business problem alongside the AI delivery team.",
    learningOutcomes: ["Scope an AI use case", "Build and evaluate a prototype", "Hand off to production"],
    tools: ["Python", "LangChain", "FastAPI"] },
  { name: "Data Engineering Internship", category: "internship", technology: "Data Science", durationWeeks: 12, mode: "online", fees: 16000, liveProjectCount: 1, placementAssistance: false,
    description: "Build and operate data pipelines feeding analytics and ML.",
    learningOutcomes: ["Model warehouses", "Build ELT pipelines", "Monitor data quality"],
    tools: ["Python", "SQL", "Airflow", "dbt"] },
];

const FIRST = ["Aarav", "Diya", "Vivaan", "Ananya", "Aditya", "Ishita", "Rohan", "Kavya", "Arjun", "Sara", "Kabir", "Meera", "Yash", "Nisha", "Dev", "Riya", "Aryan", "Tara", "Karan", "Sneha", "Rahul", "Pooja", "Nikhil", "Anjali", "Siddharth", "Priya", "Manav", "Divya", "Harsh", "Neha"];
const LAST = ["Sharma", "Verma", "Iyer", "Nair", "Reddy", "Gupta", "Mehta", "Khan", "Bose", "Rao", "Das", "Joshi", "Menon", "Pillai", "Chopra"];
const COLLEGES = ["NIT Trichy", "IIIT Hyderabad", "DTU Delhi", "VIT Vellore", "BITS Pilani", "PES University", "SRM Chennai", "Manipal Institute of Technology", "COEP Pune", "Amrita Coimbatore"];
const UNIVERSITIES = ["Anna University", "VTU", "GTU", "Savitribai Phule Pune University", "AKTU"];
const BRANCHES = ["Computer Science", "Information Technology", "Electronics", "AI & Data Science", "Software Engineering"];
const SOURCES = ["Website", "Referral", "Campaign", "Campus", "Social Media", "Walk-in"];
const COMPANIES = ["Infosys", "TCS Digital", "Zoho", "Freshworks", "Razorpay", "Postman", "Swiggy", "PhonePe", "Groww", "Zerodha"];
const ROLES_PLACED = ["Software Engineer", "Frontend Developer", "ML Engineer", "Full-stack Developer", "Backend Engineer", "Data Engineer"];
const PLACEMENT_TYPES = ["campus", "off_campus", "internship_conversion", "referral"];
const CLASS_TOPICS = ["Kickoff & environment setup", "Core language fundamentals", "Version control with Git", "Building the first component", "State & data flow", "APIs & async patterns", "Database modelling", "Auth & sessions", "Testing basics", "Deployment pipeline", "Performance & profiling", "Project work session", "Code review & refactor", "Mock interview", "Guest lecture — industry practices", "Capstone checkpoint"];
const ATT_CYCLE = ["present", "present", "present", "late", "absent", "present", "excused", "present"];
const PAY_METHODS = ["UPI", "Bank Transfer", "Card", "Cash", "EMI"];
const MILESTONE_TITLES = ["Requirements & wireframes", "Core feature build", "API integration", "Testing & QA", "Deployment & demo"];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

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

    // ---- wipe ------------------------------------------------------------
    await Promise.all([
      ...OWNED_COLLECTIONS.map((name) => db.collection(name).deleteMany({})),
      db.collection("tms_counters").deleteMany({ _id: { $in: OWNED_COUNTERS } }),
      db.collection("tms_meta").deleteMany({}),
      db.collection("tms_sessions").deleteMany({}),
      db.collection("admin_users").deleteMany({ seededBy: "tms-demo" }),
    ]);
    // Drop any stale notification indexes so the app re-creates the partial one.
    await db.collection("training_notifications").dropIndexes().catch(() => {});

    // ---- settings -------------------------------------------------------
    await db.collection("training_settings").updateOne(
      { _id: "config" },
      {
        $set: {
          technologySuggestions: ["MERN Stack", "MEAN Stack", "Generative AI", "Agentic AI", "Conversational AI", "Computer Vision", "Data Science", "DevOps", "React Native", "Flutter"],
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
            signatoryName: "Aarti Mehra",
            signatoryTitle: "Head of Training",
          },
          updatedAt: new Date(),
          updatedBy: null,
        },
      },
      { upsert: true }
    );
    const CERT_FORMAT = "YO-TMS-{yyyy}-{n}";
    const YEAR = new Date().getFullYear();
    const certNo = (n) => CERT_FORMAT.replace(/\{yyyy\}/g, String(YEAR)).replace(/\{n\}/g, String(n).padStart(4, "0"));

    // ---- programs ------------------------------------------------------
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
      status: i === PROGRAMS.length - 1 ? "draft" : "active",
      ...stamp(),
    }));
    await db.collection("training_programs").insertMany(programDocs);
    await db.collection("tms_counters").updateOne({ _id: "program_code" }, { $set: { seq: programDocs.length } }, { upsert: true });

    // ---- mentors: grant `mentor` to a few HRMS employee logins --------
    const employeeLogins = await db
      .collection("admin_users")
      .find({ employeeId: { $ne: null }, roles: "employee" })
      .limit(6)
      .toArray();
    const mentorEmployeeIds = [];
    for (const login of employeeLogins) {
      await db.collection("admin_users").updateOne({ _id: login._id }, { $addToSet: { roles: "mentor" } });
      if (login.employeeId) mentorEmployeeIds.push(login.employeeId);
    }
    // Fallback: fabricate mentor ids if no HRMS employees exist (batch shows "unassigned" names gracefully).
    if (mentorEmployeeIds.length === 0) {
      const hrmsEmp = await db.collection("hrms_employees").find({ deletedAt: null }).limit(4).toArray();
      mentorEmployeeIds.push(...hrmsEmp.map((e) => e._id));
    }

    // ---- batches ------------------------------------------------------
    const TIMINGS = ["Mon–Fri · 7:00–9:00 PM IST", "Mon–Fri · 10:00 AM–12:00 PM IST", "Sat–Sun · 11:00 AM–2:00 PM IST"];
    const MODES = ["online", "offline", "hybrid"];
    const batchDocs = [];
    let batchSeq = 0;
    programDocs
      .filter((p) => p.status === "active")
      .forEach((prog, pi) => {
        const configs = [
          { offsetStart: -80, status: "running", cap: 25 },
          { offsetStart: 25, status: "upcoming", cap: 30 },
          ...(pi % 3 === 0 ? [{ offsetStart: -220, status: "completed", cap: 20 }] : []),
        ];
        configs.forEach((cfg, bi) => {
          batchSeq += 1;
          const start = daysFromNow(cfg.offsetStart);
          const end = daysFromNow(cfg.offsetStart + prog.durationWeeks * 7);
          const label = start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          batchDocs.push({
            _id: randomUUID(),
            batchCode: `BAT-${String(batchSeq).padStart(4, "0")}`,
            programId: prog._id,
            name: `${prog.technology} — ${label} ${cfg.status === "completed" ? "Batch" : bi === 0 ? "Evening" : "Weekend"}`,
            startDate: isoDate(start),
            endDate: isoDate(end),
            timing: TIMINGS[(pi + bi) % TIMINGS.length],
            mentorId: mentorEmployeeIds.length ? mentorEmployeeIds[(pi + bi) % mentorEmployeeIds.length] : null,
            capacity: cfg.cap,
            mode: MODES[(pi + bi) % MODES.length],
            status: cfg.status,
            notes: null,
            ...stamp(),
          });
        });
      });
    await db.collection("training_batches").insertMany(batchDocs);
    await db.collection("tms_counters").updateOne({ _id: "batch_code" }, { $set: { seq: batchDocs.length } }, { upsert: true });

    // ---- applications + converted students + enrolments ---------------
    const applicationDocs = [];
    const studentDocs = [];
    const enrollmentDocs = [];
    const studentLoginDocs = [];
    let appSeq = 0;
    let studentSeq = 0;
    let nameIdx = 0;

    const nextName = () => {
      const first = FIRST[nameIdx % FIRST.length];
      const last = LAST[(nameIdx * 3 + 1) % LAST.length];
      nameIdx += 1;
      return { first, last, fullName: `${first} ${last}` };
    };

    for (const prog of programDocs.filter((p) => p.status === "active")) {
      const progBatches = batchDocs.filter((b) => b.programId === prog._id);
      const openBatch = progBatches.find((b) => b.status === "upcoming") ?? progBatches.find((b) => b.status === "running");
      const runningBatch = progBatches.find((b) => b.status === "running");
      const completedBatch = progBatches.find((b) => b.status === "completed");

      for (let i = 0; i < 6; i++) {
        appSeq += 1;
        const { first, last, fullName } = nextName();
        const email = `${first}.${last}.${appSeq}@example.com`.toLowerCase();
        const college = COLLEGES[appSeq % COLLEGES.length];
        const gradYear = 2025 + (appSeq % 2);

        // i 0-1: enrolled in a running/completed batch, i 2: shortlisted, i 3: contacted, i 4: rejected, i 5: stale "new"
        let status = "new";
        let targetBatch = null;
        let enrollStatus = "active";
        if (i === 0 && runningBatch) { status = "enrolled"; targetBatch = runningBatch; }
        else if (i === 1 && completedBatch) { status = "enrolled"; targetBatch = completedBatch; enrollStatus = "completed"; }
        else if (i === 1 && runningBatch) { status = "enrolled"; targetBatch = runningBatch; }
        else if (i === 2) status = "shortlisted";
        else if (i === 3) status = "contacted";
        else if (i === 4) status = "rejected";
        else status = "new";

        let studentId = null;
        let appCreatedAt = daysFromNow(-randInt(1, 25));
        if (i === 5) appCreatedAt = daysFromNow(-randInt(12, 30)); // stale → triggers the sweep

        if (targetBatch) {
          studentSeq += 1;
          studentId = randomUUID();
          const loginEmail = `${first}.${last}.${studentSeq}@student.yashorbit.com`.toLowerCase();
          studentDocs.push({
            _id: studentId,
            studentCode: `TRN-${String(studentSeq).padStart(4, "0")}`,
            fullName,
            email,
            mobile: `+9198${String(1000000 + appSeq * 7).slice(0, 8)}`,
            address: `${randInt(1, 200)}, ${pick(["MG Road", "Park Street", "Anna Nagar", "Koramangala"])}`,
            education: {
              college,
              university: pick(UNIVERSITIES),
              branch: pick(BRANCHES),
              semester: String(randInt(6, 8)),
              graduationYear: gradYear,
            },
            guardian: { name: `${pick(FIRST)} ${last}`, phone: `+9197${String(3000000 + appSeq).slice(0, 8)}`, relation: pick(["Father", "Mother", "Guardian"]) },
            links: { resumeUrl: "https://example.com/resume.pdf", linkedin: `https://linkedin.com/in/${first}-${last}`.toLowerCase(), github: `https://github.com/${first}${last}`.toLowerCase(), photoUrl: null },
            status: enrollStatus === "completed" ? "completed" : "active",
            applicationId: null,
            notes: null,
            ...stamp(),
          });
          enrollmentDocs.push({
            _id: randomUUID(),
            studentId,
            programId: prog._id,
            batchId: targetBatch._id,
            status: enrollStatus,
            progressPercent: enrollStatus === "completed" ? 100 : 15 + ((appSeq * 13) % 55),
            enrolledOn: isoDate(daysFromNow(targetBatch.status === "completed" ? -200 : -60)),
            ...stamp(),
          });
          studentLoginDocs.push({
            _id: undefined, // filled below
            email: loginEmail,
            passwordHash: hashPassword(STUDENT_PASSWORD),
            failedLoginAttempts: 0,
            lockedUntil: null,
            createdAt: new Date(),
            lastLoginAt: null,
            roles: ["training_student"],
            studentId,
            mustChangePassword: false,
            seededBy: "tms-demo",
          });
        }

        const appId = randomUUID();
        applicationDocs.push({
          _id: appId,
          applicationCode: `APP-${String(appSeq).padStart(4, "0")}`,
          fullName,
          email,
          mobile: `+9197${String(2000000 + appSeq * 11).slice(0, 8)}`,
          programId: prog._id,
          source: SOURCES[appSeq % SOURCES.length],
          college,
          graduationYear: gradYear,
          message: i === 5 ? "Very keen to join the next cohort — please call back." : null,
          status,
          studentId,
          convertedAt: studentId ? new Date() : null,
          notes: null,
          createdAt: appCreatedAt,
          updatedAt: appCreatedAt,
          createdBy: null,
          updatedBy: null,
          deletedAt: null,
        });
        if (studentId) studentDocs.find((s) => s._id === studentId).applicationId = appId;
        void openBatch;
      }
    }

    // finalise student login _ids
    for (const l of studentLoginDocs) l._id = new ObjectId();

    await db.collection("training_applications").insertMany(applicationDocs);
    if (studentDocs.length) await db.collection("training_students").insertMany(studentDocs);
    if (enrollmentDocs.length) await db.collection("student_enrollments").insertMany(enrollmentDocs);
    if (studentLoginDocs.length) await db.collection("admin_users").insertMany(studentLoginDocs);
    await db.collection("tms_counters").updateOne({ _id: "application_code" }, { $set: { seq: applicationDocs.length } }, { upsert: true });
    await db.collection("tms_counters").updateOne({ _id: "student_code" }, { $set: { seq: studentDocs.length } }, { upsert: true });

    const enrollmentsByBatch = new Map();
    for (const e of enrollmentDocs) {
      if (!enrollmentsByBatch.has(e.batchId)) enrollmentsByBatch.set(e.batchId, []);
      enrollmentsByBatch.get(e.batchId).push(e.studentId);
    }

    // ---- classes + attendance ---------------------------------------
    const classDocs = [];
    const attendanceDocs = [];
    for (const batch of batchDocs.filter((b) => b.status === "running" || b.status === "completed")) {
      const roster = enrollmentsByBatch.get(batch._id) ?? [];
      const weekRange = batch.status === "completed" ? [-24, -1] : [-8, 5];
      for (let w = weekRange[0]; w <= weekRange[1]; w++) {
        for (const dayOffset of [0, 3]) {
          const d = daysFromNow(w * 7 + dayOffset);
          const idx = (w - weekRange[0]) * 2 + (dayOffset === 0 ? 0 : 1);
          const isPast = d < new Date();
          const cls = {
            _id: randomUUID(),
            batchId: batch._id,
            programId: batch.programId,
            mentorId: batch.mentorId,
            topic: CLASS_TOPICS[idx % CLASS_TOPICS.length],
            date: isoDate(d),
            startTime: batch.timing.includes("PM") ? "19:00" : "10:00",
            durationMinutes: 90,
            meetingLink: "https://meet.google.com/demo-tms-class",
            recordingUrl: isPast ? "https://example.com/recording" : null,
            notes: isPast ? "Covered the agenda; homework shared in the group." : null,
            status: batch.status === "completed" ? "completed" : isPast ? "completed" : "scheduled",
            ...stamp(),
          };
          classDocs.push(cls);
          if (isPast) {
            roster.forEach((studentId, si) => {
              attendanceDocs.push({
                _id: randomUUID(),
                classId: cls._id,
                batchId: batch._id,
                studentId,
                status: ATT_CYCLE[(idx + si) % ATT_CYCLE.length],
                markedAt: d,
                markedBy: null,
              });
            });
          }
        }
      }
    }
    if (classDocs.length) await db.collection("class_schedules").insertMany(classDocs);
    if (attendanceDocs.length) await db.collection("class_attendance").insertMany(attendanceDocs);

    // ---- live projects --------------------------------------------
    const projectDocs = [];
    let lpSeq = 0;
    for (const batch of batchDocs.filter((b) => b.status === "running" || b.status === "completed")) {
      const roster = enrollmentsByBatch.get(batch._id) ?? [];
      if (roster.length === 0) continue;
      lpSeq += 1;
      const done = batch.status === "completed" ? MILESTONE_TITLES.length : randInt(1, 3);
      projectDocs.push({
        _id: randomUUID(),
        projectCode: `LP-${String(lpSeq).padStart(4, "0")}`,
        title: `${batch.name.split("—")[0].trim()} Capstone`,
        description: "End-to-end product build with weekly mentor reviews and a final demo.",
        programId: batch.programId,
        batchId: batch._id,
        mentorId: batch.mentorId,
        studentIds: roster.slice(0, 3),
        milestones: MILESTONE_TITLES.map((title, i) => ({ id: randomUUID(), title, done: i < done, dueDate: isoDate(daysFromNow(-20 + i * 10)) })),
        repoUrl: "https://github.com/yashorbit/demo-capstone",
        demoUrl: batch.status === "completed" ? "https://demo.yashorbit.com/capstone" : null,
        status: batch.status === "completed" ? "completed" : "in_progress",
        progressPercent: 0,
        startDate: isoDate(daysFromNow(-40)),
        dueDate: isoDate(daysFromNow(batch.status === "completed" ? -5 : 20)),
        ...stamp(),
      });
    }
    if (projectDocs.length) await db.collection("live_projects").insertMany(projectDocs);
    await db.collection("tms_counters").updateOne({ _id: "live_project_code" }, { $set: { seq: projectDocs.length } }, { upsert: true });

    // ---- assignments + submissions -------------------------------
    const ASSIGN_TITLES = ["Warm-up exercises", "Mini-project", "Assessment task", "Peer code review"];
    const assignmentDocs = [];
    const submissionDocs = [];
    for (const batch of batchDocs.filter((b) => b.status === "running" || b.status === "completed")) {
      const roster = enrollmentsByBatch.get(batch._id) ?? [];
      ASSIGN_TITLES.slice(0, batch.status === "completed" ? 4 : 3).forEach((title, i) => {
        const due = daysFromNow(batch.status === "completed" ? -60 + i * 10 : i === 0 ? -12 : i === 1 ? 6 : 20);
        const a = {
          _id: randomUUID(),
          title: `${title} — ${batch.name.split("—")[0].trim()}`,
          description: "Complete the task and submit a link to your repository or document.",
          batchId: batch._id,
          programId: batch.programId,
          dueDate: isoDate(due),
          maxMarks: 100,
          attachmentUrl: "https://example.com/assignment-brief.pdf",
          ...stamp(),
        };
        assignmentDocs.push(a);
        if (due < new Date()) {
          roster.forEach((studentId, si) => {
            // one student per past assignment left in "resubmit", rest reviewed/submitted
            const state = si === 0 ? "submitted" : si === 1 ? "resubmit" : "reviewed";
            submissionDocs.push({
              _id: randomUUID(),
              assignmentId: a._id,
              studentId,
              status: state,
              submissionUrl: "https://github.com/student/assignment-solution",
              note: si === 0 ? "Submitted a bit late, sorry." : null,
              submittedAt: daysFromNow(-Math.max(1, Math.abs((due - new Date()) / 86400000) - 2)),
              marks: state === "reviewed" ? 65 + ((si * 9) % 30) : null,
              feedback: state === "reviewed" ? "Solid work — tighten error handling." : state === "resubmit" ? "Please add tests and resubmit." : null,
              reviewedAt: state === "reviewed" ? daysFromNow(-1) : null,
              reviewedBy: null,
            });
          });
        }
      });
    }
    if (assignmentDocs.length) await db.collection("assignments").insertMany(assignmentDocs);
    if (submissionDocs.length) await db.collection("assignment_submissions").insertMany(submissionDocs);

    // ---- certificates (completed students) + 1 revoked + 1 reissued ---
    const completedEnrollments = enrollmentDocs.filter((e) => e.status === "completed");
    const certDocs = [];
    let certSeq = 0;
    completedEnrollments.forEach((e, i) => {
      certSeq += 1;
      const prog = programDocs.find((p) => p._id === e.programId);
      const base = {
        _id: randomUUID(),
        certificateNumber: certNo(certSeq),
        verificationCode: randomBytes(9).toString("base64url"),
        type: prog?.category === "internship" ? "internship" : "industrial_training",
        studentId: e.studentId,
        programId: e.programId,
        batchId: e.batchId,
        title: null,
        issuedOn: isoDate(daysFromNow(-randInt(3, 20))),
        grade: ["A+", "A", "B+"][certSeq % 3],
        revoked: i === completedEnrollments.length - 1, // last one revoked
        revokedReason: i === completedEnrollments.length - 1 ? "Issued in error — corrected certificate reissued." : null,
        reissuedFromId: null,
        ...stamp(),
      };
      certDocs.push(base);
      // project-completion certificate for the first completed student
      if (i === 0) {
        certSeq += 1;
        certDocs.push({
          ...base,
          _id: randomUUID(),
          certificateNumber: certNo(certSeq),
          verificationCode: randomBytes(9).toString("base64url"),
          type: "project_completion",
          title: `${prog?.technology ?? "Capstone"} — E-commerce platform`,
          grade: "Excellent",
          revoked: false,
          revokedReason: null,
          reissuedFromId: null,
          ...stamp(),
        });
      }
    });
    // a reissued pair (revoke original, mint new referencing it)
    if (certDocs.length > 0) {
      const original = { ...certDocs[0], revoked: true, revokedReason: "Reissued" };
      certDocs[0] = original;
      certSeq += 1;
      certDocs.push({
        ...original,
        _id: randomUUID(),
        certificateNumber: certNo(certSeq),
        verificationCode: randomBytes(9).toString("base64url"),
        revoked: false,
        revokedReason: null,
        reissuedFromId: original._id,
        issuedOn: isoDate(daysFromNow(-1)),
        ...stamp(),
      });
    }
    if (certDocs.length) await db.collection("certificates").insertMany(certDocs);
    await db.collection("tms_counters").updateOne({ _id: "certificate_number" }, { $set: { seq: certSeq } }, { upsert: true });

    // ---- payments (fee plan per enrolment; mix of paid / partial / unpaid) ---
    const paymentDocs = [];
    let invSeq = 0;
    enrollmentDocs.forEach((e, ei) => {
      const prog = programDocs.find((p) => p._id === e.programId);
      const total = prog?.fees ?? 40000;
      const discount = ei % 6 === 0 ? 3000 : 0;
      const net = total - discount;
      const installments = [];
      const bucket = ei % 4; // 0 unpaid, 1 partial, 2 partial, 3 fully paid
      if (bucket >= 1) {
        invSeq += 1;
        const amt = bucket === 3 ? Math.round(net * 0.6) : Math.round(net * 0.5);
        installments.push({
          id: randomUUID(),
          amount: amt,
          method: PAY_METHODS[ei % PAY_METHODS.length],
          transactionId: `TXN${100000 + ei * 7}`,
          paidOn: isoDate(daysFromNow(-randInt(30, 55))),
          invoiceNumber: `INV-${YEAR}-${String(invSeq).padStart(4, "0")}`,
          note: null,
          recordedBy: null,
          recordedAt: daysFromNow(-40),
        });
      }
      if (bucket === 3) {
        invSeq += 1;
        const paid = installments.reduce((s, x) => s + x.amount, 0);
        installments.push({
          id: randomUUID(),
          amount: net - paid,
          method: PAY_METHODS[(ei + 2) % PAY_METHODS.length],
          transactionId: `TXN${200000 + ei * 7}`,
          paidOn: isoDate(daysFromNow(-randInt(5, 20))),
          invoiceNumber: `INV-${YEAR}-${String(invSeq).padStart(4, "0")}`,
          note: "Final instalment",
          recordedBy: null,
          recordedAt: daysFromNow(-10),
        });
      }
      paymentDocs.push({
        _id: randomUUID(),
        studentId: e.studentId,
        programId: e.programId,
        batchId: e.batchId,
        enrollmentId: e._id,
        totalFees: total,
        currency: "INR",
        discount,
        installments,
        notes: bucket === 0 ? "First instalment due at induction." : null,
        ...stamp(),
      });
    });
    if (paymentDocs.length) await db.collection("payments").insertMany(paymentDocs);
    await db.collection("tms_counters").updateOne({ _id: "invoice_number" }, { $set: { seq: invSeq } }, { upsert: true });

    // ---- placements (subset of completed students) --------------------
    const placementDocs = completedEnrollments.slice(0, Math.max(1, Math.floor(completedEnrollments.length * 0.7))).map((e, i) => ({
      _id: randomUUID(),
      studentId: e.studentId,
      programId: e.programId,
      company: COMPANIES[i % COMPANIES.length],
      role: ROLES_PLACED[i % ROLES_PLACED.length],
      packageLpa: Math.round((5.5 + i * 1.25) * 10) / 10,
      location: ["Bengaluru", "Hyderabad", "Pune", "Remote", "Chennai"][i % 5],
      type: PLACEMENT_TYPES[i % PLACEMENT_TYPES.length],
      placedOn: isoDate(daysFromNow(-randInt(10, 45))),
      offerLetterUrl: "https://example.com/offer-letter.pdf",
      notes: null,
      ...stamp(),
    }));
    if (placementDocs.length) await db.collection("placement_records").insertMany(placementDocs);

    // ---- notifications (immediate content in the bell) ---------------
    const staffAccounts = await db
      .collection("admin_users")
      .find({ roles: { $in: ["super_admin", "tms_admin", "tms_manager"] } })
      .toArray();
    const notifDocs = [];
    for (const s of staffAccounts) {
      notifDocs.push(
        { _id: randomUUID(), recipientUserId: String(s._id), audience: "staff", type: "applications_stale", title: "Applications need follow-up", body: "Some applicants have been in New for over a week.", link: "/tms/applications/board", read: false, createdAt: daysFromNow(-1) },
        { _id: randomUUID(), recipientUserId: String(s._id), audience: "staff", type: "fees_pending", title: "Pending fee balances", body: "Several fee plans have outstanding amounts.", link: "/tms/payments", read: true, createdAt: daysFromNow(-3) }
      );
    }
    for (const l of studentLoginDocs.slice(0, 5)) {
      notifDocs.push(
        { _id: randomUUID(), recipientUserId: String(l._id), audience: "student", type: "class_reminder", title: "Class tomorrow", body: "State & data flow · 7:00 PM", link: "/tms/me/schedule", read: false, createdAt: daysFromNow(-1) },
        { _id: randomUUID(), recipientUserId: String(l._id), audience: "student", type: "assignment_posted", title: "New assignment", body: "Mini-project · due next week", link: "/tms/me/assignments", read: false, createdAt: daysFromNow(-2) }
      );
    }
    if (notifDocs.length) await db.collection("training_notifications").insertMany(notifDocs);

    // ---- audit log sample ------------------------------------------
    await db.collection("training_audit_logs").insertMany(
      programDocs.slice(0, 5).map((p) => ({
        _id: randomUUID(),
        actorId: "seed",
        actorEmail: "seed@yashorbit.com",
        action: "create",
        entity: "program",
        entityId: p._id,
        entityLabel: p.name,
        summary: null,
        metadata: null,
        createdAt: daysFromNow(-randInt(30, 90)),
      }))
    );

    // ---- summary --------------------------------------------------
    const sample = studentLoginDocs.slice(0, 3).map((l) => l.email);
    console.log(`\n✓ Seeded TMS demo data:\n`);
    console.log(`  programs .............. ${programDocs.length}  (${programDocs.filter((p) => p.status === "active").length} active, 1 draft)`);
    console.log(`  batches ............... ${batchDocs.length}  (running / upcoming / completed)`);
    console.log(`  mentors linked ....... ${mentorEmployeeIds.length}${employeeLogins.length ? ` (mentor role granted to ${employeeLogins.length} HRMS logins)` : ""}`);
    console.log(`  applications ......... ${applicationDocs.length}  (incl. stale "new" for the sweep)`);
    console.log(`  students ............. ${studentDocs.length}  + portal logins`);
    console.log(`  enrolments .......... ${enrollmentDocs.length}  (${completedEnrollments.length} completed)`);
    console.log(`  classes ............. ${classDocs.length}  + ${attendanceDocs.length} attendance marks`);
    console.log(`  live projects ....... ${projectDocs.length}`);
    console.log(`  assignments ......... ${assignmentDocs.length}  + ${submissionDocs.length} submissions`);
    console.log(`  certificates ........ ${certDocs.length}  (incl. 1 revoked, 1 reissued)`);
    console.log(`  fee plans ........... ${paymentDocs.length}  + ${invSeq} receipts`);
    console.log(`  placements .......... ${placementDocs.length}`);
    console.log(`  notifications ....... ${notifDocs.length}`);
    console.log(`\n  To test the staff panel:  npm run tms:grant   → roles: super_admin  (or tms_admin)`);
    console.log(`                            then sign in at /tms/login`);
    console.log(`\n  To test the student portal, sign in at /tms/login with:`);
    for (const e of sample) console.log(`    ${e}   /   ${STUDENT_PASSWORD}`);
    console.log(`\n  Public certificate verification: open any certificate in /tms/certificates and follow its verify link.`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
