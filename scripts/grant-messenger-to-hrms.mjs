#!/usr/bin/env node
/**
 * Bulk-provision Messenger access for HRMS employees.
 *
 *   npm run chat:grant-hrms                 # dry run — shows what would change
 *   npm run chat:grant-hrms -- --apply      # actually apply
 *
 * Flags (after `--`):
 *   --apply              perform the writes (otherwise dry-run)
 *   --create-missing     also create an admin_users login for employees who
 *                        don't have one yet (work email + generated temp
 *                        password, mustChangePassword on first sign-in).
 *                        The generated passwords are printed once.
 *   --include-inactive   include relieved / terminated employees (default: skip)
 *   --revoke             remove chat_employee from every linked employee login
 *                        instead of granting it
 *
 * What "already in the HRMS portal" means: an `admin_users` document with
 * `roles` containing `employee` and an `employeeId` linking it to an
 * `hrms_employees` record (this is how `/hrms/me` logins are created). Those
 * accounts get `chat_employee` merged into their roles — nothing else is
 * touched. A `chat_users` profile row is synced for each so they show up in the
 * directory / mentions immediately.
 */

import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "node:crypto";

const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply");
const CREATE_MISSING = args.has("--create-missing");
const INCLUDE_INACTIVE = args.has("--include-inactive");
const REVOKE = args.has("--revoke");

const SCRYPT_KEYLEN = 64;
const INACTIVE_STATUSES = new Set(["relieved", "terminated"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

function generateTempPassword() {
  return randomBytes(9).toString("base64url").slice(0, 12);
}

function fullName(e) {
  return `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || e.workEmail || e._id;
}

function nameFromEmail(email) {
  const local = (email.split("@")[0] ?? email).replace(/[._-]+/g, " ").replace(/\d+/g, " ").trim();
  const words = local.split(/\s+/).filter(Boolean);
  return words.length ? words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") : email;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/grant-messenger-to-hrms.mjs");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const employeesCol = db.collection("hrms_employees");
    const usersCol = db.collection("admin_users");
    const chatUsersCol = db.collection("chat_users");

    const employees = await employeesCol.find({ deletedAt: null }).toArray();
    const eligible = employees.filter((e) => INCLUDE_INACTIVE || !INACTIVE_STATUSES.has(e.status));

    // Existing HRMS portal logins, keyed by employeeId.
    const logins = await usersCol.find({ roles: "employee", employeeId: { $ne: null } }).toArray();
    const loginByEmployee = new Map(logins.map((u) => [String(u.employeeId), u]));

    const toGrant = []; // { employee, user }
    const toCreate = []; // { employee }
    const skipped = []; // { employee, reason }

    for (const e of eligible) {
      const login = loginByEmployee.get(String(e._id));
      if (login) {
        const roles = Array.isArray(login.roles) ? login.roles : [];
        const has = roles.includes("chat_employee");
        if (REVOKE ? has : !has) toGrant.push({ employee: e, user: login });
      } else if (CREATE_MISSING && !REVOKE) {
        const email = (e.workEmail ?? "").trim().toLowerCase();
        if (!EMAIL_RE.test(email)) {
          skipped.push({ employee: e, reason: "no valid work email" });
        } else if (await usersCol.findOne({ email })) {
          skipped.push({ employee: e, reason: `email ${email} already used by another account` });
        } else {
          toCreate.push({ employee: e, email });
        }
      } else if (!REVOKE) {
        skipped.push({ employee: e, reason: "no HRMS portal login (use --create-missing)" });
      }
    }

    const verb = REVOKE ? "Revoke" : "Grant";
    console.log(`\nHRMS employees (eligible): ${eligible.length}${INCLUDE_INACTIVE ? "" : "  — inactive excluded"}`);
    console.log(`${verb} chat_employee on existing logins: ${toGrant.length}`);
    if (CREATE_MISSING && !REVOKE) console.log(`Create new logins:                    ${toCreate.length}`);
    console.log(`Skipped:                              ${skipped.length}`);

    if (!APPLY) {
      console.log(`\n(dry run — re-run with \`-- --apply\` to write)\n`);
      for (const { employee, user } of toGrant.slice(0, 100)) console.log(`  ${verb.toLowerCase()}  ${user.email}  (${fullName(employee)})`);
      for (const { employee, email } of toCreate.slice(0, 100)) console.log(`  create  ${email}  (${fullName(employee)})`);
      for (const { employee, reason } of skipped.slice(0, 40)) console.log(`  skip    ${fullName(employee)} — ${reason}`);
      return;
    }

    // --- apply -------------------------------------------------------------
    let granted = 0;
    for (const { user } of toGrant) {
      const roles = Array.isArray(user.roles) ? user.roles : [];
      const next = REVOKE
        ? roles.filter((r) => r !== "chat_employee")
        : Array.from(new Set([...roles, "chat_employee"]));
      await usersCol.updateOne({ _id: user._id }, { $set: { roles: next } });
      granted++;
    }

    const created = [];
    for (const { employee, email } of toCreate) {
      const tempPassword = generateTempPassword();
      const now = new Date();
      await usersCol.insertOne({
        email,
        passwordHash: hashPassword(tempPassword),
        failedLoginAttempts: 0,
        lockedUntil: null,
        createdAt: now,
        lastLoginAt: null,
        roles: ["employee", "chat_employee"],
        employeeId: String(employee._id),
        mustChangePassword: true,
      });
      await employeesCol.updateOne({ _id: employee._id }, { $set: { adminUserId: email } });
      created.push({ name: fullName(employee), email, tempPassword });
    }

    // --- sync chat_users projection for everyone who now has access --------
    if (!REVOKE) {
      const withAccess = await usersCol.find({ roles: "chat_employee" }).toArray();
      const now = new Date();
      for (const u of withAccess) {
        await chatUsersCol.updateOne(
          { _id: String(u._id) },
          {
            $set: {
              email: u.email,
              displayName: u.chatDisplayName?.trim() || nameFromEmail(u.email),
              avatarUrl: u.chatAvatarUrl ?? null,
              roles: (u.roles ?? []).filter((r) =>
                ["super_admin", "chat_admin", "chat_pm", "chat_hr", "chat_employee"].includes(r)
              ),
              employeeId: u.employeeId ?? null,
              updatedAt: now,
              deletedAt: null,
            },
            $setOnInsert: {
              title: null,
              department: null,
              soundEnabled: true,
              presenceDefault: "online",
              pinnedConversationIds: [],
              starredMessageIds: [],
              mutedChannelIds: [],
              createdAt: now,
            },
          },
          { upsert: true }
        );
      }
    } else {
      await chatUsersCol.updateMany(
        { _id: { $in: toGrant.map(({ user }) => String(user._id)) } },
        { $set: { deletedAt: new Date() } }
      );
    }

    console.log(`\n✓ ${REVOKE ? "Revoked" : "Granted"} chat_employee on ${granted} login(s).`);
    if (created.length > 0) {
      console.log(`✓ Created ${created.length} new login(s) — temporary passwords (shown once):\n`);
      console.log("  " + "NAME".padEnd(28) + "EMAIL".padEnd(36) + "TEMP PASSWORD");
      for (const c of created) {
        console.log("  " + c.name.padEnd(28) + c.email.padEnd(36) + c.tempPassword);
      }
      console.log(`\n  Each user must change their password on first sign-in at /messenger/login.`);
    }
    console.log(`\nSign-in: /messenger/login`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
