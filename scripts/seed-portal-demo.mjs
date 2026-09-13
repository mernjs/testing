#!/usr/bin/env node
/**
 * Seed one External User Portal account per role, matched to existing seeded
 * records (`career_applications`, `training_students`, `pms_clients`). Prints the
 * login credentials.
 *
 *   node --env-file=.env scripts/seed-portal-demo.mjs
 *
 * Idempotent: re-running updates the password on the demo accounts rather than
 * creating duplicates. Run the domain seeders first:
 *   node --env-file=.env scripts/seed-tms-demo.mjs
 *   node --env-file=.env scripts/seed-pms-demo.mjs
 *   node --env-file=.env scripts/seed-demo-data.mjs   (careers)
 */

import { MongoClient } from "mongodb";
import { randomBytes, randomUUID, scryptSync } from "node:crypto";

const PASSWORD = "Portal@2026";
const SCRYPT_KEYLEN = 64;

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

function normalizePhone(raw) {
  const digits = String(raw ?? "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

const WORKFLOWS = {
  job_applicant: ["new_lead", "contacted", "shortlisted", "interview_scheduled"],
  intern: ["new", "contacted", "enrolled", "batch_assigned"],
  trainee: ["new", "enrolled", "batch_assigned", "classes_running"],
  client: ["new_inquiry", "requirement_discussion", "proposal_shared"],
};
const SOURCE_BY_ROLE = {
  job_applicant: "job_portal",
  intern: "internship",
  trainee: "industrial_training",
  client: "client_inquiry",
};

async function upsertAccount(db, { email, phone, role, link, displayName }) {
  const users = db.collection("external_users");
  const leadRecords = db.collection("lead_records");
  const timeline = db.collection("lead_timeline");
  const counters = db.collection("portal_counters");
  const now = new Date();
  const lower = email.toLowerCase();
  const existing = await users.findOne({ email: lower });

  // one demo lead per account, part-way through its workflow
  const stages = WORKFLOWS[role];
  const stage = stages[stages.length - 1];
  let leadId = existing?.leadId;
  if (!leadId) {
    leadId = randomUUID();
    const seq = await counters.findOneAndUpdate(
      { _id: "lead_record_code" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );
    const code = `LEAD-${now.getFullYear()}-${String((seq?.seq ?? seq?.value?.seq) ?? 1).padStart(4, "0")}`;
    await leadRecords.insertOne({
      _id: leadId,
      code,
      type: role,
      source: SOURCE_BY_ROLE[role],
      name: displayName,
      email: lower,
      phone,
      subService: null,
      message: null,
      stage,
      stageEnteredAt: now,
      status: "open",
      externalUserId: existing?._id ?? "pending",
      ownerStaffId: null,
      sourceRef: null,
      applicationId: link.applicationId ?? null,
      offerId: null,
      studentId: link.studentId ?? null,
      clientId: link.clientId ?? null,
      projectId: null,
      createdAt: now,
      updatedAt: now,
      createdBy: null,
      updatedBy: null,
      deletedAt: null,
    });
    await timeline.insertMany(
      ["account_created", "lead_submitted", ...stages.slice(1).map(() => "stage_changed")].map((kind, i) => ({
        _id: randomUUID(),
        leadId,
        kind,
        title:
          kind === "account_created" ? "Portal account created" : kind === "lead_submitted" ? "Request submitted" : `Stage: ${stages[i - 1] ?? stage}`,
        detail: null,
        actor: "system",
        actorId: null,
        visibleToLead: true,
        createdAt: new Date(now.getTime() - (stages.length - i) * 86400000),
      }))
    );
  }

  const base = {
    email: lower,
    phone,
    passwordHash: hashPassword(PASSWORD),
    role,
    applicationId: link.applicationId ?? null,
    studentId: link.studentId ?? null,
    clientId: link.clientId ?? null,
    leadId,
    activeLeadId: leadId,
    displayName,
    status: "active",
    failedLoginAttempts: 0,
    lockedUntil: null,
    mustChangePassword: false,
    updatedAt: now,
  };
  if (existing) {
    await users.updateOne({ _id: existing._id }, { $set: base });
    await leadRecords.updateOne({ _id: leadId }, { $set: { externalUserId: existing._id } });
    return { created: false };
  }
  const _id = randomUUID();
  await users.insertOne({ _id, ...base, createdAt: now, lastLoginAt: null });
  await leadRecords.updateOne({ _id: leadId }, { $set: { externalUserId: _id } });
  return { created: true };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Run: node --env-file=.env scripts/seed-portal-demo.mjs");
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const results = [];

  // --- job applicant ---------------------------------------------------------
  const application = await db.collection("career_applications").findOne({}, { sort: { createdAt: -1 } });
  if (application) {
    await upsertAccount(db, {
      email: application.email,
      phone: application.phone || "9000000001",
      role: "job_applicant",
      link: { applicationId: String(application._id) },
      displayName: application.name,
    });
    results.push({ role: "Job Applicant", email: application.email, phone: normalizePhone(application.phone || "9000000001") });
  } else {
    console.warn("! No career_applications found — skipping applicant account.");
  }

  // --- intern + trainee ----------------------------------------------------
  const enrollments = await db.collection("student_enrollments").find({ deletedAt: null }).toArray();
  const programs = await db.collection("training_programs").find({}).toArray();
  const catByProgram = new Map(programs.map((p) => [p._id, p.category]));
  const seenRoles = new Set();
  for (const enr of enrollments) {
    const role = catByProgram.get(enr.programId) === "internship" ? "intern" : "trainee";
    if (seenRoles.has(role)) continue;
    const student = await db.collection("training_students").findOne({ _id: enr.studentId, deletedAt: null });
    if (!student || !student.email) continue;
    seenRoles.add(role);
    await upsertAccount(db, {
      email: student.email,
      phone: student.mobile || "9000000002",
      role,
      link: { studentId: student._id },
      displayName: student.fullName,
    });
    results.push({ role: role === "intern" ? "Intern" : "Trainee (Industrial)", email: student.email, phone: normalizePhone(student.mobile || "9000000002") });
  }
  if (seenRoles.size === 0) console.warn("! No training_students with enrollments found — skipping learner accounts.");

  // --- client -------------------------------------------------------------
  const clientRec = await db.collection("pms_clients").findOne({ deletedAt: null, "primaryContact.email": { $ne: null } });
  if (clientRec?.primaryContact?.email) {
    await upsertAccount(db, {
      email: clientRec.primaryContact.email,
      phone: clientRec.primaryContact.phone || "9000000003",
      role: "client",
      link: { clientId: clientRec._id },
      displayName: clientRec.primaryContact.name || clientRec.companyName,
    });
    results.push({ role: "Client", email: clientRec.primaryContact.email, phone: normalizePhone(clientRec.primaryContact.phone || "9000000003") });
  } else {
    console.warn("! No pms_clients with a primary contact email — skipping client account.");
  }

  await client.close();

  console.log("\n  External Portal demo accounts  (sign in at /portal/login)\n");
  console.log(`  Password for all: ${PASSWORD}\n`);
  for (const r of results) {
    console.log(`  ${r.role.padEnd(22)} ${r.email}   (phone ${r.phone})`);
  }
  console.log("\n  Registration/reset uses email + phone as the identity check.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
