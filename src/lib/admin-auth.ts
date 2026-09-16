import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { verifyPassword, hashPassword } from "@/lib/lms-auth";
import { ADMIN_ROLES, normalizeAdminRoles, hasAdminAccess, type AdminRole } from "@/lib/admin-roles";

/**
 * Super Admin Command Center authentication. A separate cookie / session
 * store from every other panel so sign-in state is independent, but the
 * *identity* store is shared: users live in `admin_users`, and Command Center
 * access is gated on the `roles` array there (`super_admin` only). Mirrors
 * `src/lib/pms-auth.ts`.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface AdminUserDoc {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  lastLoginAt: Date | null;
  roles?: string[];
  employeeId?: string | null;
  mustChangePassword?: boolean;
}

interface AdminSessionDoc {
  _id: ObjectId;
  tokenHash: string;
  adminId: ObjectId;
  createdAt: Date;
  expiresAt: Date;
}

export interface CurrentAdminUser {
  id: string;
  email: string;
  roles: AdminRole[];
  mustChangePassword: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
}

let userIndexEnsured = false;
let sessionIndexEnsured = false;

async function getAdminUsersCollection() {
  const db = await getDb();
  const collection = db.collection<AdminUserDoc>("admin_users");
  if (!userIndexEnsured) {
    userIndexEnsured = true;
    await collection.createIndex({ email: 1 }, { unique: true }).catch(() => {});
  }
  return collection;
}

async function getAdminSessionsCollection() {
  const db = await getDb();
  const collection = db.collection<AdminSessionDoc>("admin_sessions");
  if (!sessionIndexEnsured) {
    sessionIndexEnsured = true;
    await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});
    await collection.createIndex({ tokenHash: 1 }, { unique: true }).catch(() => {});
  }
  return collection;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<{ ok: true; adminId: ObjectId } | { ok: false; error: string }> {
  const users = await getAdminUsersCollection();
  const normalizedEmail = email.trim().toLowerCase();
  const user = await users.findOne({ email: normalizedEmail });

  // Same generic error for every failure mode so the login form never reveals
  // which accounts exist or which have Command Center access.
  const GENERIC = "Invalid email or password.";

  if (!user) return { ok: false, error: GENERIC };

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { ok: false, error: "Too many failed attempts. Try again in a few minutes." };
  }

  const valid = verifyPassword(password, user.passwordHash);
  if (!valid) {
    const attempts = (user.failedLoginAttempts ?? 0) + 1;
    const lockedUntil = attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : null;
    await users.updateOne({ _id: user._id }, { $set: { failedLoginAttempts: attempts, lockedUntil } });
    return { ok: false, error: GENERIC };
  }

  if (normalizeAdminRoles(user.roles).length === 0) {
    // Correct credentials but no super_admin role — do not count as a failed attempt.
    return { ok: false, error: GENERIC };
  }

  await users.updateOne(
    { _id: user._id },
    { $set: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() } }
  );
  return { ok: true, adminId: user._id };
}

export async function createAdminSession(adminId: ObjectId): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const sessions = await getAdminSessionsCollection();
  await sessions.insertOne({
    _id: new ObjectId(),
    tokenHash: hashToken(token),
    adminId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });
  return token;
}

export async function destroyAdminSessionByToken(token: string): Promise<void> {
  const sessions = await getAdminSessionsCollection();
  await sessions.deleteOne({ tokenHash: hashToken(token) });
}

export async function getSessionAdminUser(token: string | undefined | null): Promise<CurrentAdminUser | null> {
  if (!token) return null;
  const sessions = await getAdminSessionsCollection();
  const session = await sessions.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;

  const users = await getAdminUsersCollection();
  const user = await users.findOne({ _id: session.adminId });
  if (!user) return null;

  const roles = normalizeAdminRoles(user.roles);
  // Access can be revoked mid-session by clearing the roles array.
  if (roles.length === 0) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    roles,
    mustChangePassword: user.mustChangePassword === true,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

export async function getCurrentAdminUser(): Promise<CurrentAdminUser | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return getSessionAdminUser(token);
}

/**
 * Server-action / route guard. Throws `Unauthorized` when there is no admin
 * session, or `Forbidden` when the session lacks `super_admin`. Render-time
 * gating on a page is never a security boundary for the mutation endpoint.
 */
export async function requireAdminUser(): Promise<CurrentAdminUser> {
  const user = await getCurrentAdminUser();
  if (!user) throw new Error("Unauthorized");
  if (!hasAdminAccess(user.roles)) throw new Error("Forbidden");
  return user;
}

/**
 * Changes the signed-in user's own password and clears `mustChangePassword`.
 * Minimum length matches the bootstrap script.
 */
export async function changeOwnAdminPassword(
  userId: string,
  current: string,
  next: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (next.length < 10) return { ok: false, error: "New password must be at least 10 characters." };
  if (next === current) return { ok: false, error: "New password must be different from the current one." };
  if (!ObjectId.isValid(userId)) return { ok: false, error: "Unknown account." };

  const users = await getAdminUsersCollection();
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) return { ok: false, error: "Unknown account." };
  if (!verifyPassword(current, user.passwordHash)) return { ok: false, error: "Current password is incorrect." };

  await users.updateOne(
    { _id: user._id },
    { $set: { passwordHash: hashPassword(next), mustChangePassword: false } }
  );
  return { ok: true };
}

export { ADMIN_ROLES };
