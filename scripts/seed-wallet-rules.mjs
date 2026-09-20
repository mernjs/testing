#!/usr/bin/env node
// Seeds default Wallet reward rules (idempotent: skips a type+role that already has a live rule).
// Run: npm run db:seed-wallet-rules
import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-wallet-rules.mjs");
  process.exit(1);
}

const DEFAULTS = [
  { type: "signup", appliesToRole: "ALL", amount: 100, expiresInDays: 90 },
  { type: "referral_referrer", appliesToRole: "ALL", amount: 250, expiresInDays: 180 },
  { type: "referral_referee", appliesToRole: "ALL", amount: 150, expiresInDays: 90 },
];

// Usage rules: where credits may be spent. Festival Offers is open by default; training fees and client invoices are opt-in, so seed them (up to 50% of the amount due).
const USAGE = [
  { module: "training", appliesToRole: "ALL", isEnabled: true, maxPercentOfPrice: 50, maxCreditsPerTransaction: null, minOrderValue: null },
  { module: "projects", appliesToRole: "ALL", isEnabled: true, maxPercentOfPrice: 50, maxCreditsPerTransaction: null, minOrderValue: null },
];

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("wallet_reward_rules");
  for (const d of DEFAULTS) {
    const exists = await col.findOne({ type: d.type, appliesToRole: d.appliesToRole, deletedAt: null });
    if (exists) {
      console.log(`skip  ${d.type}/${d.appliesToRole} (exists)`);
      continue;
    }
    const now = new Date();
    await col.insertOne({ _id: randomUUID(), ...d, isActive: true, createdAt: now, updatedAt: now, createdBy: null, updatedBy: null, deletedAt: null });
    console.log(`added ${d.type}/${d.appliesToRole} = ${d.amount}`);
  }
  const usage = client.db().collection("wallet_usage_rules");
  for (const u of USAGE) {
    if (await usage.findOne({ module: u.module, appliesToRole: u.appliesToRole, deletedAt: null })) {
      console.log(`skip  usage ${u.module}/${u.appliesToRole} (exists)`);
      continue;
    }
    const now = new Date();
    await usage.insertOne({ _id: randomUUID(), ...u, createdAt: now, updatedAt: now, createdBy: null, updatedBy: null, deletedAt: null });
    console.log(`added usage ${u.module}/${u.appliesToRole} = ${u.maxPercentOfPrice}%`);
  }
} finally {
  await client.close();
}
