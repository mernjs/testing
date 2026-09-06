#!/usr/bin/env node
// Grant (or revoke) HRMS panel access for an account. Run with:
//   npm run hrms:grant
//
// HRMS users live in the SAME `admin_users` collection as the marketing-admin
// panel — this script just sets the `roles` array (and optional `employeeId`).
// If the email doesn't exist yet it can create the account with a password.
// This is the ONLY way HRMS access is granted; there is no self-registration.

import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "node:crypto";
import { stdin, stdout } from "node:process";

const SCRYPT_KEYLEN = 64;
const MIN_PASSWORD_LENGTH = 10;
const HRMS_ROLES = ["super_admin", "hr", "manager", "employee"];
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
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/grant-hrms-role.mjs");
    process.exit(1);
  }

  const email = (await askLine("Account email: ")).trim().toLowerCase();
  if (!isValidEmail(email)) {
    console.error("That doesn't look like a valid email address.");
    process.exit(1);
  }

  const rolesRaw = await askLine(`Roles (comma-separated: ${HRMS_ROLES.join(", ")} — blank to REVOKE all HRMS access): `);
  const roles = Array.from(
    new Set(
      rolesRaw
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    )
  );
  const invalid = roles.filter((r) => !HRMS_ROLES.includes(r));
  if (invalid.length > 0) {
    console.error(`Unknown role(s): ${invalid.join(", ")}`);
    process.exit(1);
  }

  const employeeId = (await askLine("Linked employee id (optional, blank for none): ")).trim() || null;

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection("admin_users");
    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne({ email });
    if (existing) {
      await users.updateOne({ _id: existing._id }, { $set: { roles, employeeId } });
      console.log(
        roles.length > 0
          ? `\nUpdated ${email}: roles = [${roles.join(", ")}]${employeeId ? `, employeeId = ${employeeId}` : ""}.`
          : `\nRevoked all HRMS access for ${email}.`
      );
      console.log("They can sign in at /hrms/login.");
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
      employeeId,
    });
    console.log(`\nCreated account ${email} with roles [${roles.join(", ")}].`);
    console.log("They can sign in at /hrms/login.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
