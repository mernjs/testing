#!/usr/bin/env node
// Grant (or revoke) TMS panel access for an account. Run with:
//   npm run tms:grant
//
// TMS users live in the SAME `admin_users` collection as the LMS / HRMS / PMS
// panels — this script just sets the `roles` array. If the email doesn't exist
// yet it can create the account with a password. This is the ONLY way TMS
// staff access is granted; there is no self-registration. `training_student`
// logins are created in-panel from the student profile (Phase 4), not here.

import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "node:crypto";
import { stdin, stdout } from "node:process";

const SCRYPT_KEYLEN = 64;
const MIN_PASSWORD_LENGTH = 10;
const TMS_ROLES = ["super_admin", "tms_admin", "tms_manager", "mentor", "training_student"];
const CTRL_C = String.fromCharCode(3);
const BACKSPACE = String.fromCharCode(127);

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

let pipedBuffer = "";
function askLine(prompt, { hidden = false } = {}) {
  stdout.write(prompt);
  if (!stdin.isTTY) {
    return new Promise((resolve) => {
      const tryResolve = () => {
        const i = pipedBuffer.indexOf("\n");
        if (i === -1) return false;
        const line = pipedBuffer.slice(0, i).replace(/\r$/, "");
        pipedBuffer = pipedBuffer.slice(i + 1);
        resolve(line);
        return true;
      };
      if (tryResolve()) return;
      const onData = (chunk) => {
        pipedBuffer += chunk.toString("utf8");
        if (tryResolve()) stdin.removeListener("data", onData);
      };
      stdin.resume();
      stdin.on("data", onData);
    });
  }
  return new Promise((resolve) => {
    let input = "";
    const onData = (chunk) => {
      const char = chunk.toString("utf8");
      if (char === "\n" || char === "\r") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        stdout.write("\n");
        resolve(input);
        return;
      }
      if (char === CTRL_C) {
        stdout.write("\n");
        process.exit(1);
      }
      if (char === BACKSPACE || char === "\b") {
        if (input.length > 0) {
          input = input.slice(0, -1);
          stdout.write("\b \b");
        }
        return;
      }
      input += char;
      stdout.write(hidden ? "*" : char);
    };
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/grant-tms-role.mjs");
    process.exit(1);
  }

  const email = (await askLine("Account email: ")).trim().toLowerCase();
  if (!isValidEmail(email)) {
    console.error("That doesn't look like a valid email address.");
    process.exit(1);
  }

  const rolesRaw = await askLine(`Roles (comma-separated: ${TMS_ROLES.join(", ")} — blank to REVOKE all TMS access): `);
  const roles = Array.from(
    new Set(
      rolesRaw
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    )
  );
  const invalid = roles.filter((r) => !TMS_ROLES.includes(r));
  if (invalid.length > 0) {
    console.error(`Unknown role(s): ${invalid.join(", ")}`);
    process.exit(1);
  }

  // mentor accounts link to an hrms_employees record so classes / projects /
  // reviews can be scoped to that person.
  let employeeId = null;
  if (roles.includes("mentor")) {
    employeeId = (await askLine("Linked hrms_employees id (required for mentor): ")).trim();
    if (!employeeId) {
      console.error("An employee id is required when granting mentor.");
      process.exit(1);
    }
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection("admin_users");
    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne({ email });

    // Merge TMS roles into the existing roles array without disturbing
    // HRMS / PMS-only roles the account may already carry.
    const KEEP = new Set(["hr", "manager", "employee", "pms_admin", "pms_manager", "pms_employee"]);

    if (existing) {
      const kept = (existing.roles ?? []).filter((r) => KEEP.has(r) || r === "super_admin");
      const nextRoles = Array.from(new Set([...kept.filter((r) => r !== "super_admin"), ...roles]));
      if ((existing.roles ?? []).includes("super_admin") && !roles.includes("super_admin")) {
        nextRoles.push("super_admin");
      }
      const set = { roles: Array.from(new Set(nextRoles)) };
      if (employeeId) set.employeeId = employeeId;
      await users.updateOne({ _id: existing._id }, { $set: set });
      console.log(
        roles.length > 0
          ? `\nUpdated ${email}: roles = [${Array.from(new Set(nextRoles)).join(", ")}].`
          : `\nRevoked TMS access for ${email}. Remaining roles: [${Array.from(new Set(nextRoles)).join(", ")}].`
      );
      console.log("They can sign in at /tms/login.");
      return;
    }

    if (roles.length === 0) {
      console.error(`No account for "${email}" and no roles given — nothing to do.`);
      process.exit(1);
    }

    const password = await askLine(`New account — set a password (min ${MIN_PASSWORD_LENGTH} chars): `, { hidden: true });
    if (password.length < MIN_PASSWORD_LENGTH) {
      console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      process.exit(1);
    }
    const confirm = await askLine("Confirm password: ", { hidden: true });
    if (password !== confirm) {
      console.error("Passwords do not match.");
      process.exit(1);
    }

    await users.insertOne({
      email,
      passwordHash: hashPassword(password),
      failedLoginAttempts: 0,
      lockedUntil: null,
      createdAt: new Date(),
      lastLoginAt: null,
      roles,
      ...(employeeId ? { employeeId } : {}),
    });
    console.log(`\nCreated account ${email} with roles [${roles.join(", ")}].`);
    console.log("They can sign in at /tms/login.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
