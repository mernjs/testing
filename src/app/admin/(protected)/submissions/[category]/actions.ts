"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { deleteLead, isValidCategory, updateLead, validateLeadUpdate, type CategorySlug } from "@/lib/leads";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function bulkUpdateStatusAction(
  category: string,
  ids: string[],
  status: string
): Promise<{ updated: number; error?: string }> {
  await requireAdmin();
  if (!isValidCategory(category)) return { updated: 0, error: "Invalid category." };

  const validation = validateLeadUpdate({ status });
  if (!validation.valid) return { updated: 0, error: validation.errors.status ?? "Invalid status." };

  let updated = 0;
  for (const id of ids) {
    const result = await updateLead(category as CategorySlug, id, validation.data);
    if (result) updated += 1;
  }

  revalidatePath(`/admin/submissions/${category}`);
  revalidatePath("/admin");
  return { updated };
}

export async function bulkDeleteAction(category: string, ids: string[]): Promise<{ deleted: number; error?: string }> {
  await requireAdmin();
  if (!isValidCategory(category)) return { deleted: 0, error: "Invalid category." };

  let deleted = 0;
  for (const id of ids) {
    const ok = await deleteLead(category as CategorySlug, id);
    if (ok) deleted += 1;
  }

  revalidatePath(`/admin/submissions/${category}`);
  revalidatePath("/admin");
  return { deleted };
}
