#!/usr/bin/env node
/**
 * AI Bots demo seeder (standalone). Creates AI Bots logins and a starter set of bots (as database rows). Safe to re-run.
 *
 *   node --env-file=.env scripts/seed-aibots-demo.mjs        # point MONGODB_URI at a scratch database to avoid the real one
 *
 * Needs OPENAI_API_KEY in the app's environment for the bots to answer (not for seeding). (It also runs as part of `npm run db:seed-demo`.)
 */
import { MongoClient } from "mongodb";
import { seedAibots, AIBOTS_DEMO_ACCOUNTS } from "./demo/aibots.mjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-aibots-demo.mjs");
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(process.env.SEED_DB || undefined);
  console.log(`🌱 AI Bots demo seeder (database: ${db.databaseName})`);
  const res = await seedAibots(db);
  console.log(`   ${res.bots} bots (${res.active} active)`);
  console.log("\nAI Bots demo logins (password for all: Demo@12345) — sign in at /aibots/login");
  for (const a of AIBOTS_DEMO_ACCOUNTS) console.log(`  • ${a.label.padEnd(44)} ${a.email}`);
} catch (err) {
  console.error("❌ AI Bots demo seeder failed:", err);
  process.exitCode = 1;
} finally {
  await client.close();
}
