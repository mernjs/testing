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
    const tasksCol = db.collection("pms_tasks");
    const commentsCol = db.collection("pms_task_comments");
    const milestonesCol = db.collection("pms_milestones");
    const documentsCol = db.collection("pms_documents");
    const notificationsCol = db.collection("pms_notifications");
    const metaCol = db.collection("pms_meta");
    const timesheetsCol = db.collection("pms_timesheets");
    const costingCol = db.collection("pms_project_costing");
    const attachmentsCol = db.collection("pms_task_attachments");

    console.log("Wiping PMS collections…");
    await Promise.all([
      clients.deleteMany({}),
      projects.deleteMany({}),
      members.deleteMany({}),
      activity.deleteMany({}),
      settings.deleteMany({}),
      tasksCol.deleteMany({}),
      commentsCol.deleteMany({}),
      milestonesCol.deleteMany({}),
      documentsCol.deleteMany({}),
      timesheetsCol.deleteMany({}),
      costingCol.deleteMany({}),
      attachmentsCol.deleteMany({}),
      notificationsCol.deleteMany({}),
      metaCol.deleteMany({ _id: "deadline_sweep" }),
      counters.deleteMany({ _id: { $in: ["client_code", "project_code", "task_code"] } }),
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
    const projectMeta = [];

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
        estimatedHours: randInt(200, 2400),
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
      projectMeta.push({ pid, status, pmId, team, createdOffset, startDate, endDate, name: PROJECT_NAMES[i], code: `PRJ-${String(i + 1).padStart(4, "0")}` });
      if (pmId) {
        memberDocs.push({
          _id: randomUUID(),
          projectId: pid,
          employeeId: pmId,
          role: "manager",
          allocationPercent: randInt(20, 50),
          billableRate: randInt(40, 120) * 100,
          costRate: randInt(25, 70) * 100,
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
          costRate: randInt(12, 55) * 100,
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

    // ---- Tasks + subtasks + comments -------------------------------------
    const TASK_STATUSES = ["todo", "in_progress", "review", "testing", "done"];
    const TASK_TITLES = [
      "Set up CI/CD pipeline", "Design database schema", "Build authentication flow",
      "Implement dashboard UI", "Write API integration tests", "Accessibility audit",
      "Performance profiling", "Draft user documentation", "Configure monitoring & alerts",
      "Security review", "Load-test the checkout path", "Migrate legacy data",
      "Wire up payment gateway", "Set up feature flags", "Localization pass",
    ];
    const LABELS = ["frontend", "backend", "infra", "bug", "spike", "docs", "design", "urgent"];
    const taskDocs = [];
    const commentDocs = [];
    const milestoneDocs = [];
    let taskSeq = 0;

    for (const pm of projectMeta) {
      const taskCount = pm.status === "planning" ? randInt(2, 5) : randInt(6, 14);
      const orderByStatus = {};
      const createdTasks = [];
      for (let k = 0; k < taskCount; k++) {
        let st;
        if (pm.status === "completed") st = Math.random() < 0.85 ? "done" : pick(TASK_STATUSES, 1)[0];
        else if (pm.status === "planning") st = Math.random() < 0.7 ? "todo" : "in_progress";
        else st = TASK_STATUSES[randInt(0, 4)];
        orderByStatus[st] = (orderByStatus[st] ?? 0) + 1024;

        const assignee = pm.team.length && Math.random() < 0.8 ? pick(pm.team, 1)[0] : null;
        const dueOffset = randInt(-25, 50);
        const tid = randomUUID();
        taskSeq += 1;
        const created = new Date(now.getTime() - randInt(1, Math.max(pm.createdOffset, 2)) * 86400000);
        taskDocs.push({
          _id: tid,
          taskCode: `TSK-${String(taskSeq).padStart(4, "0")}`,
          projectId: pm.pid,
          parentTaskId: null,
          title: TASK_TITLES[(k + taskSeq) % TASK_TITLES.length],
          description: Math.random() < 0.5 ? "Acceptance criteria tracked in the linked doc." : null,
          status: st,
          priority: PRIORITIES[randInt(0, 3)],
          assigneeId: assignee,
          labels: pick(LABELS, randInt(0, 2)),
          startDate: null,
          dueDate: st === "done" ? null : isoDate(daysFromNow(dueOffset)),
          estimateHours: Math.random() < 0.6 ? randInt(2, 40) : null,
          orderKey: orderByStatus[st],
          completedAt: st === "done" ? created : null,
          createdAt: created,
          updatedAt: created,
          createdBy: "pms-seed",
          updatedBy: "pms-seed",
          deletedAt: null,
        });
        createdTasks.push({ _id: tid, status: st });

        // subtasks
        if (Math.random() < 0.4) {
          const subN = randInt(1, 3);
          for (let s = 0; s < subN; s++) {
            taskSeq += 1;
            const subDone = Math.random() < 0.5;
            taskDocs.push({
              _id: randomUUID(),
              taskCode: `TSK-${String(taskSeq).padStart(4, "0")}`,
              projectId: pm.pid,
              parentTaskId: tid,
              title: `Subtask ${s + 1}`,
              description: null,
              status: subDone ? "done" : "todo",
              priority: "medium",
              assigneeId: assignee,
              labels: [],
              startDate: null,
              dueDate: null,
              estimateHours: null,
              orderKey: (s + 1) * 1024,
              completedAt: subDone ? created : null,
              createdAt: created,
              updatedAt: created,
              createdBy: "pms-seed",
              updatedBy: "pms-seed",
              deletedAt: null,
            });
          }
        }

        // comments
        if (Math.random() < 0.3) {
          commentDocs.push({
            _id: randomUUID(),
            taskId: tid,
            projectId: pm.pid,
            authorId: "pms-seed",
            authorEmail: "seed@yashorbit.com",
            body: pick(["Blocked on the API contract.", "Looks good, moving to review.", "Can we split this?", "Reproduced — fixing now."], 1)[0],
            createdAt: created,
            editedAt: null,
            deletedAt: null,
          });
        }
      }

      // recompute project progress from top-level tasks
      const topDone = createdTasks.filter((t) => t.status === "done").length;
      const pct = createdTasks.length ? Math.round((topDone / createdTasks.length) * 100) : null;
      const pDoc = projectDocs.find((p) => p._id === pm.pid);
      if (pct !== null && pDoc) pDoc.progressPercent = pct;

      // milestones
      const msCount = randInt(2, 4);
      for (let m = 0; m < msCount; m++) {
        const linked = pick(createdTasks.map((t) => t._id), randInt(0, Math.min(4, createdTasks.length)));
        const msStatus = m === 0 && pm.status !== "planning" ? "completed" : m === 1 ? "in_progress" : "pending";
        milestoneDocs.push({
          _id: randomUUID(),
          projectId: pm.pid,
          name: ["Discovery complete", "MVP delivered", "Beta launch", "Production go-live"][m] ?? `Milestone ${m + 1}`,
          description: null,
          dueDate: isoDate(daysFromNow(randInt(-40, 90))),
          status: msStatus,
          manualProgressPercent: msStatus === "completed" ? 100 : msStatus === "in_progress" ? randInt(30, 70) : 0,
          linkedTaskIds: linked,
          orderKey: (m + 1) * 1024,
          completedAt: msStatus === "completed" ? new Date(now.getTime() - randInt(5, 60) * 86400000) : null,
          ...stamp(pm.createdOffset - randInt(0, 15)),
        });
      }
    }

    // ---- Timesheets -----------------------------------------------------
    const TS_STATUSES = ["draft", "submitted", "approved", "approved", "approved", "rejected"];
    const timesheetDocs = [];
    const costingDocs = [];
    for (const pm of projectMeta) {
      const projTaskDocs = taskDocs.filter((t) => t.projectId === pm.pid && !t.parentTaskId);
      const contributors = [pm.pmId, ...pm.team].filter(Boolean);
      // ~6-20 entries per project spread over the last 60 days.
      const entryCount = pm.status === "planning" ? randInt(0, 4) : randInt(8, 22);
      for (let k = 0; k < entryCount; k++) {
        const emp = contributors[randInt(0, contributors.length - 1)];
        if (!emp) continue;
        const dayOffset = -randInt(0, 60);
        const startH = randInt(9, 15);
        const durH = randInt(1, 4);
        const st = pm.status === "completed" ? "approved" : TS_STATUSES[randInt(0, TS_STATUSES.length - 1)];
        const task = projTaskDocs.length ? projTaskDocs[randInt(0, projTaskDocs.length - 1)] : null;
        const created = new Date(now.getTime() + dayOffset * 86400000);
        timesheetDocs.push({
          _id: randomUUID(),
          projectId: pm.pid,
          taskId: task ? task._id : null,
          employeeId: emp,
          date: isoDate(daysFromNow(dayOffset)),
          startTime: `${String(startH).padStart(2, "0")}:00`,
          endTime: `${String(startH + durH).padStart(2, "0")}:00`,
          hours: durH,
          description: pick(["Implementation", "Code review", "Bug fixing", "Client call", "Testing", "Deployment prep", "Documentation"], 1)[0],
          billable: Math.random() < 0.75,
          status: st,
          submittedAt: st === "draft" ? null : created,
          reviewedBy: st === "approved" || st === "rejected" ? "pms-seed" : null,
          reviewedAt: st === "approved" || st === "rejected" ? created : null,
          reviewNote: st === "rejected" ? "Please split by task." : null,
          createdAt: created,
          updatedAt: created,
          createdBy: "pms-seed",
          updatedBy: "pms-seed",
          deletedAt: null,
        });
      }
      costingDocs.push({
        _id: pm.pid,
        contractValue: null,
        otherCosts: randInt(0, 8) * 25000,
        defaultCostRate: randInt(15, 40) * 100,
        defaultBillRate: randInt(35, 85) * 100,
        updatedAt: now,
        updatedBy: "pms-seed",
      });
    }

    await projects.insertMany(projectDocs);
    if (memberDocs.length) await members.insertMany(memberDocs);
    await activity.insertMany(activityDocs);
    if (taskDocs.length) await tasksCol.insertMany(taskDocs);
    if (commentDocs.length) await commentsCol.insertMany(commentDocs);
    if (milestoneDocs.length) await milestonesCol.insertMany(milestoneDocs);
    if (timesheetDocs.length) await timesheetsCol.insertMany(timesheetDocs);
    if (costingDocs.length) await costingCol.insertMany(costingDocs);
    await counters.updateOne({ _id: "project_code" }, { $set: { seq: projectDocs.length } }, { upsert: true });
    await counters.updateOne({ _id: "task_code" }, { $set: { seq: taskSeq } }, { upsert: true });

    // ---- Grant pms_employee to existing HRMS portal logins --------------
    const empLoginRes = await db.collection("admin_users").updateMany(
      { employeeId: { $ne: null }, roles: "employee" },
      { $addToSet: { roles: "pms_employee" } }
    );

    // ---- Notifications for PMS logins ------------------------------------
    const pmsLogins = await db
      .collection("admin_users")
      .find(
        { roles: { $in: ["super_admin", "pms_admin", "pms_manager"] }, employeeId: { $ne: null } },
        { projection: { employeeId: 1 } }
      )
      .toArray();
    const notificationDocs = [];
    for (const login of pmsLogins) {
      const theirTasks = taskDocs.filter((t) => t.assigneeId === login.employeeId && t.status !== "done").slice(0, 3);
      for (const t of theirTasks) {
        notificationDocs.push({
          _id: randomUUID(),
          recipientUserId: login._id.toString(),
          type: "task_assigned",
          title: `You were assigned: ${t.title}`,
          body: `${t.taskCode}`,
          link: `/pms/projects/${t.projectId}/tasks/${t._id}`,
          projectId: t.projectId,
          read: Math.random() < 0.4,
          dedupeKey: null,
          createdAt: new Date(now.getTime() - randInt(1, 20) * 86400000),
        });
      }
    }
    if (notificationDocs.length) await notificationsCol.insertMany(notificationDocs);

    console.log(`\nSeeded:`);
    console.log(`  ${clientDocs.length} clients`);
    console.log(`  ${timesheetDocs.length} timesheet entries · granted pms_employee to ${empLoginRes.modifiedCount} logins`);
    console.log(`  ${projectDocs.length} projects (every status + priority)`);
    console.log(`  ${memberDocs.length} team allocations`);
    console.log(`  ${taskDocs.length} tasks (incl. subtasks) + ${commentDocs.length} comments`);
    console.log(`  ${milestoneDocs.length} milestones`);
    console.log(`  ${activityDocs.length} activity-log entries · ${notificationDocs.length} notifications`);
    console.log(`\nSign in at /pms/login (grant a role first with: npm run pms:grant).`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
