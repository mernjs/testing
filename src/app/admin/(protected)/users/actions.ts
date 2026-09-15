"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import {
  createAdminUser,
  updateAdminUserRoles,
  resetAdminUserPassword,
  deactivateAdminUser,
  type CreateAdminUserResult,
  type ResetPasswordResult,
} from "@/lib/admin/admin-users";
import { ALL_KNOWN_ROLES } from "@/lib/admin/role-catalog";

function revalidate() {
  revalidatePath("/admin/users");
}

function sanitizeRoles(roles: string[]): string[] {
  return Array.from(new Set(roles.filter((r) => ALL_KNOWN_ROLES.includes(r))));
}

export async function createAdminUserAction(email: string, roles: string[]): Promise<CreateAdminUserResult> {
  await requireAdminUser();
  const result = await createAdminUser(email, sanitizeRoles(roles));
  if (result.ok) revalidate();
  return result;
}

export async function updateAdminUserRolesAction(
  id: string,
  roles: string[]
): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdminUser();
  const result = await updateAdminUserRoles(id, sanitizeRoles(roles), admin.id);
  if (result.ok) revalidate();
  return result;
}

export async function resetAdminUserPasswordAction(id: string): Promise<ResetPasswordResult> {
  await requireAdminUser();
  const result = await resetAdminUserPassword(id);
  if (result.ok) revalidate();
  return result;
}

export async function deactivateAdminUserAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdminUser();
  const result = await deactivateAdminUser(id, admin.id);
  if (result.ok) revalidate();
  return result;
}

export async function bulkDeactivateAdminUsersAction(ids: string[]): Promise<{ deactivated: number; skipped: number }> {
  const admin = await requireAdminUser();
  let deactivated = 0;
  for (const id of ids) {
    const result = await deactivateAdminUser(id, admin.id);
    if (result.ok) deactivated += 1;
  }
  revalidate();
  return { deactivated, skipped: ids.length - deactivated };
}
