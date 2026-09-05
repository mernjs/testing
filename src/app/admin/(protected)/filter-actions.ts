"use server";

import { getCurrentAdmin } from "@/lib/admin-auth";
import { createSavedFilter, deleteSavedFilter } from "@/lib/saved-filters";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function saveFilterAction(name: string, params: Record<string, string>): Promise<{ error?: string; id?: string }> {
  const admin = await requireAdmin();
  if (!name.trim()) return { error: "Name is required." };
  const id = await createSavedFilter(admin.id, name, params);
  return { id };
}

export async function deleteSavedFilterAction(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  const ok = await deleteSavedFilter(admin.id, id);
  if (!ok) return { error: "Not found." };
  return {};
}
