"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { deleteApplication, updateApplication } from "@/lib/career-applications";
import { validateApplicationUpdate } from "@/lib/career-application-validation";

// Every action here independently re-checks the session — render-time gating
// on the page alone is not a security boundary for the action endpoint.
async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function updateApplicationStatusAction(id: string, status: string): Promise<{ error?: string }> {
  await requireAdmin();
  const validation = validateApplicationUpdate({ status });
  if (!validation.valid) return { error: validation.errors.status ?? "Invalid status." };

  const updated = await updateApplication(id, validation.data);
  if (!updated) return { error: "Application not found." };

  revalidatePath(`/admin/careers/applicants/${id}`);
  revalidatePath("/admin/careers/applicants");
  revalidatePath("/admin/careers");
  return {};
}

export async function updateApplicationNotesAction(id: string, notes: string): Promise<{ error?: string }> {
  await requireAdmin();
  const validation = validateApplicationUpdate({ notes });
  if (!validation.valid) return { error: validation.errors.notes ?? "Invalid notes." };

  const updated = await updateApplication(id, validation.data);
  if (!updated) return { error: "Application not found." };

  revalidatePath(`/admin/careers/applicants/${id}`);
  return {};
}

export async function bulkUpdateApplicationStatusAction(ids: string[], status: string): Promise<{ updated: number; error?: string }> {
  await requireAdmin();
  const validation = validateApplicationUpdate({ status });
  if (!validation.valid) return { updated: 0, error: validation.errors.status ?? "Invalid status." };

  let updated = 0;
  for (const id of ids) {
    const result = await updateApplication(id, validation.data);
    if (result) updated += 1;
  }

  revalidatePath("/admin/careers/applicants");
  revalidatePath("/admin/careers");
  return { updated };
}

export async function bulkDeleteApplicationsAction(ids: string[]): Promise<{ deleted: number; error?: string }> {
  await requireAdmin();

  let deleted = 0;
  for (const id of ids) {
    const ok = await deleteApplication(id);
    if (ok) deleted += 1;
  }

  revalidatePath("/admin/careers/applicants");
  revalidatePath("/admin/careers");
  return { deleted };
}

export async function deleteApplicationAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteApplication(id);
  revalidatePath("/admin/careers/applicants");
  revalidatePath("/admin/careers");
  redirect("/admin/careers/applicants");
}

/** Same delete, but for callers already on the list (e.g. a row Sheet) that
 * want to refresh in place instead of being navigated. */
export async function deleteApplicationInPlaceAction(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const deleted = await deleteApplication(id);
  if (!deleted) return { error: "Application not found." };

  revalidatePath("/admin/careers/applicants");
  revalidatePath("/admin/careers");
  return {};
}
