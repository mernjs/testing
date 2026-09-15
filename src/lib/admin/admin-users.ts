import "server-only";
import { randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { escapeRegExp } from "@/lib/text-search";
import { hashPassword } from "@/lib/lms-auth";

/**
 * Super Admin management of the shared `admin_users` collection — the
 * identity store every internal panel (HRMS/PMS/PRMS/TMS/YashChat/LMS/Admin)
 * reads its login and `roles` array from. There is no existing in-app
 * surface for this anywhere: role grants are currently CLI-only
 * (`scripts/grant-*-role.mjs`). This is the first — treat it carefully:
 * every write here changes who can access what, across the whole ERP.
 */

export const ADMIN_USERS_COLLECTION = "admin_users";
const SCRYPT_TEMP_PASSWORD_LENGTH = 12;

export interface AdminUserDoc {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  roles?: string[];
  employeeId?: string | null;
  mustChangePassword?: boolean;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
  createdAt: Date;
  lastLoginAt?: Date | null;
}

export interface AdminUserRow {
  _id: string;
  email: string;
  roles: string[];
  employeeId: string | null;
  mustChangePassword: boolean;
  locked: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

function serialize(u: AdminUserDoc): AdminUserRow {
  return {
    _id: u._id.toString(),
    email: u.email,
    roles: u.roles ?? [],
    employeeId: u.employeeId ?? null,
    mustChangePassword: u.mustChangePassword === true,
    locked: Boolean(u.lockedUntil && u.lockedUntil > new Date()),
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
  };
}

async function collection() {
  const db = await getDb();
  return db.collection<AdminUserDoc>(ADMIN_USERS_COLLECTION);
}

function generateTempPassword(): string {
  return randomBytes(9).toString("base64url").slice(0, SCRYPT_TEMP_PASSWORD_LENGTH);
}

export interface AdminUserFilter {
  search?: string;
  role?: string;
}

function buildFilter(opts: AdminUserFilter): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (opts.search?.trim()) {
    const rx = new RegExp(escapeRegExp(opts.search.trim()), "i");
    filter.email = rx;
  }
  if (opts.role) filter.roles = opts.role;
  return filter;
}

export interface SearchAdminUsersOptions extends AdminUserFilter {
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "email" | "lastLoginAt";
  sortDir?: "asc" | "desc";
}

export async function searchAdminUsers(opts: SearchAdminUsersOptions = {}) {
  const col = await collection();
  const page = Math.max(opts.page ?? 1, 1);
  const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
  const filter = buildFilter(opts);
  const sortField = opts.sortBy ?? "createdAt";
  const sortDir = opts.sortDir === "asc" ? 1 : -1;

  const [docs, total] = await Promise.all([
    col.find(filter).sort({ [sortField]: sortDir }).skip((page - 1) * pageSize).limit(pageSize).toArray(),
    col.countDocuments(filter),
  ]);

  return {
    items: docs.map(serialize),
    total,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}

export async function exportAdminUsers(opts: AdminUserFilter & { ids?: string[] } = {}): Promise<AdminUserRow[]> {
  const col = await collection();
  const filter =
    opts.ids && opts.ids.length > 0
      ? { _id: { $in: opts.ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } }
      : buildFilter(opts);
  const docs = await col.find(filter).sort({ createdAt: -1 }).limit(5000).toArray();
  return docs.map(serialize);
}

export async function getAdminUserRow(id: string): Promise<AdminUserRow | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

export interface CreateAdminUserResult {
  ok: boolean;
  error?: string;
  id?: string;
  tempPassword?: string;
}

export async function createAdminUser(email: string, roles: string[]): Promise<CreateAdminUserResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return { ok: false, error: "Enter a valid email address." };

  const col = await collection();
  const existing = await col.findOne({ email: normalizedEmail });
  if (existing) return { ok: false, error: "An account with this email already exists." };

  const tempPassword = generateTempPassword();
  const doc: AdminUserDoc = {
    _id: new ObjectId(),
    email: normalizedEmail,
    passwordHash: hashPassword(tempPassword),
    roles,
    employeeId: null,
    mustChangePassword: true,
    failedLoginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(),
    lastLoginAt: null,
  };
  await col.insertOne(doc);
  return { ok: true, id: doc._id.toString(), tempPassword };
}

/**
 * `actorId` is always the calling super_admin's own id, checked here so a
 * super_admin can never strip their own `super_admin` role through this UI —
 * the one way to lock every admin out of `/admin` for good.
 */
export async function updateAdminUserRoles(
  id: string,
  roles: string[],
  actorId: string
): Promise<{ ok: boolean; error?: string }> {
  if (!ObjectId.isValid(id)) return { ok: false, error: "Unknown account." };
  if (id === actorId && !roles.includes("super_admin")) {
    return { ok: false, error: "You can't remove your own Super Admin role." };
  }
  const col = await collection();
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: { roles } });
  return { ok: res.matchedCount === 1 };
}

export interface ResetPasswordResult {
  ok: boolean;
  error?: string;
  tempPassword?: string;
}

export async function resetAdminUserPassword(id: string): Promise<ResetPasswordResult> {
  if (!ObjectId.isValid(id)) return { ok: false, error: "Unknown account." };
  const col = await collection();
  const tempPassword = generateTempPassword();
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        passwordHash: hashPassword(tempPassword),
        mustChangePassword: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }
  );
  if (res.matchedCount !== 1) return { ok: false, error: "Unknown account." };
  return { ok: true, tempPassword };
}

/** Clears every role — the account can no longer sign into any panel. There's
 * no account-level delete anywhere in the app (only per-module role revoke
 * via the CLI scripts), so this mirrors that: access removed, record kept. */
export async function deactivateAdminUser(id: string, actorId: string): Promise<{ ok: boolean; error?: string }> {
  if (!ObjectId.isValid(id)) return { ok: false, error: "Unknown account." };
  if (id === actorId) return { ok: false, error: "You can't deactivate your own account." };
  const col = await collection();
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: { roles: [] } });
  return { ok: res.matchedCount === 1 };
}
