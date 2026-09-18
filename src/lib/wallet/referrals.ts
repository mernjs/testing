import "server-only";
import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/mongodb";
import { newId, createStamp, updateStamp, notDeleted, type AuditFields } from "@/lib/wallet/db";
import { randomReferralCode, formatCredits, type ReferralStatus } from "@/lib/wallet/constants";
import { creditWallet } from "@/lib/wallet/wallets";
import { resolveActiveRewardRule } from "@/lib/wallet/reward-rules";
import { externalUsers } from "@/lib/portal-auth";
import { notifyPortalUser } from "@/lib/portal/notifications";
import type { RewardRuleAudience } from "@/lib/wallet/constants";

export const REFERRALS_COLLECTION = "referrals";

export interface Referral extends AuditFields {
  _id: string;
  referrerUserId: string;
  referralCode: string;
  refereeUserId: string;
  status: ReferralStatus;
  qualifyingEvent: "account_created";
  rewardTransactionId: { referrer: string | null; referee: string | null };
  qualifiedAt: Date | null;
  rewardedAt: Date | null;
}

export interface SerializedReferral extends Omit<Referral, "createdAt" | "updatedAt" | "deletedAt" | "qualifiedAt" | "rewardedAt"> {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  qualifiedAt: string | null;
  rewardedAt: string | null;
}

export function serializeReferral(r: Referral): SerializedReferral {
  return {
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    deletedAt: r.deletedAt ? r.deletedAt.toISOString() : null,
    qualifiedAt: r.qualifiedAt ? r.qualifiedAt.toISOString() : null,
    rewardedAt: r.rewardedAt ? r.rewardedAt.toISOString() : null,
  };
}

let indexesEnsured = false;

async function getCollection() {
  const db = await getDb();
  const collection = db.collection<Referral>(REFERRALS_COLLECTION);
  if (!indexesEnsured) {
    indexesEnsured = true;
    await Promise.all([
      collection.createIndex({ refereeUserId: 1 }, { unique: true }).catch(() => {}),
      collection.createIndex({ referrerUserId: 1, createdAt: -1 }).catch(() => {}),
    ]);
  }
  return collection;
}

export async function listReferralsForReferrer(referrerUserId: string): Promise<Referral[]> {
  const collection = await getCollection();
  return collection.find({ referrerUserId }).sort({ createdAt: -1 }).toArray();
}

export async function listAllReferrals(limit = 200): Promise<Referral[]> {
  const collection = await getCollection();
  return collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
}

/**
 * Lazily generated on first `/portal/referrals` visit — a random 8-char
 * code, never an internal id. Relies on the unique sparse index on
 * `external_users.referralCode` (added in `portal-auth.ts`): a collision
 * with another user's code throws a duplicate-key error here, caught and
 * retried with a fresh random code; a `modifiedCount === 0` with no throw
 * means this account already got a code from a concurrent call, so just
 * re-read it.
 */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const users = await externalUsers();
  const existing = await users.findOne({ _id: userId });
  if (existing?.referralCode) return existing.referralCode;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomReferralCode(randomBytes(8));
    try {
      const res = await users.updateOne({ _id: userId, referralCode: { $in: [null, undefined] } }, { $set: { referralCode: code } });
      if (res.modifiedCount === 1) return code;
      const refreshed = await users.findOne({ _id: userId });
      if (refreshed?.referralCode) return refreshed.referralCode;
    } catch {
      continue; // duplicate-key on referralCode — another account already has this code, retry with a new one
    }
  }
  throw new Error("Could not generate a referral code — please try again.");
}

/**
 * Attribution + qualification, in one call, right after a brand-new account
 * is created (`isNewAccount === true` in `provisionLeadAndAccount`/
 * `registerExternalUser`). Phase 1's qualifying event IS account creation —
 * the one real signal that exists today — so both sides are rewarded
 * immediately. Self-referral is rejected. Rejects silently (no throw) on any
 * invalid/missing code so a bad `?ref=` param never blocks a real signup.
 */
export async function attributeAndRewardReferral(
  referralCodeRaw: string | null | undefined,
  refereeUserId: string,
  refereeRole: RewardRuleAudience
): Promise<void> {
  const code = referralCodeRaw?.trim().toUpperCase();
  if (!code) return;

  const users = await externalUsers();
  const referrer = await users.findOne({ referralCode: code });
  if (!referrer) return; // unknown/stale code — silently ignore
  if (referrer._id === refereeUserId) return; // self-referral

  const collection = await getCollection();
  const now = new Date();
  const referral: Referral = {
    _id: newId(),
    referrerUserId: referrer._id,
    referralCode: code,
    refereeUserId,
    status: "REGISTERED",
    qualifyingEvent: "account_created",
    rewardTransactionId: { referrer: null, referee: null },
    qualifiedAt: null,
    rewardedAt: null,
    ...createStamp(null),
  };

  try {
    await collection.insertOne(referral);
  } catch {
    return; // unique index on refereeUserId — this account was already attributed once
  }

  await collection.updateOne({ _id: referral._id }, { $set: { status: "QUALIFIED", qualifiedAt: now } });

  const referrerRule = await resolveActiveRewardRule("referral_referrer", referrer.role as RewardRuleAudience);
  const refereeRule = await resolveActiveRewardRule("referral_referee", refereeRole);

  let referrerTxId: string | null = null;
  let refereeTxId: string | null = null;

  if (referrerRule) {
    const tx = await creditWallet({
      userId: referrer._id,
      role: referrer.role,
      type: "referral_bonus_referrer",
      amount: referrerRule.amount,
      idempotencyKey: `referral_referrer:${referral._id}`,
      expiresInDays: referrerRule.expiresInDays,
      referenceType: "referral",
      referenceId: referral._id,
    });
    referrerTxId = tx?._id ?? null;
    if (tx) {
      await notifyPortalUser({
        recipientUserId: referrer._id,
        type: "wallet.referral_rewarded",
        title: "🎉 Your referral qualified",
        body: `You earned ${formatCredits(referrerRule.amount)} for a successful referral.`,
        link: "/portal/referrals",
        dedupeKey: `wallet.referral_referrer:${referral._id}`,
      });
    }
  }

  if (refereeRule) {
    const tx = await creditWallet({
      userId: refereeUserId,
      role: refereeRole,
      type: "referral_bonus_referee",
      amount: refereeRule.amount,
      idempotencyKey: `referral_referee:${referral._id}`,
      expiresInDays: refereeRule.expiresInDays,
      referenceType: "referral",
      referenceId: referral._id,
    });
    refereeTxId = tx?._id ?? null;
    if (tx) {
      await notifyPortalUser({
        recipientUserId: refereeUserId,
        type: "wallet.credit_earned",
        title: "🎉 Referral welcome bonus",
        body: `You earned ${formatCredits(refereeRule.amount)} for joining via a referral.`,
        link: "/portal/wallet",
        dedupeKey: `wallet.referral_referee:${referral._id}`,
      });
    }
  }

  await collection.updateOne(
    { _id: referral._id },
    { $set: { status: "REWARDED", rewardedAt: new Date(), rewardTransactionId: { referrer: referrerTxId, referee: refereeTxId }, ...updateStamp(null) } }
  );
}
