#!/usr/bin/env node
// HRMS employee seeder — creates one HRMS employee per person on the public
// "Our Team" page (src/app/(site)/about/our-team/team.ts), plus the departments,
// designations and reporting hierarchy they need to be valid records.
//
// Run with:  npm run hrms:seed-team   (== node --env-file=.env scripts/seed-hrms-employees.mjs)
//
// Idempotent: employees are matched by work email, departments by name,
// designations by (title, department). Re-running refreshes their profile
// fields without creating duplicates or burning new employee codes.
//
// Only seeds employee + master data. It does NOT create payroll profiles,
// bank accounts, portal logins, attendance or leave.

import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";

// The team page uses a "[NAME_OF_CEO]" placeholder — set the real name here.
export const CEO_NAME = "Yashika Singh";

// ---------------------------------------------------------------------------
// Source data — kept in sync with src/app/(site)/about/our-team/team.ts
// ---------------------------------------------------------------------------

export const rawTeam = [
  { name: CEO_NAME, role: "Co-Founder & CEO", department: "Leadership", gender: "female" },
  { name: "Priyanka Singh", role: "Co-Founder & COO", department: "Leadership", gender: "female" },
  { name: "Tej Pratap Singh", role: "Chief Technology Officer", department: "Leadership", gender: "male" },
  { name: "Shikha Singh", role: "Chief Financial Officer", department: "Leadership", gender: "female" },
  { name: "Pooja Singh", role: "Chief Human Resources Officer", department: "Leadership", gender: "female" },
  { name: "Arjun Mehta", role: "Technical Lead Engineer", department: "Engineering", gender: "male" },
  { name: "Ananya Sharma", role: "MERN Developer", department: "Engineering", gender: "female" },
  { name: "Karan Kulkarni", role: "Android App Developer", department: "Engineering", gender: "male" },
  { name: "Kavya Nair", role: "iOS App Developer", department: "Engineering", gender: "female" },
  { name: "Divya Reddy", role: "Desktop App Developer", department: "Engineering", gender: "female" },
  { name: "Meera Joshi", role: "Software Tester (QA)", department: "Engineering", gender: "female" },
  { name: "Ritika Verma", role: "GenAI Engineer", department: "AI & Data", gender: "female" },
  { name: "Sneha Iyer", role: "AI/ML Engineer", department: "AI & Data", gender: "female" },
  { name: "Aditi Kapoor", role: "UI/UX Designer", department: "Design", gender: "female" },
  { name: "Rohan Malhotra", role: "Business Development Manager", department: "Business & Growth", gender: "male" },
  { name: "Nisha Agarwal", role: "Business Analyst", department: "Business & Growth", gender: "female" },
  { name: "Swati Bansal", role: "Bid Executive", department: "Business & Growth", gender: "female" },
  { name: "Rashmi Pillai", role: "Account Manager", department: "Business & Growth", gender: "female" },
  { name: "Vikram Rao", role: "Project Manager", department: "Operations", gender: "male" },
  { name: "Neha Chatterjee", role: "MIS Executive", department: "Operations", gender: "female" },
  { name: "Pallavi Desai", role: "HR Executive", department: "People", gender: "female" },
];

export const DEPARTMENT_CODES = {
  Leadership: "LEAD",
  Engineering: "ENG",
  "AI & Data": "AID",
  Design: "DSGN",
  "Business & Growth": "BIZ",
  Operations: "OPS",
  People: "PPL",
};

// Who reports to whom, by name. Anyone not listed → their department head.
export const REPORTS_TO = {
  "Priyanka Singh": CEO_NAME,
  "Tej Pratap Singh": CEO_NAME,
  "Shikha Singh": CEO_NAME,
  "Pooja Singh": CEO_NAME,
  "Arjun Mehta": "Tej Pratap Singh",
  "Ananya Sharma": "Arjun Mehta",
  "Karan Kulkarni": "Arjun Mehta",
  "Kavya Nair": "Arjun Mehta",
  "Divya Reddy": "Arjun Mehta",
  "Meera Joshi": "Arjun Mehta",
  "Ritika Verma": "Tej Pratap Singh",
  "Sneha Iyer": "Tej Pratap Singh",
  "Aditi Kapoor": "Priyanka Singh",
  "Rohan Malhotra": "Priyanka Singh",
  "Nisha Agarwal": "Rohan Malhotra",
  "Swati Bansal": "Rohan Malhotra",
  "Rashmi Pillai": "Rohan Malhotra",
  "Vikram Rao": "Priyanka Singh",
  "Neha Chatterjee": "Vikram Rao",
  "Pallavi Desai": "Pooja Singh",
};

export const DEPARTMENT_HEADS = {
  Leadership: CEO_NAME,
  Engineering: "Arjun Mehta",
  "AI & Data": "Tej Pratap Singh",
  Design: "Aditi Kapoor",
  "Business & Growth": "Rohan Malhotra",
  Operations: "Vikram Rao",
  People: "Pooja Singh",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CITY = "Noida";
const STATE = "Uttar Pradesh";
const DOMAIN = "yashorbit.com";

export function slugName(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .trim()
    .split(/\s+/)
    .join(".");
}

export function splitName(name) {
  const parts = name.trim().split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") || parts[0] };
}

export function workEmailFor(name) {
  return `${slugName(name)}@${DOMAIN}`;
}

function levelFor(role) {
  if (/co-?founder|chief|ceo|coo|cto|cfo|chro/i.test(role)) return "C-Suite";
  if (/lead/i.test(role)) return "Lead";
  if (/manager/i.test(role)) return "Manager";
  return "Individual Contributor";
}

// Deterministic pseudo-random per name so re-runs produce the same DOB / phone.
function hashInt(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function dobFor(name, isLeadership) {
  const h = hashInt(name);
  const year = isLeadership ? 1980 + (h % 9) : 1990 + (h % 10); // leaders 1980-88, others 1990-99
  const month = 1 + ((h >> 4) % 12);
  const day = 1 + ((h >> 8) % 28);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function joiningFor(name, department) {
  const h = hashInt(name);
  if (department === "Leadership") {
    const year = /Co-Founder/i.test(name) ? 2019 : 2019 + (h % 3); // 2019-2021
    return `${year}-04-01`;
  }
  const year = 2022 + (h % 3); // 2022-2024
  const month = 1 + ((h >> 4) % 12);
  return `${year}-${String(month).padStart(2, "0")}-10`;
}

function phoneFor(name) {
  const nine = String(hashInt(name)).padStart(9, "0").slice(0, 9);
  return `+91 9${nine.slice(0, 4)} ${nine.slice(4)}`;
}

function stamp(now, by) {
  return { createdAt: now, updatedAt: now, createdBy: by, updatedBy: by, deletedAt: null };
}

// ---------------------------------------------------------------------------
// Seeder (reusable — also called by scripts/seed-hrms-demo.mjs)
// ---------------------------------------------------------------------------

/**
 * Seeds the 7 departments, one designation per role, the 21 employees, the
 * reporting hierarchy and department heads. Returns lookup maps keyed by name.
 */
export async function seedTeam(db, { now = new Date(), actor = "seed:team", quiet = false } = {}) {
  const ACTOR = actor;

  const employees = db.collection("hrms_employees");
  const departments = db.collection("hrms_departments");
  const designations = db.collection("hrms_designations");
  const hierarchy = db.collection("hrms_reporting_hierarchy");
  const counters = db.collection("hrms_counters");

  await Promise.all([
    employees.createIndex({ workEmail: 1 }, { unique: true }).catch(() => {}),
    employees.createIndex({ employeeCode: 1 }, { unique: true }).catch(() => {}),
  ]);

  // -- 1. Departments -------------------------------------------------------
  const deptIdByName = {};
  for (const [name, code] of Object.entries(DEPARTMENT_CODES)) {
    const existing = await departments.findOne({ name, deletedAt: null });
    if (existing) {
      deptIdByName[name] = existing._id;
      continue;
    }
    const _id = randomUUID();
    await departments.insertOne({
      _id,
      name,
      code,
      description: `${name} team`,
      headEmployeeId: null,
      ...stamp(now, ACTOR),
    });
    deptIdByName[name] = _id;
  }

  // -- 2. Designations ----------------------------------------------------
  const desigIdByKey = {};
  for (const m of rawTeam) {
    const departmentId = deptIdByName[m.department];
    const key = `${m.role}::${departmentId}`;
    if (desigIdByKey[key]) continue;
    const existing = await designations.findOne({ title: m.role, departmentId, deletedAt: null });
    if (existing) {
      desigIdByKey[key] = existing._id;
      continue;
    }
    const _id = randomUUID();
    await designations.insertOne({
      _id,
      title: m.role,
      departmentId,
      level: levelFor(m.role),
      ...stamp(now, ACTOR),
    });
    desigIdByKey[key] = _id;
  }

  // -- 3. Employees (two passes: create, then link managers) --------------
  const empIdByName = {};
  let created = 0;
  let updated = 0;

  for (const m of rawTeam) {
    const { firstName, lastName } = splitName(m.name);
    const workEmail = `${slugName(m.name)}@${DOMAIN}`;
    const departmentId = deptIdByName[m.department];
    const designationId = desigIdByKey[`${m.role}::${departmentId}`];
    const isLeadership = m.department === "Leadership";

    const professional = {
      departmentId,
      designationId,
      teamId: null,
      reportingManagerId: null, // linked in pass 2
      employmentType: "full_time",
      workLocation: "onsite",
      joiningDate: joiningFor(m.name, m.department),
      probationEndDate: null,
      relievingDate: null,
    };
    const personal = {
      dateOfBirth: dobFor(m.name, isLeadership),
      gender: m.gender,
      maritalStatus: null,
      personalEmail: null,
      phone: phoneFor(m.name),
      addressLine: null,
      city: CITY,
      state: STATE,
      postalCode: "201309",
      photoKey: null,
    };

    const existing = await employees.findOne({ workEmail });
    if (existing) {
      empIdByName[m.name] = existing._id;
      await employees.updateOne(
        { _id: existing._id },
        {
          $set: {
            firstName,
            lastName,
            status: "active",
            personal,
            "professional.departmentId": departmentId,
            "professional.designationId": designationId,
            "professional.employmentType": "full_time",
            "professional.workLocation": "onsite",
            "professional.joiningDate": professional.joiningDate,
            updatedAt: now,
            updatedBy: ACTOR,
          },
        }
      );
      updated += 1;
      continue;
    }

    const seq = (await counters.findOneAndUpdate(
      { _id: "employee_code" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    ))?.seq ?? 1;
    const employeeCode = `YO-${String(seq).padStart(4, "0")}`;

    const _id = randomUUID();
    await employees.insertOne({
      _id,
      employeeCode,
      firstName,
      lastName,
      workEmail,
      status: "active",
      personal,
      professional,
      emergencyContacts: [],
      recruitment: null,
      adminUserId: null,
      ...stamp(now, ACTOR),
    });
    empIdByName[m.name] = _id;
    created += 1;
  }

  // -- 4. Reporting managers + department heads --------------------------
  for (const m of rawTeam) {
    const managerName = REPORTS_TO[m.name] ?? DEPARTMENT_HEADS[m.department];
    const managerId = managerName && managerName !== m.name ? empIdByName[managerName] ?? null : null;
    await employees.updateOne(
      { _id: empIdByName[m.name] },
      { $set: { "professional.reportingManagerId": managerId, updatedAt: now, updatedBy: ACTOR } }
    );
  }
  for (const [deptName, headName] of Object.entries(DEPARTMENT_HEADS)) {
    if (empIdByName[headName]) {
      await departments.updateOne({ _id: deptIdByName[deptName] }, { $set: { headEmployeeId: empIdByName[headName], updatedAt: now } });
    }
  }

  // -- 5. Reporting-hierarchy closure table -----------------------------
  await hierarchy.deleteMany({ employeeId: { $in: Object.values(empIdByName) } });
  const closureRows = [];
  for (const m of rawTeam) {
    const employeeId = empIdByName[m.name];
    let chainName = REPORTS_TO[m.name] ?? (DEPARTMENT_HEADS[m.department] === m.name ? null : DEPARTMENT_HEADS[m.department]);
    let depth = 1;
    const seen = new Set([m.name]);
    while (chainName && !seen.has(chainName) && empIdByName[chainName]) {
      seen.add(chainName);
      closureRows.push({
        _id: `${employeeId}:${empIdByName[chainName]}`,
        employeeId,
        managerId: empIdByName[chainName],
        depth,
        updatedAt: now,
      });
      depth += 1;
      chainName = REPORTS_TO[chainName] ?? null;
    }
  }
  if (closureRows.length > 0) await hierarchy.insertMany(closureRows, { ordered: false }).catch(() => {});

  if (!quiet) {
    console.log(`\nDepartments ensured: ${Object.keys(DEPARTMENT_CODES).length}`);
    console.log(`Designations ensured: ${Object.keys(desigIdByKey).length}`);
    console.log(`Employees — created: ${created}, updated: ${updated}, total on team: ${rawTeam.length}`);
    console.log(`Reporting-hierarchy rows: ${closureRows.length}`);
  }

  return { deptIdByName, desigIdByKey, empIdByName, created, updated, closureRows };
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-hrms-employees.mjs");
    process.exit(1);
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db();
    await db.collection("hrms_employees").createIndex({ workEmail: 1 }, { unique: true }).catch(() => {});
    await db.collection("hrms_employees").createIndex({ employeeCode: 1 }, { unique: true }).catch(() => {});
    await seedTeam(db);
    console.log(`\nOpen /hrms/employees to see them.`);
  } finally {
    await client.close();
  }
}

// Only run as a CLI when invoked directly, not when imported.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
