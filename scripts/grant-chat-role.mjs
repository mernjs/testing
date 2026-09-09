#!/usr/bin/env node
// Grant (or revoke) Messenger panel access for an account. Run with:
//   npm run chat:grant
//
// Messenger users live in the SAME `admin_users` collection as the LMS / HRMS /
// PMS / TMS / PRMS panels — this script just sets the `roles` array. If the
// email doesn't exist yet it can create the account with a password. This is
// the ONLY way Messenger access is granted; there is no self-registration.

import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "node:crypto";
import { stdin, stdout } from "node:process";

const SCRYPT_KEYLEN = 64;
const MIN_PASSWORD_LENGTH = 10;
const CHAT_ROLES = ["super_admin", "chat_admin", "chat_pm", "chat_hr", "chat_employee"];
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
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/grant-chat-role.mjs");
    process.exit(1);
  }

  const email = (await askLine("Account email: ")).trim().toLowerCase();
  if (!isValidEmail(email)) {
    console.error("That doesn't look like a valid email address.");
    process.exit(1);
  }

  const rolesRaw = await askLine(`Roles (comma-separated: ${CHAT_ROLES.join(", ")} — blank to REVOKE all Messenger access): `);
  const roles = Array.from(
    new Set(
      rolesRaw
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    )
  );
  const invalid = roles.filter((r) => !CHAT_ROLES.includes(r));
  if (invalid.length > 0) {
    console.error(`Unknown role(s): ${invalid.join(", ")}`);
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection("admin_users");
    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne({ email });

    // Merge Messenger roles into the existing roles array without disturbing
    // roles from other panels the account may already carry.
    const CHAT_ONLY = new Set(CHAT_ROLES.filter((r) => r !== "super_admin"));

    if (existing) {
      const kept = (existing.roles ?? []).filter((r) => !CHAT_ONLY.has(r));
      const nextRoles = Array.from(new Set([...kept, ...roles]));
      await users.updateOne({ _id: existing._id }, { $set: { roles: nextRoles } });
      console.log(
        roles.length > 0
          ? `\nUpdated ${email}: roles = [${nextRoles.join(", ")}].`
          : `\nRevoked Messenger access for ${email}. Remaining roles: [${nextRoles.join(", ")}].`
      );
      console.log("They can sign in at /messenger/login.");
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
    });
    console.log(`\nCreated account ${email} with roles [${roles.join(", ")}].`);
    console.log("They can sign in at /messenger/login.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
