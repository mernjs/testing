#!/usr/bin/env node
/**
 * PMS demo seeder. Run with:  npm run pms:seed-demo
 *
 * DESTRUCTIVE for PMS data only: wipes the `pms_*` collections it owns
 * (pms_clients, pms_projects, pms_project_members, pms_activity_logs,
 * pms_settings, pms_counters) and rebuilds one internally-consistent dataset.
 * Never touches leads / campaigns / chatbot / hrms_* / admin_users.
 *
 * Reads existing `hrms_employees` to populate project managers + team members.
 * Falls back gracefully to unassigned projects when no employees exist.
 */

import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";

const PROJECT_STATUSES = ["planning", "in_progress", "review", "testing", "completed", "on_hold", "cancelled"];
const PRIORITIES = ["low", "medium", "high", "critical"];
const MEMBER_ROLES = ["lead", "developer", "designer", "qa", "analyst", "devops"];
const CATEGORIES = [
  "Web Development", "Mobile App", "AI / ML", "Data Engineering",
  "Cloud & DevOps", "UI / UX Design", "Maintenance & Support", "Consulting",
];
const TECH = ["Next.js", "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "MongoDB", "Tailwind CSS", "AWS", "Docker", "React Native", "FastAPI", "TensorFlow", "Redis"];

function pick(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out;
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function isoDate(d) {
  return d.toISOString().slice(0, 10);
}
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

const CLIENTS = [
  { companyName: "Northwind Retail Group", industry: "Retail", country: "United Kingdom", currency: "GBP" },
  { companyName: "Helios Fintech", industry: "Fintech", country: "Singapore", currency: "SGD" },
  { companyName: "Verdant Agritech", industry: "Agriculture", country: "India", currency: "INR" },
  { companyName: "Aster Health Systems", industry: "Healthcare", country: "United States", currency: "USD" },
  { companyName: "Meridian Logistics", industry: "Logistics", country: "United Arab Emirates", currency: "AED" },
  { companyName: "Cobalt Media House", industry: "Media", country: "Australia", currency: "AUD" },
  { companyName: "Quanta Manufacturing", industry: "Manufacturing", country: "Germany", currency: "EUR" },
  { companyName: "BlueOrbit Travel", industry: "Travel & Hospitality", country: "India", currency: "INR" },
];

const PROJECT_NAMES = [
  "Customer Portal Rebuild", "Mobile Ordering App", "Data Lakehouse Migration",
  "AI Support Assistant", "Warehouse Ops Dashboard", "Design System 2.0",
  "Billing Platform Overhaul", "Fleet Tracking Revamp", "Marketing Site Refresh",
  "Recommendation Engine", "Compliance Reporting Suite", "Partner API Gateway",
  "Inventory Forecasting Model", "Patient Intake Portal", "Payments Reconciliation Service",
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-pms-demo.mjs");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    const clients = db.collection("pms_clients");
    const projects = db.collection("pms_projects");
    const members = db.collection("pms_project_members");
    const activity = db.collection("pms_activity_logs");
    const settings = db.collection("pms_settings");
    const counters = db.collection("pms_counters");

    console.log("Wiping PMS collections…");
    await Promise.all([
      clients.deleteMany({}),
      projects.deleteMany({}),
      members.deleteMany({}),
      activity.deleteMany({}),
      settings.deleteMany({}),
      counters.deleteMany({ _id: { $in: ["client_code", "project_code"] } }),
    ]);

    const now = new Date();
    const stamp = (createdOffsetDays = 0) => {
      const created = new Date(now.getTime() - createdOffsetDays * 86400000);
      return { createdAt: created, updatedAt: created, createdBy: "pms-seed", updatedBy: "pms-seed", deletedAt: null };
    };

    // Employees for PM + team
    const employees = await db
      .collection("hrms_employees")
      .find({ deletedAt: null }, { projection: { _id: 1, firstName: 1, lastName: 1 } })
      .toArray();
    const empIds = employees.map((e) => e._id);
    console.log(`Found ${empIds.length} HRMS employees for staffing.`);

    // Settings
    await settings.updateOne(
      { _id: "config" },
      {
        $set: {
          _id: "config",
          categories: CATEGORIES,
          technologySuggestions: TECH,
          defaultCurrency: "INR",
          updatedAt: now,
          updatedBy: "pms-seed",
        },
      },
      { upsert: true }
    );

    // Clients
    const clientDocs = CLIENTS.map((c, i) => ({
      _id: randomUUID(),
      clientCode: `CLI-${String(i + 1).padStart(4, "0")}`,
      companyName: c.companyName,
      industry: c.industry,
      website: `https://www.${c.companyName.toLowerCase().replace(/[^a-z]+/g, "")}.com`,
      status: i === 0 ? "prospect" : i === CLIENTS.length - 1 ? "inactive" : "active",
      primaryContact: {
        name: ["Priya Nair", "James Cole", "Anita Rao", "Marcus Webb", "Sara Khan", "Tom Fisher", "Lena Braun", "Devika Menon"][i],
        email: `contact${i + 1}@${c.companyName.toLowerCase().replace(/[^a-z]+/g, "")}.com`,
        phone: `+${randInt(1, 91)}${randInt(100000000, 999999999)}`,
        designation: ["VP Engineering", "CTO", "Head of Product", "Director of IT", "COO", "Product Lead", "CIO", "Founder"][i],
      },
      billing: {
        addressLine: `${randInt(1, 200)} Business Park`,
        city: ["London", "Singapore", "Bengaluru", "Boston", "Dubai", "Sydney", "Munich", "Kochi"][i],
        country: c.country,
        gstin: c.country === "India" ? `29ABCDE${randInt(1000, 9999)}F1Z5` : null,
        currency: c.currency,
        paymentTermsDays: pick([15, 30, 45, 60], 1)[0],
      },
      notes: i % 3 === 0 ? "Key account — quarterly business review scheduled." : null,
      tags: pick(["strategic", "retainer", "fixed-bid", "new", "referral"], randInt(0, 2)),
      ...stamp(randInt(120, 400)),
    }));
    await clients.insertMany(clientDocs);
    await counters.updateOne({ _id: "client_code" }, { $set: { seq: clientDocs.length } }, { upsert: true });

    // Projects
    const activeClients = clientDocs.filter((c) => c.status === "active");
    const projectDocs = [];
    const memberDocs = [];
    const activityDocs = [];

    for (let i = 0; i < PROJECT_NAMES.length; i++) {
      const clientDoc = activeClients[i % activeClients.length];
      const status = PROJECT_STATUSES[i % PROJECT_STATUSES.length];
      const createdOffset = randInt(20, 300);
      const startOffset = -randInt(10, 250);
      const durationDays = randInt(45, 240);
      const startDate = daysFromNow(startOffset);
      const endDate = daysFromNow(startOffset + durationDays);

      let progress;
      if (status === "completed") progress = 100;
      else if (status === "cancelled") progress = randInt(10, 60);
      else if (status === "planning") progress = randInt(0, 15);
      else if (status === "on_hold") progress = randInt(20, 70);
      else progress = randInt(20, 90);

      const pmId = empIds.length ? empIds[i % empIds.length] : null;
      const pid = randomUUID();

      projectDocs.push({
        _id: pid,
        projectCode: `PRJ-${String(i + 1).padStart(4, "0")}`,
        name: PROJECT_NAMES[i],
        clientId: clientDoc._id,
        category: CATEGORIES[i % CATEGORIES.length],
        description: `${PROJECT_NAMES[i]} for ${clientDoc.companyName}. Delivery covers discovery, build, QA and rollout in phased milestones.`,
        priority: PRIORITIES[i % PRIORITIES.length],
        status,
        startDate: isoDate(startDate),
        endDate: isoDate(endDate),
        estimatedBudget: randInt(8, 120) * 100000,
        currency: clientDoc.billing.currency,
        projectManagerId: pmId,
        technologies: pick(TECH, randInt(3, 6)),
        progressPercent: progress,
        ...stamp(createdOffset),
      });

      // Team members
      const memberPool = empIds.filter((id) => id !== pmId);
      const teamSize = Math.min(memberPool.length, randInt(3, 6));
      const team = pick(memberPool, teamSize);
      if (pmId) {
        memberDocs.push({
          _id: randomUUID(),
          projectId: pid,
          employeeId: pmId,
          role: "manager",
          allocationPercent: randInt(20, 50),
          billableRate: randInt(40, 120) * 100,
          active: true,
          ...stamp(createdOffset),
        });
      }
      for (const emp of team) {
        memberDocs.push({
          _id: randomUUID(),
          projectId: pid,
          employeeId: emp,
          role: MEMBER_ROLES[randInt(0, MEMBER_ROLES.length - 1)],
          allocationPercent: randInt(25, 100),
          billableRate: randInt(20, 90) * 100,
          active: status !== "completed" && status !== "cancelled" ? true : Math.random() > 0.5,
          ...stamp(createdOffset - randInt(0, 10)),
        });
      }

      activityDocs.push({
        _id: randomUUID(),
        actorId: "pms-seed",
        actorEmail: "seed@yashorbit.com",
        action: "create",
        entity: "project",
        entityId: pid,
        entityLabel: `PRJ-${String(i + 1).padStart(4, "0")} · ${PROJECT_NAMES[i]}`,
        summary: null,
        metadata: null,
        projectId: pid,
        createdAt: new Date(now.getTime() - createdOffset * 86400000),
      });
      if (status !== "planning") {
        activityDocs.push({
          _id: randomUUID(),
          actorId: "pms-seed",
          actorEmail: "seed@yashorbit.com",
          action: "status_change",
          entity: "project",
          entityId: pid,
          entityLabel: PROJECT_NAMES[i],
          summary: `status: planning → ${status}`,
          metadata: null,
          projectId: pid,
          createdAt: new Date(now.getTime() - randInt(1, createdOffset) * 86400000),
        });
      }
    }

    await projects.insertMany(projectDocs);
    if (memberDocs.length) await members.insertMany(memberDocs);
    await activity.insertMany(activityDocs);
    await counters.updateOne({ _id: "project_code" }, { $set: { seq: projectDocs.length } }, { upsert: true });

    console.log(`\nSeeded:`);
    console.log(`  ${clientDocs.length} clients`);
    console.log(`  ${projectDocs.length} projects (every status + priority)`);
    console.log(`  ${memberDocs.length} team allocations`);
    console.log(`  ${activityDocs.length} activity-log entries`);
    console.log(`\nSign in at /pms/login (grant a role first with: npm run pms:grant).`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
