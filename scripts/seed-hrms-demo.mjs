#!/usr/bin/env node
/**
 * HRMS demo seeder — a full, internally-consistent dataset that exercises every
 * HRMS feature: org structure, settings, holidays, attendance (3+ months),
 * leave (all states + balances), salary structures + effective-dated revisions,
 * payroll runs + payslips (draft / approved / paid), salary payouts (the whole
 * pipeline), encrypted bank accounts, employee portal logins, employee
 * documents (versioning + expiry), recruitment offers, HR notifications and the
 * audit trail.
 *
 * Run with:  npm run hrms:seed-demo
 *
 * NOT additive — each run WIPES the hrms_* transactional collections, the
 * seeded employees, the seeded portal logins (admin_users where
 * seededBy = "hrms-demo") and the seeded career applications
 * (source = "hrms-seed"), then rebuilds everything. It never touches leads,
 * campaigns, chatbot data or admin_users you created yourself.
 *
 * Requires HRMS_ENCRYPTION_KEY in .env (base64 32-byte key) for bank details.
 */

import { MongoClient, ObjectId } from "mongodb";
import { randomUUID, randomBytes, scryptSync, createCipheriv } from "node:crypto";
import { rmSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { seedTeam, CEO_NAME, workEmailFor } from "./seed-hrms-employees.mjs";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TODAY = "2026-09-07";
const CURRENT_MONTH = "2026-09";
const YEAR = 2026;
const PORTAL_PASSWORD = "Yashorbit@2026";
const DOCS_DIR = path.join(process.cwd(), "uploads", "hrms-documents");
const ACTOR = "seed:demo";
const HR_ACTOR_EMAIL = "pooja.singh@yashorbit.com";

const TINY_PDF =
  "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
  "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]>>endobj\nxref\n0 4\n0000000000 65535 f \n" +
  "trailer<</Root 1 0 R/Size 4>>\nstartxref\n149\n%%EOF\n";

// Monthly gross salary (INR) by team member.
const GROSS = {
  [CEO_NAME]: 550000,
  "Priyanka Singh": 500000,
  "Tej Pratap Singh": 420000,
  "Shikha Singh": 400000,
  "Pooja Singh": 380000,
  "Arjun Mehta": 185000,
  "Ananya Sharma": 98000,
  "Karan Kulkarni": 95000,
  "Kavya Nair": 96000,
  "Divya Reddy": 92000,
  "Meera Joshi": 72000,
  "Ritika Verma": 135000,
  "Sneha Iyer": 128000,
  "Aditi Kapoor": 88000,
  "Rohan Malhotra": 145000,
  "Nisha Agarwal": 78000,
  "Swati Bansal": 19500, // below the ESI gross threshold — exercises the ESI path
  "Rashmi Pillai": 82000,
  "Vikram Rao": 150000,
  "Neha Chatterjee": 46000,
  "Pallavi Desai": 58000,
};

// Raise effective 2026-07-01 — June payslips use the baseline, July+ the revision.
const RAISES = {
  "Ananya Sharma": 112000,
  "Ritika Verma": 155000,
  "Meera Joshi": 82000,
  "Rashmi Pillai": 92000,
};

// Staff roles layered onto the employee portal login (dual-role accounts).
const STAFF_ROLES = {
  [CEO_NAME]: ["super_admin"],
  "Pooja Singh": ["hr"],
  "Tej Pratap Singh": ["manager"],
  "Arjun Mehta": ["manager"],
  "Rohan Malhotra": ["manager"],
  "Vikram Rao": ["manager"],
};
const READY_LOGINS = new Set([CEO_NAME, "Pooja Singh", "Tej Pratap Singh", "Arjun Mehta", "Rohan Malhotra", "Vikram Rao", "Ananya Sharma", "Karan Kulkarni", "Kavya Nair"]);

const HOLIDAYS_2026 = [
  { date: "2026-01-26", name: "Republic Day", type: "public" },
  { date: "2026-03-06", name: "Holi", type: "public" },
  { date: "2026-03-21", name: "Holi (Optional)", type: "optional" },
  { date: "2026-04-03", name: "Good Friday", type: "public" },
  { date: "2026-05-01", name: "May Day", type: "public" },
  { date: "2026-06-17", name: "Bakrid / Eid al-Adha", type: "public" },
  { date: "2026-07-29", name: "Muharram", type: "optional" },
  { date: "2026-08-15", name: "Independence Day", type: "public" },
  { date: "2026-08-28", name: "Raksha Bandhan", type: "company" },
  { date: "2026-09-14", name: "Ganesh Chaturthi", type: "public" },
  { date: "2026-10-02", name: "Gandhi Jayanti", type: "public" },
  { date: "2026-10-20", name: "Dussehra", type: "public" },
  { date: "2026-11-08", name: "Diwali", type: "public" },
  { date: "2026-11-09", name: "Govardhan Puja", type: "company" },
  { date: "2026-12-25", name: "Christmas", type: "public" },
];

const BANKS = [
  { name: "HDFC Bank", ifsc: "HDFC0001234", branch: "Sector 62, Noida" },
  { name: "ICICI Bank", ifsc: "ICIC0004567", branch: "Sector 18, Noida" },
  { name: "Axis Bank", ifsc: "UTIB0000789", branch: "Film City, Noida" },
  { name: "State Bank of India", ifsc: "SBIN0009012", branch: "Sector 63, Noida" },
  { name: "Kotak Mahindra Bank", ifsc: "KKBK0003456", branch: "Sector 16, Noida" },
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function stamp(d, by = ACTOR) {
  return { createdAt: d, updatedAt: d, createdBy: by, updatedBy: by, deletedAt: null };
}
function daysAgo(n) {
  return new Date(Date.parse(`${TODAY}T10:00:00Z`) - n * 86400000);
}
function dateAt(dateStr, h = 10) {
  return new Date(`${dateStr}T${String(h).padStart(2, "0")}:00:00Z`);
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function minToHHmm(t) {
  return `${pad2(Math.floor(t / 60))}:${pad2(t % 60)}`;
}
function eachDate(from, to) {
  const out = [];
  let t = Date.parse(`${from}T12:00:00Z`);
  const end = Date.parse(`${to}T12:00:00Z`);
  for (; t <= end; t += 86400000) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}
function dow(dateStr) {
  return new Date(`${dateStr}T12:00:00Z`).getUTCDay();
}
function monthLastDay(month) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function strSeed(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// AES-256-GCM field encryption — mirrors src/lib/hrms/crypto.ts exactly.
function makeEncryptor() {
  const raw = process.env.HRMS_ENCRYPTION_KEY;
  if (!raw) throw new Error("HRMS_ENCRYPTION_KEY is not set. Add it to .env (openssl rand -base64 32).");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("HRMS_ENCRYPTION_KEY must decode to 32 bytes.");
  return function encryptField(plain) {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ct = Buffer.concat([cipher.update(String(plain), "utf8"), cipher.final()]);
    return { c: ct.toString("base64"), iv: iv.toString("base64"), t: cipher.getAuthTag().toString("base64") };
  };
}
function last4Of(v) {
  const d = String(v).replace(/\s+/g, "");
  return d.length <= 4 ? d : d.slice(-4);
}
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

// ---------------------------------------------------------------------------
// India payroll math — mirrors payroll-tax.ts + computePayslipFor
// ---------------------------------------------------------------------------

const TAX_SLABS = [
  [400000, 0],
  [800000, 0.05],
  [1200000, 0.1],
  [1600000, 0.15],
  [2000000, 0.2],
  [2400000, 0.25],
  [Infinity, 0.3],
];
function annualTax(taxableAfterStd) {
  const taxable = Math.max(0, Math.round(taxableAfterStd));
  if (taxable <= 1200000) return 0; // 87A rebate
  let tax = 0;
  let lower = 0;
  for (const [upTo, rate] of TAX_SLABS) {
    if (taxable <= lower) break;
    tax += (Math.min(taxable, upTo) - lower) * rate;
    lower = upTo;
  }
  return Math.round(tax * 1.04); // 4% cess
}
function monthlyTds(projectedAnnualGross, ytd, monthsRemaining) {
  if (monthsRemaining <= 0) return 0;
  const annual = annualTax(Math.max(0, projectedAnnualGross - 75000));
  return Math.round(Math.max(0, annual - Math.max(0, ytd)) / monthsRemaining);
}
function monthsRemainingInFY(month) {
  const m = Number(month.slice(5, 7));
  return 12 - ((m - 4 + 12) % 12);
}

function structureFor(gross) {
  const basic = Math.round((gross * 0.4) / 100) * 100;
  const hra = Math.round((gross * 0.2) / 100) * 100;
  return {
    basic,
    hra,
    allowances: [{ name: "Special Allowance", amount: gross - basic - hra }],
    deductions: [],
  };
}

function computeSlip({ emp, runId, month, structure, workingDays, lopDays, tdsYtd, arrears, otherDeductions, bank }) {
  const structGross = structure.basic + structure.hra + structure.allowances.reduce((s, a) => s + a.amount, 0);
  const perDay = workingDays > 0 ? structGross / workingDays : 0;
  const lopAmount = Math.round(perDay * lopDays);

  const earnings = [
    { name: "Basic", amount: structure.basic },
    { name: "HRA", amount: structure.hra },
    ...structure.allowances.map((a) => ({ name: a.name, amount: a.amount })),
  ];
  if (arrears > 0) earnings.push({ name: "Arrears", amount: arrears });
  const grossPay = earnings.reduce((s, e) => s + e.amount, 0);

  const pfBase = Math.min(structure.basic, 15000);
  const pfEmployee = Math.round((pfBase * 12) / 100);
  const eps = Math.round((pfBase * 8.33) / 100);
  const epf = Math.max(0, Math.round((pfBase * 12) / 100) - eps);

  const esiApplies = grossPay <= 21000;
  const esiEmployee = esiApplies ? Math.round((grossPay * 0.75) / 100) : 0;
  const esiEmployer = esiApplies ? Math.round((grossPay * 3.25) / 100) : 0;
  const pt = grossPay > 0 ? 200 : 0;
  const tds = monthlyTds(grossPay * 12, tdsYtd, monthsRemainingInFY(month));

  const deductions = [
    { name: "Provident Fund", amount: pfEmployee },
    ...(esiEmployee > 0 ? [{ name: "ESI", amount: esiEmployee }] : []),
    ...(pt > 0 ? [{ name: "Professional Tax", amount: pt }] : []),
    ...(tds > 0 ? [{ name: "TDS", amount: tds }] : []),
    ...structure.deductions.map((d) => ({ name: d.name, amount: d.amount })),
    ...(lopAmount > 0 ? [{ name: "Loss of Pay", amount: lopAmount }] : []),
    ...(otherDeductions > 0 ? [{ name: "Other Deductions", amount: otherDeductions }] : []),
  ];
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const employerContributions = [
    { name: "Employer PF", amount: epf },
    { name: "Employer EPS", amount: eps },
    ...(esiEmployer > 0 ? [{ name: "Employer ESI", amount: esiEmployer }] : []),
  ];
  const employerCost = grossPay + employerContributions.reduce((s, c) => s + c.amount, 0);
  const netPay = Math.max(0, grossPay - totalDeductions);

  const payslip = {
    _id: randomUUID(),
    runId,
    month,
    employeeId: emp._id,
    employeeCode: emp.employeeCode,
    employeeName: `${emp.firstName} ${emp.lastName}`.trim(),
    workingDays,
    lopDays,
    lopAmount,
    earnings,
    grossPay,
    deductions,
    totalDeductions,
    employerContributions,
    employerCost,
    netPay,
    overrides: { arrears: arrears || 0, manualTds: null, otherDeductions: otherDeductions || 0 },
    bankAccountId: bank?._id ?? null,
    bankAccountLast4: bank?.accountNumberLast4 ?? null,
    bankName: bank?.bankName ?? null,
    ifsc: bank?.ifsc ?? null,
    updatedAt: new Date(),
  };
  return { payslip, tds };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI. Run: npm run hrms:seed-demo");
    process.exit(1);
  }
  const encryptField = makeEncryptor();

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db();
    const now = new Date();

    // -- 0. Wipe -----------------------------------------------------------
    const WIPE = [
      "hrms_employees", "hrms_departments", "hrms_designations", "hrms_teams", "hrms_counters",
      "hrms_reporting_hierarchy", "hrms_payroll_profiles", "hrms_salary_revisions",
      "hrms_payroll_runs", "hrms_payslips", "hrms_salary_payouts", "hrms_bank_accounts",
      "hrms_attendance", "hrms_attendance_logs", "hrms_leave_types", "hrms_leave_balances",
      "hrms_leave_requests", "hrms_holidays", "hrms_settings", "hrms_payroll_config",
      "hrms_notifications", "hrms_meta", "hrms_audit_logs", "hrms_employee_documents", "hrms_offers",
    ];
    for (const c of WIPE) await db.collection(c).deleteMany({});
    await db.collection("career_applications").deleteMany({ source: "hrms-seed" });
    const oldLogins = await db.collection("admin_users").find({ seededBy: "hrms-demo" }).toArray();
    await db.collection("admin_users").deleteMany({ seededBy: "hrms-demo" });
    for (const l of oldLogins) await db.collection("hrms_sessions").deleteMany({ adminId: l._id });
    rmSync(DOCS_DIR, { recursive: true, force: true });
    mkdirSync(DOCS_DIR, { recursive: true });
    console.log("Wiped HRMS collections + seeded logins/applications/documents.");

    // -- 1. Team (departments, designations, employees, hierarchy) --------
    await db.collection("hrms_employees").createIndex({ workEmail: 1 }, { unique: true }).catch(() => {});
    await db.collection("hrms_employees").createIndex({ employeeCode: 1 }, { unique: true }).catch(() => {});
    const { deptIdByName, empIdByName } = await seedTeam(db, { now, actor: ACTOR, quiet: true });

    // -- 2. Employee profile touch-ups (status variety, birthday, joiners)
    const employees = db.collection("hrms_employees");
    await employees.updateOne(
      { _id: empIdByName["Divya Reddy"] },
      { $set: { status: "probation", "professional.joiningDate": "2026-07-01", "professional.probationEndDate": "2026-09-10", updatedAt: now } }
    );
    await employees.updateOne(
      { _id: empIdByName["Swati Bansal"] },
      { $set: { status: "notice_period", "professional.relievingDate": "2026-10-15", updatedAt: now } }
    );
    await employees.updateOne(
      { _id: empIdByName["Meera Joshi"] },
      { $set: { "personal.dateOfBirth": "1994-09-07", updatedAt: now } } // birthday today
    );
    for (const [name, contacts] of [
      ["Ananya Sharma", [{ name: "Rohit Sharma", relationship: "Spouse", phone: "+91 98111 20034" }]],
      ["Arjun Mehta", [{ name: "Sunita Mehta", relationship: "Mother", phone: "+91 98730 55510" }]],
      ["Kavya Nair", [{ name: "Deepa Nair", relationship: "Sister", phone: "+91 99456 71122" }]],
    ]) {
      await employees.updateOne({ _id: empIdByName[name] }, { $set: { emergencyContacts: contacts, updatedAt: now } });
    }

    const empDocs = await employees.find({}).toArray();
    const empByName = new Map(empDocs.map((e) => [`${e.firstName} ${e.lastName}`.trim(), e]));
    const nameById = new Map(empDocs.map((e) => [e._id, `${e.firstName} ${e.lastName}`.trim()]));
    const E = (name) => empByName.get(name);

    // -- 3. Org settings + payroll config --------------------------------
    await db.collection("hrms_settings").updateOne(
      { _id: "org" },
      {
        $set: {
          workingDays: [1, 2, 3, 4, 5],
          shiftStart: "09:30",
          shiftEnd: "18:30",
          graceMinutes: 15,
          earlyDepartureMinutes: 15,
          halfDayHours: 4,
          fullDayHours: 8,
          timezone: "Asia/Kolkata",
          updatedAt: now,
          updatedBy: ACTOR,
        },
      },
      { upsert: true }
    );
    await db.collection("hrms_payroll_config").updateOne(
      { _id: "org" },
      {
        $set: {
          pfEmployeePercent: 12, pfWageCeiling: 15000, epsPercent: 8.33, pfEmployerPercent: 12,
          esiEmployeePercent: 0.75, esiEmployerPercent: 3.25, esiGrossThreshold: 21000,
          professionalTaxMonthly: 200, tdsRegime: "new", financialYearStartMonth: 4,
          updatedAt: now, updatedBy: ACTOR,
        },
      },
      { upsert: true }
    );

    // -- 4. Holidays -----------------------------------------------------
    const holidaySet = new Set(HOLIDAYS_2026.map((h) => h.date));
    await db.collection("hrms_holidays").insertMany(
      HOLIDAYS_2026.map((h) => ({
        _id: randomUUID(),
        date: h.date,
        year: Number(h.date.slice(0, 4)),
        name: h.name,
        type: h.type,
        ...stamp(daysAgo(120)),
      }))
    );
    const isWorking = (ds) => {
      const w = dow(ds);
      return w >= 1 && w <= 5 && !holidaySet.has(ds);
    };
    const workingDaysInMonth = (month) => {
      let c = 0;
      for (let d = 1; d <= monthLastDay(month); d++) if (isWorking(`${month}-${pad2(d)}`)) c++;
      return c;
    };

    // -- 5. Teams ------------------------------------------------------
    const teams = [
      { name: "Web Platform", dept: "Engineering", lead: "Arjun Mehta" },
      { name: "Mobile Apps", dept: "Engineering", lead: "Karan Kulkarni" },
      { name: "Applied AI", dept: "AI & Data", lead: "Ritika Verma" },
      { name: "Delivery", dept: "Operations", lead: "Vikram Rao" },
      { name: "Sales & Accounts", dept: "Business & Growth", lead: "Rohan Malhotra" },
    ];
    await db.collection("hrms_teams").insertMany(
      teams.map((t) => ({
        _id: randomUUID(),
        name: t.name,
        departmentId: deptIdByName[t.dept],
        leadEmployeeId: E(t.lead)._id,
        ...stamp(daysAgo(200)),
      }))
    );

    // -- 6. Leave types ------------------------------------------------
    const LEAVE_TYPES = [
      { code: "casual", label: "Casual Leave", paid: true, defaultAnnualQuota: 12, allowNegativeBalance: false, colorClass: "bg-primary/15 text-primary", active: true },
      { code: "sick", label: "Sick Leave", paid: true, defaultAnnualQuota: 12, allowNegativeBalance: false, colorClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400", active: true },
      { code: "earned", label: "Earned Leave", paid: true, defaultAnnualQuota: 15, allowNegativeBalance: false, colorClass: "bg-green-500/15 text-green-600 dark:text-green-400", active: true },
      { code: "wfh", label: "Work From Home", paid: true, defaultAnnualQuota: 0, allowNegativeBalance: true, colorClass: "bg-secondary/60 text-secondary-foreground", active: true },
      { code: "unpaid", label: "Unpaid Leave", paid: false, defaultAnnualQuota: 0, allowNegativeBalance: true, colorClass: "bg-muted text-muted-foreground", active: true },
    ];
    const paidByCode = new Map(LEAVE_TYPES.map((t) => [t.code, t.paid]));
    await db.collection("hrms_leave_types").insertMany(LEAVE_TYPES.map((t) => ({ _id: randomUUID(), ...t, ...stamp(daysAgo(220), null) })));

    // -- 7. Leave requests ------------------------------------------------
    const workingDaysBetween = (from, to, hs, he) => {
      let d = 0;
      for (const ds of eachDate(from, to)) if (isWorking(ds)) d++;
      if (d === 0) return 0;
      if (hs && isWorking(from)) d -= 0.5;
      if (he && from !== to && isWorking(to)) d -= 0.5;
      return Math.max(0, d);
    };
    const LEAVE_REQS = [
      { emp: "Ananya Sharma", code: "casual", from: "2026-06-12", to: "2026-06-12", status: "approved", reason: "Personal work." },
      { emp: "Karan Kulkarni", code: "sick", from: "2026-07-06", to: "2026-07-07", status: "approved", reason: "Viral fever." },
      { emp: "Rashmi Pillai", code: "earned", from: "2026-07-20", to: "2026-07-24", status: "approved", reason: "Family vacation." },
      { emp: "Nisha Agarwal", code: "casual", from: "2026-08-10", to: "2026-08-11", status: "approved", reason: "House shifting." },
      { emp: "Sneha Iyer", code: "sick", from: "2026-08-18", to: "2026-08-18", status: "approved", reason: "Migraine." },
      { emp: "Divya Reddy", code: "wfh", from: "2026-08-19", to: "2026-08-20", status: "approved", reason: "Plumber visit / WFH." },
      { emp: "Meera Joshi", code: "unpaid", from: "2026-08-24", to: "2026-08-25", status: "approved", reason: "Out of leave balance — unpaid." },
      { emp: "Kavya Nair", code: "earned", from: "2026-09-21", to: "2026-09-25", status: "pending", reason: "Trip to Kerala." },
      { emp: "Arjun Mehta", code: "casual", from: "2026-10-01", to: "2026-10-02", status: "pending", reason: "Extended weekend." },
      { emp: "Vikram Rao", code: "earned", from: "2026-09-28", to: "2026-09-30", status: "pending", reason: "Personal." },
      { emp: "Swati Bansal", code: "casual", from: "2026-09-15", to: "2026-09-15", status: "pending", reason: "Bank work." },
      { emp: "Karan Kulkarni", code: "casual", from: "2026-09-10", to: "2026-09-12", status: "rejected", reason: "Short trip.", note: "Release week — please replan." },
      { emp: "Pallavi Desai", code: "earned", from: "2026-08-05", to: "2026-08-09", status: "rejected", reason: "Vacation.", note: "Payroll week, defer to next month." },
      { emp: "Rohan Malhotra", code: "casual", from: "2026-07-15", to: "2026-07-16", status: "cancelled", reason: "Client visit — no longer needed." },
      { emp: "Ananya Sharma", code: "casual", from: "2026-09-08", to: "2026-09-09", status: "cancelled", reason: "Plans changed." },
    ];
    const leaveDocs = [];
    const onLeaveRows = []; // -> attendance
    const leaveTypePaidByReqId = new Map();
    const usedByEmpCode = new Map(); // `${empId}|${code}` -> days
    const pendingByEmpCode = new Map();
    for (const r of LEAVE_REQS) {
      const emp = E(r.emp);
      const days = workingDaysBetween(r.from, r.to, false, false);
      const id = randomUUID();
      const created = dateAt(r.from, 8);
      created.setUTCDate(created.getUTCDate() - 6);
      const decided = ["approved", "rejected"].includes(r.status) ? dateAt(r.from, 9) : null;
      if (decided) decided.setUTCDate(decided.getUTCDate() - 2);
      leaveDocs.push({
        _id: id,
        employeeId: emp._id,
        leaveTypeCode: r.code,
        startDate: r.from,
        endDate: r.to,
        halfDayStart: false,
        halfDayEnd: false,
        days,
        reason: r.reason,
        status: r.status,
        appliedBy: emp._id,
        decidedBy: decided ? E("Pooja Singh")._id : null,
        decidedAt: decided,
        decisionNote: r.note ?? null,
        ...stamp(created, emp._id),
      });
      leaveTypePaidByReqId.set(id, paidByCode.get(r.code));
      if (r.status === "approved") {
        usedByEmpCode.set(`${emp._id}|${r.code}`, (usedByEmpCode.get(`${emp._id}|${r.code}`) ?? 0) + days);
        for (const ds of eachDate(r.from, r.to)) {
          if (!isWorking(ds)) continue;
          onLeaveRows.push({
            _id: randomUUID(),
            employeeId: emp._id,
            date: ds,
            status: "on_leave",
            checkIn: null,
            checkOut: null,
            breakMinutes: 0,
            workedMinutes: 0,
            isLate: false,
            lateByMinutes: 0,
            isEarlyDeparture: false,
            earlyByMinutes: 0,
            source: "leave",
            leaveRequestId: id,
            note: null,
            ...stamp(decided ?? created),
          });
        }
      } else if (r.status === "pending") {
        pendingByEmpCode.set(`${emp._id}|${r.code}`, (pendingByEmpCode.get(`${emp._id}|${r.code}`) ?? 0) + days);
      }
    }
    await db.collection("hrms_leave_requests").insertMany(leaveDocs);

    // -- 8. Leave balances (year 2026) ---------------------------------
    const balanceDocs = [];
    for (const e of empDocs) {
      for (const t of LEAVE_TYPES) {
        balanceDocs.push({
          _id: randomUUID(),
          employeeId: e._id,
          leaveTypeCode: t.code,
          year: YEAR,
          allocated: t.defaultAnnualQuota,
          used: usedByEmpCode.get(`${e._id}|${t.code}`) ?? 0,
          pending: pendingByEmpCode.get(`${e._id}|${t.code}`) ?? 0,
          ...stamp(daysAgo(200), null),
        });
      }
    }
    await db.collection("hrms_leave_balances").insertMany(balanceDocs);

    // -- 9. Attendance (2026-06-01 .. today) ---------------------------
    const attendanceIndex = new Map(); // `${empId}|${date}` -> record
    for (const row of onLeaveRows) attendanceIndex.set(`${row.employeeId}|${row.date}`, row);
    const attendanceDocs = [...onLeaveRows];
    const attendanceLogs = [];

    for (const e of empDocs) {
      const joined = e.professional?.joiningDate ?? "2020-01-01";
      const start = joined > "2026-06-01" ? joined : "2026-06-01";
      for (const ds of eachDate(start, TODAY)) {
        if (!isWorking(ds)) continue;
        if (attendanceIndex.has(`${e._id}|${ds}`)) continue; // on_leave already
        const rnd = mulberry32(strSeed(e.employeeCode + "|" + ds));
        const roll = rnd();
        const isToday = ds === TODAY;

        if (!isToday && roll < 0.04) {
          const rec = {
            _id: randomUUID(),
            employeeId: e._id,
            date: ds,
            status: "absent",
            checkIn: null,
            checkOut: null,
            breakMinutes: 0,
            workedMinutes: 0,
            isLate: false,
            lateByMinutes: 0,
            isEarlyDeparture: false,
            earlyByMinutes: 0,
            source: "manual",
            leaveRequestId: null,
            note: "Unplanned absence",
            ...stamp(dateAt(ds, 20)),
          };
          attendanceDocs.push(rec);
          attendanceIndex.set(`${e._id}|${ds}`, rec);
          continue;
        }
        if (isToday && roll > 0.62) continue; // not everyone has clocked in yet today

        const ci = Math.floor(545 + rnd() * 60); // 09:05 - 10:05
        const late = Math.max(0, ci - 585); // grace threshold 09:45
        const clockedOut = !isToday || roll < 0.35;
        const co = clockedOut ? Math.floor(1100 + rnd() * 80) : null; // 18:20 - 19:40
        const brk = 30 + Math.floor(rnd() * 30);
        const worked = co ? Math.max(0, co - ci - brk) : 0;
        const early = co ? Math.max(0, 1095 - co) : 0;
        const status = !co ? "present" : worked / 60 >= 8 ? "present" : "half_day";
        const source = roll < 0.16 ? "manual" : "self";
        const rec = {
          _id: randomUUID(),
          employeeId: e._id,
          date: ds,
          status,
          checkIn: minToHHmm(ci),
          checkOut: co ? minToHHmm(co) : null,
          breakMinutes: brk,
          workedMinutes: worked,
          isLate: late > 0,
          lateByMinutes: late,
          isEarlyDeparture: early > 0,
          earlyByMinutes: early,
          source,
          leaveRequestId: null,
          note: null,
          ...stamp(dateAt(ds, co ? 19 : 10), source === "self" ? e._id : ACTOR),
        };
        attendanceDocs.push(rec);
        attendanceIndex.set(`${e._id}|${ds}`, rec);
        if (isToday) {
          attendanceLogs.push({ _id: randomUUID(), attendanceId: rec._id, employeeId: e._id, date: ds, type: "in", time: rec.checkIn, by: e._id, note: "self-service", at: dateAt(ds, 9) });
          if (co) attendanceLogs.push({ _id: randomUUID(), attendanceId: rec._id, employeeId: e._id, date: ds, type: "out", time: rec.checkOut, by: e._id, note: "self-service", at: dateAt(ds, 19) });
        }
      }
    }
    for (let i = 0; i < attendanceDocs.length; i += 500) {
      await db.collection("hrms_attendance").insertMany(attendanceDocs.slice(i, i + 500));
    }
    if (attendanceLogs.length) await db.collection("hrms_attendance_logs").insertMany(attendanceLogs);

    // -- 10. Bank accounts -------------------------------------------
    const bankByEmp = new Map(); // empId -> primary account doc
    const bankDocs = [];
    empDocs.forEach((e, i) => {
      const name = `${e.firstName} ${e.lastName}`.trim();
      const bank = BANKS[i % BANKS.length];
      const acctNum = String(4000000000000 + i * 73939 + strSeed(e.employeeCode) % 90000).slice(0, 13);
      const vStatus = i % 5 === 0 ? "pending" : i % 7 === 0 ? "failed" : "verified";
      const primary = {
        _id: randomUUID(),
        employeeId: e._id,
        accountHolderName: name,
        bankName: bank.name,
        branch: bank.branch,
        accountType: "savings",
        accountNumberEnc: encryptField(acctNum),
        accountNumberLast4: last4Of(acctNum),
        ifsc: bank.ifsc,
        upiIdEnc: i % 3 === 0 ? encryptField(`${name.split(" ")[0].toLowerCase()}@okhdfcbank`) : null,
        isPrimary: true,
        verificationStatus: vStatus,
        verifiedAt: vStatus === "verified" ? daysAgo(60 - i) : null,
        verificationNote: vStatus === "failed" ? "Name mismatch with bank records" : null,
        providerContactId: null,
        providerFundAccountId: null,
        ...stamp(daysAgo(90 - i)),
      };
      bankDocs.push(primary);
      bankByEmp.set(e._id, primary);
      // a few people keep a second (non-primary) account
      if (i % 6 === 2) {
        const b2 = BANKS[(i + 2) % BANKS.length];
        const a2 = String(5200000000000 + i * 4111).slice(0, 12);
        bankDocs.push({
          _id: randomUUID(),
          employeeId: e._id,
          accountHolderName: name,
          bankName: b2.name,
          branch: b2.branch,
          accountType: "savings",
          accountNumberEnc: encryptField(a2),
          accountNumberLast4: last4Of(a2),
          ifsc: b2.ifsc,
          upiIdEnc: null,
          isPrimary: false,
          verificationStatus: "unverified",
          verifiedAt: null,
          verificationNote: null,
          providerContactId: null,
          providerFundAccountId: null,
          ...stamp(daysAgo(20)),
        });
      }
    });
    await db.collection("hrms_bank_accounts").insertMany(bankDocs);

    // -- 11. Payroll profiles + salary revisions --------------------
    const profileDocs = [];
    const revisionDocs = [];
    let uanSeq = 100234500001;
    for (const e of empDocs) {
      const name = `${e.firstName} ${e.lastName}`.trim();
      const gross = GROSS[name] ?? 60000;
      const baseStruct = structureFor(gross);
      // A few also carry a small structure deduction line.
      if (["Ananya Sharma", "Karan Kulkarni", "Sneha Iyer", "Vikram Rao"].includes(name)) {
        baseStruct.deductions = [{ name: "Group Insurance", amount: 500 }];
      }
      profileDocs.push({
        _id: randomUUID(),
        employeeId: e._id,
        currency: "INR",
        basic: baseStruct.basic,
        hra: baseStruct.hra,
        allowances: baseStruct.allowances,
        deductions: baseStruct.deductions,
        pfNumber: `DL/CPM/${45000 + (strSeed(e.employeeCode) % 5000)}/000`,
        esiNumber: gross <= 21000 ? `31-00-${100000 + (strSeed(e.employeeCode) % 90000)}` : null,
        uan: String(uanSeq++),
        bank: { accountName: null, accountNumber: null, ifsc: null, bankName: null, branch: null },
        ...stamp(daysAgo(90)),
      });
      if (RAISES[name]) {
        const revStruct = structureFor(RAISES[name]);
        if (baseStruct.deductions.length) revStruct.deductions = baseStruct.deductions;
        revisionDocs.push({
          _id: randomUUID(),
          employeeId: e._id,
          effectiveFrom: "2026-07-01",
          reason: "Annual appraisal increment",
          basic: revStruct.basic,
          hra: revStruct.hra,
          allowances: revStruct.allowances,
          deductions: revStruct.deductions,
          ...stamp(daysAgo(70)),
        });
      }
    }
    await db.collection("hrms_payroll_profiles").insertMany(profileDocs);
    if (revisionDocs.length) await db.collection("hrms_salary_revisions").insertMany(revisionDocs);

    const structureOn = (name, monthEnd) => {
      const rev = RAISES[name] && "2026-07-01" <= monthEnd ? structureFor(RAISES[name]) : null;
      const base = structureFor(GROSS[name] ?? 60000);
      const chosen = rev ?? base;
      if (["Ananya Sharma", "Karan Kulkarni", "Sneha Iyer", "Vikram Rao"].includes(name)) {
        chosen.deductions = [{ name: "Group Insurance", amount: 500 }];
      }
      return chosen;
    };

    // -- 12. Payroll runs + payslips + payouts ----------------------
    const lopFor = (empId, month) => {
      const isCurrent = month === CURRENT_MONTH;
      if (isCurrent) return 0; // mid-month draft — LOP not yet meaningful
      let absent = 0;
      let unpaid = 0;
      for (let d = 1; d <= monthLastDay(month); d++) {
        const ds = `${month}-${pad2(d)}`;
        if (!isWorking(ds)) continue;
        const rec = attendanceIndex.get(`${empId}|${ds}`);
        const st = rec?.status;
        if (st === "present" || st === "half_day") continue;
        if (st === "on_leave") {
          if (leaveTypePaidByReqId.get(rec.leaveRequestId) === false) unpaid += 1;
          continue;
        }
        absent += 1;
      }
      return Math.min(workingDaysInMonth(month), absent + unpaid);
    };

    const RUNS = [
      { month: "2026-06", status: "paid" },
      { month: "2026-07", status: "paid" },
      { month: "2026-08", status: "approved" },
      { month: "2026-09", status: "draft" },
    ];
    const tdsYtd = new Map(); // empId -> running FY TDS
    const payslipDocs = [];
    const payoutDocs = [];
    const runSummary = [];

    for (const runSpec of RUNS) {
      const month = runSpec.month;
      const monthEnd = `${month}-${pad2(monthLastDay(month))}`;
      const wd = workingDaysInMonth(month);
      const runId = randomUUID();
      const generatedAt = dateAt(`${month}-26`, 11);
      const approvedAt = runSpec.status === "draft" ? null : dateAt(`${month}-27`, 15);
      const paidAt = runSpec.status === "paid" ? dateAt(`${month}-28`, 12) : null;

      const slips = [];
      for (const e of empDocs) {
        const name = `${e.firstName} ${e.lastName}`.trim();
        const joinedAfter = (e.professional?.joiningDate ?? "2000-01-01") > monthEnd;
        const relievedBefore = e.professional?.relievingDate && e.professional.relievingDate < `${month}-01`;
        if (joinedAfter || relievedBefore) continue;

        const structure = structureOn(name, monthEnd);
        const lop = lopFor(e._id, month);
        const arrears = month === "2026-08" && name === "Sneha Iyer" ? 8000 : 0;
        const otherDeductions = month === "2026-07" && name === "Karan Kulkarni" ? 1500 : 0;
        const { payslip, tds } = computeSlip({
          emp: e,
          runId,
          month,
          structure,
          workingDays: wd,
          lopDays: lop,
          tdsYtd: tdsYtd.get(e._id) ?? 0,
          arrears,
          otherDeductions,
          bank: bankByEmp.get(e._id),
        });
        if (runSpec.status !== "draft") tdsYtd.set(e._id, (tdsYtd.get(e._id) ?? 0) + tds);
        slips.push(payslip);
      }

      const totals = {
        payslipCount: slips.length,
        totalGross: slips.reduce((s, p) => s + p.grossPay, 0),
        totalDeductions: slips.reduce((s, p) => s + p.totalDeductions, 0),
        totalNet: slips.reduce((s, p) => s + p.netPay, 0),
        totalEmployerCost: slips.reduce((s, p) => s + p.employerCost, 0),
      };
      await db.collection("hrms_payroll_runs").insertOne({
        _id: runId,
        month,
        status: runSpec.status,
        ...totals,
        generatedBy: E("Pooja Singh")._id,
        generatedAt,
        approvedBy: approvedAt ? E(CEO_NAME)._id : null,
        approvedAt,
        paidBy: paidAt ? "system" : null,
        paidAt,
      });
      payslipDocs.push(...slips);
      runSummary.push({ month, status: runSpec.status, count: slips.length, net: totals.totalNet });

      // Payouts — only for approved / paid runs.
      if (runSpec.status === "draft") continue;
      slips.forEach((slip, idx) => {
        const acct = bankByEmp.get(slip.employeeId);
        let status = "paid";
        let utr = null;
        let providerPayoutId = null;
        let failureReason = null;
        let reconciledAt = null;
        let reconciledBy = null;
        const initiatedAt = dateAt(`${month}-27`, 16);
        let paidTs = dateAt(`${month}-28`, 11);
        let processedAt = paidTs;

        if (runSpec.status === "approved") {
          // August — spread the pipeline across its states.
          const bucket = idx % 10;
          if (bucket <= 3) status = "paid";
          else if (bucket <= 5) { status = "processing"; providerPayoutId = `pout_${randomUUID().slice(0, 12)}`; paidTs = null; }
          else if (bucket === 6) { status = "initiated"; paidTs = null; processedAt = null; }
          else if (bucket === 7) { status = "failed"; failureReason = "Beneficiary bank rejected — IFSC invalid"; paidTs = null; processedAt = initiatedAt; }
          else { status = "pending"; paidTs = null; processedAt = null; }
        }

        if (status === "paid") {
          utr = `AXISN${String(202600000000 + idx * 7 + strSeed(month) % 9000).slice(0, 12)}`;
          if (month === "2026-06") {
            reconciledAt = dateAt("2026-07-02", 10);
            reconciledBy = E("Shikha Singh")._id;
          }
        }

        payoutDocs.push({
          _id: randomUUID(),
          runId,
          payslipId: slip._id,
          employeeId: slip.employeeId,
          employeeCode: slip.employeeCode,
          employeeName: slip.employeeName,
          month,
          grossSalary: slip.grossPay,
          totalDeductions: slip.totalDeductions,
          netPayable: slip.netPay,
          paymentAmount: slip.netPay,
          bankAccountId: acct?._id ?? null,
          bankAccountLast4: acct?.accountNumberLast4 ?? null,
          bankName: acct?.bankName ?? null,
          ifsc: acct?.ifsc ?? null,
          status,
          paymentProvider: "manual",
          providerPayoutId,
          utr,
          initiatedBy: status === "pending" ? null : E("Pooja Singh")._id,
          initiatedAt: status === "pending" ? null : initiatedAt,
          processedAt: processedAt,
          paidAt: paidTs,
          failureReason,
          remarks: null,
          reconciledAt,
          reconciledBy,
          ...stamp(initiatedAt),
        });
      });
    }
    for (let i = 0; i < payslipDocs.length; i += 500) {
      await db.collection("hrms_payslips").insertMany(payslipDocs.slice(i, i + 500));
    }
    await db.collection("hrms_salary_payouts").insertMany(payoutDocs);

    // -- 13. Portal logins (admin_users) --------------------------
    const loginByEmpId = new Map(); // empId -> { _id, email }
    const loginDocs = [];
    for (const e of empDocs) {
      const name = `${e.firstName} ${e.lastName}`.trim();
      const email = workEmailFor(name);
      const roles = [...(STAFF_ROLES[name] ?? []), "employee"];
      const mustChange = !READY_LOGINS.has(name);
      const _id = new ObjectId();
      loginByEmpId.set(e._id, { _id, email });
      loginDocs.push({
        _id,
        email,
        passwordHash: hashPassword(PORTAL_PASSWORD),
        failedLoginAttempts: 0,
        lockedUntil: null,
        createdAt: daysAgo(80),
        lastLoginAt: READY_LOGINS.has(name) ? daysAgo((strSeed(email) % 5) + 1) : null,
        roles,
        employeeId: e._id,
        mustChangePassword: mustChange,
        seededBy: "hrms-demo",
      });
      await employees.updateOne({ _id: e._id }, { $set: { adminUserId: email } });
    }
    await db.collection("admin_users").insertMany(loginDocs);

    // -- 14. Employee documents ------------------------------------
    const docDocs = [];
    const writeFile = (label) => {
      const key = `${randomUUID()}.pdf`;
      writeFileSync(path.join(DOCS_DIR, key), TINY_PDF);
      return { key, filename: `${label.replace(/\s+/g, "_")}.pdf`, size: Buffer.byteLength(TINY_PDF) };
    };
    const mkDoc = (empId, category, title, extra = {}) => {
      const f = writeFile(title);
      return {
        _id: randomUUID(),
        employeeId: empId,
        category,
        title,
        storageKey: f.key,
        filename: f.filename,
        contentType: "application/pdf",
        size: f.size,
        issuedDate: extra.issuedDate ?? null,
        expiryDate: extra.expiryDate ?? null,
        version: extra.version ?? 1,
        supersededById: extra.supersededById ?? null,
        uploadedBy: extra.uploadedBy ?? E("Pooja Singh")._id,
        uploadedByRole: extra.uploadedByRole ?? "staff",
        ...stamp(extra.at ?? daysAgo(75)),
      };
    };
    empDocs.forEach((e, i) => {
      docDocs.push(mkDoc(e._id, "aadhaar", "Aadhaar Card", { issuedDate: "2014-05-10" }));
      docDocs.push(mkDoc(e._id, "pan", "PAN Card", { issuedDate: "2013-08-01" }));
      docDocs.push(mkDoc(e._id, "appointment_letter", "Appointment Letter", { issuedDate: e.professional?.joiningDate ?? "2022-01-10" }));
      // A handful of certificates expiring within ~25 days — feeds the expiry sweep.
      if (i % 5 === 1) {
        const exp = new Date(Date.parse(`${TODAY}T00:00:00Z`) + (8 + (i % 15)) * 86400000).toISOString().slice(0, 10);
        docDocs.push(mkDoc(e._id, "certificate", "AWS Certification", { issuedDate: "2023-09-01", expiryDate: exp }));
      }
    });
    // Versioned "Address Proof" for two people.
    for (const name of ["Ananya Sharma", "Rohan Malhotra"]) {
      const empId = E(name)._id;
      const v2 = mkDoc(empId, "address_proof", "Address Proof", { version: 2, issuedDate: "2026-02-01", at: daysAgo(30) });
      const v1 = mkDoc(empId, "address_proof", "Address Proof", { version: 1, issuedDate: "2024-01-01", supersededById: v2._id, at: daysAgo(200) });
      docDocs.push(v1, v2);
    }
    // One employee-uploaded document.
    docDocs.push(mkDoc(E("Kavya Nair")._id, "other", "Reimbursement — Internet Bill", { uploadedBy: loginByEmpId.get(E("Kavya Nair")._id)._id.toString(), uploadedByRole: "employee", at: daysAgo(5) }));
    await db.collection("hrms_employee_documents").insertMany(docDocs);

    // -- 15. Recruitment: job positions, applications, offers -----
    const positions = [
      { slug: "senior-backend-engineer", title: "Senior Backend Engineer", category: "Engineering" },
      { slug: "product-designer", title: "Product Designer", category: "Design" },
      { slug: "devops-engineer", title: "DevOps Engineer", category: "Engineering" },
      { slug: "qa-automation-engineer", title: "QA Automation Engineer", category: "Engineering" },
      { slug: "desktop-app-developer", title: "Desktop App Developer", category: "Engineering" },
    ];
    const posIdBySlug = new Map();
    for (const p of positions) {
      const existing = await db.collection("job_positions").findOne({ slug: p.slug });
      if (existing) {
        posIdBySlug.set(p.slug, existing._id);
        continue;
      }
      const _id = new ObjectId();
      await db.collection("job_positions").insertOne({ _id, ...p, isOpen: true, createdAt: daysAgo(120), updatedAt: daysAgo(120) });
      posIdBySlug.set(p.slug, _id);
    }
    const APPS = [
      { name: "Rhea Kapoor", slug: "product-designer", status: "selected", offer: "extended" },
      { name: "Aditya Menon", slug: "senior-backend-engineer", status: "selected", offer: "accepted" },
      { name: "Sana Sheikh", slug: "devops-engineer", status: "interview_scheduled", offer: "draft" },
      { name: "Farhan Ali", slug: "qa-automation-engineer", status: "shortlisted", offer: "declined" },
      { name: "Divya Reddy", slug: "desktop-app-developer", status: "hired", offer: "joined" },
      { name: "Ishita Bose", slug: "senior-backend-engineer", status: "under_review", offer: null },
      { name: "Mohit Saxena", slug: "product-designer", status: "rejected", offer: null },
    ];
    const offerDocs = [];
    for (const a of APPS) {
      const appId = new ObjectId();
      const email = `${a.name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
      const pos = positions.find((p) => p.slug === a.slug);
      await db.collection("career_applications").insertOne({
        _id: appId,
        positionId: posIdBySlug.get(a.slug) ?? null,
        positionSlug: a.slug,
        positionTitle: pos.title,
        name: a.name,
        email,
        phone: `+91 9${String(strSeed(a.name)).padStart(9, "0").slice(0, 9)}`,
        resume: { storageKey: `${randomUUID()}.pdf`, filename: `${a.name.replace(/\s+/g, "_")}_Resume.pdf`, contentType: "application/pdf", size: 240000 },
        status: a.status,
        source: "hrms-seed",
        createdAt: daysAgo(45),
        updatedAt: daysAgo(10),
      });
      if (!a.offer) continue;
      const joinedEmp = a.offer === "joined" ? E(a.name) : null;
      offerDocs.push({
        _id: randomUUID(),
        applicationId: appId.toString(),
        candidateName: a.name,
        candidateEmail: email,
        positionTitle: pos.title,
        positionSlug: a.slug,
        status: a.offer,
        offerDate: "2026-08-18",
        proposedJoiningDate: a.offer === "joined" ? "2026-07-01" : "2026-10-01",
        annualCtc: { "product-designer": 1800000, "senior-backend-engineer": 2400000, "devops-engineer": 2000000, "qa-automation-engineer": 1400000, "desktop-app-developer": 1100000 }[a.slug],
        notes: a.offer === "declined" ? "Candidate accepted a competing offer." : null,
        employeeId: joinedEmp?._id ?? null,
        ...stamp(daysAgo(20)),
      });
      if (joinedEmp) {
        await employees.updateOne(
          { _id: joinedEmp._id },
          { $set: { recruitment: { applicationId: appId.toString(), positionSlug: a.slug, positionTitle: pos.title, convertedAt: daysAgo(68), convertedBy: E("Pooja Singh")._id } } }
        );
      }
    }
    await db.collection("hrms_offers").insertMany(offerDocs);

    // -- 16. Notifications ---------------------------------------
    const notifDocs = [];
    // NB: the dedupeKey index is unique+sparse — omit the field entirely (never null).
    const pushNotif = (n) => notifDocs.push({ _id: randomUUID(), link: null, entityType: null, entityId: null, readBy: [], ...n });
    const pendingLeaves = leaveDocs.filter((l) => l.status === "pending");
    for (const l of pendingLeaves.slice(0, 3)) {
      pushNotif({
        audience: "staff",
        recipientUserId: null,
        type: "leave_requested",
        title: `${nameById.get(l.employeeId)} requested ${l.leaveTypeCode} leave`,
        body: `${l.days} day(s) · ${l.startDate}${l.startDate !== l.endDate ? ` – ${l.endDate}` : ""}`,
        link: "/hrms/leave?tab=requests",
        entityType: "leave_request",
        entityId: l._id,
        createdAt: l.createdAt,
      });
    }
    pushNotif({
      audience: "staff", recipientUserId: null, type: "employee_added",
      title: "New employee added — Divya Reddy", body: "YO-0010 · Desktop App Developer, Engineering",
      link: `/hrms/employees/${E("Divya Reddy")._id}`, entityType: "employee", entityId: E("Divya Reddy")._id,
      createdAt: daysAgo(68),
    });
    pushNotif({
      audience: "staff", recipientUserId: null, type: "offer_status",
      title: "Offer accepted — Aditya Menon", body: "Senior Backend Engineer · joining 2026-10-15",
      link: "/hrms/recruitment?tab=offers", entityType: "offer", entityId: offerDocs[1]?._id ?? null,
      createdAt: daysAgo(12),
    });
    pushNotif({
      audience: "staff", recipientUserId: null, type: "offer_status",
      title: "Offer declined — Farhan Ali", body: "QA Automation Engineer · accepted a competing offer",
      link: "/hrms/recruitment?tab=offers", entityType: "offer", entityId: offerDocs[3]?._id ?? null,
      createdAt: daysAgo(9), readBy: [],
    });
    // Employee-targeted
    const decidedLeaves = leaveDocs.filter((l) => ["approved", "rejected"].includes(l.status));
    for (const l of decidedLeaves.slice(0, 4)) {
      const login = loginByEmpId.get(l.employeeId);
      if (!login) continue;
      pushNotif({
        audience: "employee", recipientUserId: login._id.toString(), type: "leave_decided",
        title: `Your leave was ${l.status}`, body: `${l.days} day(s) from ${l.startDate}${l.decisionNote ? ` — ${l.decisionNote}` : ""}`,
        link: "/hrms/me/leave", entityType: "leave_request", entityId: l._id,
        createdAt: l.decidedAt ?? daysAgo(30), readBy: l.status === "approved" ? [login._id.toString()] : [],
      });
    }
    for (const month of ["2026-06", "2026-07"]) {
      for (const name of ["Ananya Sharma", "Kavya Nair", "Vikram Rao"]) {
        const login = loginByEmpId.get(E(name)._id);
        pushNotif({
          audience: "employee", recipientUserId: login._id.toString(), type: "payslip_published",
          title: `Your ${month} payslip is ready`, body: "View it in Salary & Payslips",
          link: `/hrms/me/salary/${month}`, entityType: "payslip", entityId: null,
          createdAt: dateAt(`${month}-27`, 16), readBy: month === "2026-06" ? [login._id.toString()] : [],
        });
      }
    }
    await db.collection("hrms_notifications").insertMany(notifDocs);

    // -- 17. Audit log -----------------------------------------
    const auditDocs = [];
    const audit = (action, entity, entityId, label, summary, dAgo, email = HR_ACTOR_EMAIL) =>
      auditDocs.push({
        _id: randomUUID(),
        actorId: "seed",
        actorEmail: email,
        action,
        entity,
        entityId: entityId ?? "seed",
        entityLabel: label ?? null,
        summary: summary ?? null,
        metadata: null,
        createdAt: daysAgo(dAgo),
      });
    audit("create", "department", deptIdByName["Engineering"], "Engineering", null, 210, "system@yashorbit.com");
    for (const name of ["Arjun Mehta", "Ananya Sharma", "Ritika Verma", "Vikram Rao", "Divya Reddy"]) {
      audit("create", "employee", E(name)._id, name, null, 200 - strSeed(name) % 40);
    }
    audit("convert_from_applicant", "employee", E("Divya Reddy")._id, "Divya Reddy", "Hired via Desktop App Developer pipeline", 68);
    audit("status_change", "employee", E("Swati Bansal")._id, "Swati Bansal", "status: active → notice_period", 15);
    audit("create", "salary_revision", E("Ananya Sharma")._id, "Ananya Sharma", "Annual appraisal increment, effective 2026-07-01", 70);
    for (const [m, d] of [["2026-06", 103], ["2026-07", 72], ["2026-08", 41], ["2026-09", 11]]) {
      audit("generate", "payroll_run", "run", `Payroll ${m}`, `${empDocs.length} payslips generated`, d);
    }
    for (const [m, d] of [["2026-06", 102], ["2026-07", 71], ["2026-08", 40]]) {
      audit("approve", "payroll_run", "run", `Payroll ${m}`, "Run approved", d, workEmailFor(CEO_NAME));
    }
    audit("initiate", "salary_payout", "batch", "August payouts", "12 payouts initiated", 39);
    audit("pay", "salary_payout", "batch", "July payouts", "All payouts marked paid — run auto-locked", 70);
    audit("reconcile", "salary_payout", "batch", "June payouts", "21 payouts reconciled", 66, workEmailFor("Shikha Singh"));
    for (const name of ["Arjun Mehta", "Ritika Verma", "Rohan Malhotra"]) {
      audit("create", "bank_account", E(name)._id, `${name} · HDFC Bank`, null, 88);
      audit("verify", "bank_account", E(name)._id, name, "→ verified", 60);
    }
    audit("view_sensitive", "bank_account", E("Tej Pratap Singh")._id, "Tej Pratap Singh · ICICI Bank", "Revealed full account number", 4, workEmailFor(CEO_NAME));
    audit("approve", "leave_request", decidedLeaves[0]?._id, nameById.get(decidedLeaves[0]?.employeeId), "approved", 80);
    audit("reject", "leave_request", leaveDocs.find((l) => l.status === "rejected")?._id, "Karan Kulkarni", "rejected — release week", 3, workEmailFor("Arjun Mehta"));
    audit("bulk_mark", "attendance", "batch", "2026-08-28 · Raksha Bandhan", "Marked holiday for 21 employees", 10);
    audit("role_grant", "employee_login", E("Pooja Singh")._id, "pooja.singh@yashorbit.com", "roles: [hr, employee]", 80, "system@yashorbit.com");
    audit("create", "offer", offerDocs[0]?._id, "Rhea Kapoor · Product Designer", "Offer drafted", 22);
    audit("update", "org_settings", "org", "Work schedule", "shiftStart: 10:00 → 09:30", 210, workEmailFor(CEO_NAME));
    await db.collection("hrms_audit_logs").insertMany(auditDocs);

    // -- Summary ------------------------------------------------
    const counts = {};
    for (const c of [...WIPE, "hrms_employee_documents"]) counts[c] = await db.collection(c).countDocuments({});
    console.log("\n─────────── HRMS demo data ───────────");
    console.log(`Employees ................ ${counts.hrms_employees}   (YO-0001 … YO-00${empDocs.length})`);
    console.log(`Departments / designations ${counts.hrms_departments} / ${counts.hrms_designations}, teams ${counts.hrms_teams}`);
    console.log(`Holidays ................. ${counts.hrms_holidays}`);
    console.log(`Attendance rows ......... ${counts.hrms_attendance}  (+ ${counts.hrms_attendance_logs} logs)`);
    console.log(`Leave: types ${counts.hrms_leave_types}, requests ${counts.hrms_leave_requests}, balances ${counts.hrms_leave_balances}`);
    console.log(`Bank accounts ........... ${counts.hrms_bank_accounts}  (AES-256-GCM encrypted)`);
    console.log(`Payroll: profiles ${counts.hrms_payroll_profiles}, revisions ${counts.hrms_salary_revisions}, runs ${counts.hrms_payroll_runs}, payslips ${counts.hrms_payslips}`);
    for (const r of runSummary) console.log(`   • ${r.month}  ${r.status.padEnd(8)}  ${r.count} slips   net ₹${r.net.toLocaleString("en-IN")}`);
    console.log(`Salary payouts .......... ${counts.hrms_salary_payouts}`);
    console.log(`Portal logins .......... ${loginDocs.length}   password: ${PORTAL_PASSWORD}`);
    console.log(`   ready now (no forced reset): ${[...READY_LOGINS].map((n) => workEmailFor(n)).join(", ")}`);
    console.log(`Documents ............... ${counts.hrms_employee_documents}`);
    console.log(`Offers ................. ${counts.hrms_offers}   Notifications ${counts.hrms_notifications}   Audit ${counts.hrms_audit_logs}`);
    console.log("──────────────────────────────────────");
    console.log("Sign in at /hrms/login  (super admin: " + workEmailFor(CEO_NAME) + ")");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
