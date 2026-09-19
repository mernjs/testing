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

import { destroySessionsEverywhere } from "@/lib/cross-module-sso";
import { type AdminUserRow, type PanelAccessSummaryItem, getPanelAccessSummary } from "@/lib/admin/admin-users-shared";

export type { AdminUserRow, PanelAccessSummaryItem };
export { getPanelAccessSummary };

export const ADMIN_USERS_COLLECTION = "admin_users";
const SCRYPT_TEMP_PASSWORD_LENGTH = 12;

export interface AdminUserDoc {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  roles?: string[];
  /**
   * Per-capability overrides on top of `roles`, keyed `"<module>.<predicateName>"`
   * (e.g. `"pms.canManageProjects"`) — see `src/lib/permission-overrides.ts`.
   * `true` = explicit grant, `false` = explicit deny, key absent = default
   * role-based behavior. Inert on any account holding `super_admin`.
   */
  permissionOverrides?: Record<string, boolean>;
  employeeId?: string | null;
  mustChangePassword?: boolean;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
  createdAt: Date;
  lastLoginAt?: Date | null;
  savedRoles?: string[];
  userType?: "employee" | "contractor" | "partner" | "system";
  notes?: string;
}

function serialize(u: AdminUserDoc): AdminUserRow {
  const roles = u.roles ?? [];
  return {
    _id: u._id.toString(),
    email: u.email,
    roles,
    permissionOverrides: u.permissionOverrides ?? {},
    employeeId: u.employeeId ?? null,
    mustChangePassword: u.mustChangePassword === true,
    locked: Boolean(u.lockedUntil && u.lockedUntil > new Date()),
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
    status: roles.length > 0 ? "active" : "deactivated",
    savedRoles: u.savedRoles ?? [],
    userType: u.userType ?? "employee",
    notes: u.notes ?? "",
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

export async function createAdminUser(
  email: string,
  roles: string[],
  userType?: "employee" | "contractor" | "partner" | "system",
  notes?: string
): Promise<CreateAdminUserResult> {
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
    userType: userType ?? "employee",
    notes: notes?.trim() || undefined,
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

/**
 * Full-replace write for `permissionOverrides`, mirroring `updateAdminUserRoles`'s
 * shape. Key validation against the known permission catalog happens one layer
 * up, in the admin server action (same "filter against the known-good list"
 * precedent `sanitizeRoles()` uses for roles) — this function trusts its input.
 * No self-protection guard is needed here: overrides are inert on any account
 * holding `super_admin` (see `resolvePermission` in `permission-overrides.ts`),
 * so a super_admin can never lock themselves — or another super_admin — out via
 * a bad override.
 */
export async function updateAdminUserPermissionOverrides(
  id: string,
  overrides: Record<string, boolean>
): Promise<{ ok: boolean; error?: string }> {
  if (!ObjectId.isValid(id)) return { ok: false, error: "Unknown account." };
  const col = await collection();
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: { permissionOverrides: overrides } });
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

/**
 * Clears every role and saves current roles to `savedRoles` for restoration.
 * Also immediately terminates all active sessions across all panels.
 */
export async function deactivateAdminUser(id: string, actorId: string): Promise<{ ok: boolean; error?: string }> {
  if (!ObjectId.isValid(id)) return { ok: false, error: "Unknown account." };
  if (id === actorId) return { ok: false, error: "You can't deactivate your own account." };
  const col = await collection();
  const existing = await col.findOne({ _id: new ObjectId(id) });
  if (!existing) return { ok: false, error: "Account not found." };

  const currentRoles = existing.roles ?? [];
  const updateData: Record<string, unknown> = { roles: [] };
  if (currentRoles.length > 0) {
    updateData.savedRoles = currentRoles;
  }

  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  if (res.matchedCount === 1) {
    try {
      await destroySessionsEverywhere(new ObjectId(id));
    } catch (e) {
      console.error("Failed to revoke sessions on deactivation:", e);
    }
  }
  return { ok: res.matchedCount === 1 };
}

export async function reactivateAdminUser(
  id: string,
  rolesToRestore?: string[]
): Promise<{ ok: boolean; error?: string }> {
  if (!ObjectId.isValid(id)) return { ok: false, error: "Unknown account." };
  const col = await collection();
  const existing = await col.findOne({ _id: new ObjectId(id) });
  if (!existing) return { ok: false, error: "Account not found." };

  const roles =
    rolesToRestore && rolesToRestore.length > 0
      ? rolesToRestore
      : existing.savedRoles && existing.savedRoles.length > 0
      ? existing.savedRoles
      : ["employee"];

  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: { roles },
      $unset: { savedRoles: "" },
    }
  );
  return { ok: res.matchedCount === 1 };
}

export async function setUserTypeAndNotes(
  id: string,
  userType: "employee" | "contractor" | "partner" | "system",
  notes?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!ObjectId.isValid(id)) return { ok: false, error: "Unknown account." };
  const col = await collection();
  const updatePayload: Record<string, unknown> = { userType };
  if (notes !== undefined) {
    updatePayload.notes = notes.trim();
  }
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: updatePayload });
  return { ok: res.matchedCount === 1 };
}
