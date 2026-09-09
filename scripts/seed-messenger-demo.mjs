#!/usr/bin/env node
/**
 * Messenger workspace bootstrap.
 *
 *   npm run chat:seed-demo
 *
 * NON-DESTRUCTIVE. Creates the seven standard org-wide team channels if they
 * are missing and back-fills a `chat_users` profile row for every `admin_users`
 * account that already carries a Messenger role. It writes **no messages** —
 * the workspace starts empty, exactly as a real deployment would.
 *
 * Grant access first with `npm run chat:grant`, then sign in at
 * /messenger/login.
 */

import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";

const CHAT_ROLES = ["super_admin", "chat_admin", "chat_pm", "chat_hr", "chat_employee"];

const STANDARD_CHANNELS = [
  { slug: "general", name: "general", description: "Company-wide conversation. Everyone is here." },
  { slug: "announcement", name: "announcement", description: "Official announcements. Post access is restricted." },
  { slug: "development", name: "development", description: "Engineering discussion, deploys, incidents." },
  { slug: "design", name: "design", description: "Product & brand design, reviews, critique." },
  { slug: "marketing", name: "marketing", description: "Campaigns, content, launches." },
  { slug: "hr", name: "hr", description: "People ops, policies, benefits, hiring." },
  { slug: "support", name: "support", description: "Customer support escalations and shared context." },
];

const now = new Date();

function stamp() {
  return { createdAt: now, updatedAt: now, createdBy: null, updatedBy: null, deletedAt: null };
}

function nameFromEmail(email) {
  const local = (email.split("@")[0] ?? email).replace(/[._-]+/g, " ").replace(/\d+/g, " ").trim();
  const words = local.split(/\s+/).filter(Boolean);
  return words.length ? words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") : email;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Run with: node --env-file=.env scripts/seed-messenger-demo.mjs");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    const channels = db.collection("chat_channels");
    const members = db.collection("channel_members");
    const chatUsers = db.collection("chat_users");
    const adminUsers = db.collection("admin_users");

    await channels.createIndex({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } }).catch(() => {});
    await members.createIndex({ channelId: 1, userId: 1 }, { unique: true }).catch(() => {});
    await chatUsers.createIndex({ email: 1 }, { unique: true }).catch(() => {});

    // 1. Messenger users projected from admin_users.
    const roleHolders = await adminUsers.find({ roles: { $in: CHAT_ROLES } }).toArray();
    let userCount = 0;
    for (const u of roleHolders) {
      const id = String(u._id);
      const roles = Array.from(new Set((u.roles ?? []).filter((r) => CHAT_ROLES.includes(r))));
      await chatUsers.updateOne(
        { _id: id },
        {
          $set: {
            email: u.email,
            displayName: u.chatDisplayName?.trim() || nameFromEmail(u.email),
            avatarUrl: u.chatAvatarUrl ?? null,
            roles,
            employeeId: u.employeeId ?? null,
            title: null,
            department: null,
            updatedAt: now,
            deletedAt: null,
          },
          $setOnInsert: {
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
      userCount += 1;
    }

    if (userCount === 0) {
      console.warn(
        "\n⚠  No accounts carry a Messenger role yet. Run `npm run chat:grant` first, then re-run this seeder."
      );
    }

    // 2. Standard team channels. Everyone with a Messenger role joins #general;
    //    the rest are created empty for people to join.
    const generalMemberIds = roleHolders.map((u) => String(u._id));
    let created = 0;
    for (const spec of STANDARD_CHANNELS) {
      const existing = await channels.findOne({ slug: spec.slug, deletedAt: null });
      if (existing) continue;
      const channelId = randomUUID();
      await channels.insertOne({
        _id: channelId,
        kind: "team",
        slug: spec.slug,
        name: spec.name,
        description: spec.description,
        topic: null,
        avatarUrl: null,
        visibility: "public",
        projectId: null,
        pinnedMessageIds: [],
        archivedAt: null,
        lastActivityAt: now,
        lastMessagePreview: null,
        ...stamp(),
      });
      created += 1;

      if (spec.slug === "general" && generalMemberIds.length > 0) {
        await members.insertMany(
          generalMemberIds.map((userId, i) => ({
            _id: randomUUID(),
            channelId,
            userId,
            role: i === 0 ? "owner" : "member",
            joinedAt: now,
            lastReadSeq: 0,
            mutedUntil: null,
            notificationPref: "all",
            ...stamp(),
          }))
        );
      }
    }

    console.log(`\nMessenger workspace ready.`);
    console.log(`  · ${userCount} user profile(s) synced`);
    console.log(`  · ${created} standard channel(s) created (${STANDARD_CHANNELS.length - created} already existed)`);
    console.log(`\nSign in at /messenger/login.`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
