#!/usr/bin/env node
import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "node:crypto";

const SCRYPT_KEYLEN = 64;

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

async function seedSuperAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ Error: Missing MONGODB_URI environment variable.");
    console.error("Run with: node --env-file=.env scripts/seed-super-admin.mjs");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  let adminEmail = "info@yashorbit.com";
  let adminPassword = "YashOrbit#2026";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email" && args[i + 1]) {
      adminEmail = args[i + 1].trim().toLowerCase();
    }
    if (args[i] === "--password" && args[i + 1]) {
      adminPassword = args[i + 1].trim();
    }
  }

  console.log("--------------------------------------------------");
  console.log("👑 SYSTEM SUPER ADMIN SEEDER");
  console.log("--------------------------------------------------");
  console.log("Connecting to MongoDB...");

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    const adminUsersCol = db.collection("admin_users");
    await adminUsersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});

    const passwordHash = hashPassword(adminPassword);

    const superAdminDoc = {
      email: adminEmail,
      passwordHash: passwordHash,
      roles: ["super_admin"],
      permissionOverrides: {},
      userType: "system",
      notes: "System Super Admin Account initialized with executive privileges",
      employeeId: null,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
      updatedAt: new Date(),
    };

    const result = await adminUsersCol.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: superAdminDoc,
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    const userObj = result.value ?? result;

    console.log("--------------------------------------------------");
    console.log("✅ SYSTEM SUPER ADMIN SEEDED / ENSURED");
    console.log("--------------------------------------------------");
    console.log(`  • ID:       ${userObj._id ?? userObj.insertedId}`);
    console.log(`  • Email:    ${adminEmail}`);
    console.log(`  • Password: ${adminPassword}`);
    console.log(`  • Roles:    super_admin (Full Executive Access across 10 Panels)`);
    console.log(`  • Category: system`);
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("❌ Super Admin Seeder failed with error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedSuperAdmin();
