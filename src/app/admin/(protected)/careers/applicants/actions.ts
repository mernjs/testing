"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { updateApplication, deleteApplication } from "@/lib/career-applications";
import { validateApplicationUpdate } from "@/lib/career-application-validation";

function revalidate() {
  revalidatePath("/admin/careers/applicants");
}

export async function updateApplicantStatusAction(id: string, status: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdminUser();
  const validation = validateApplicationUpdate({ status });
  if (!validation.valid) return { ok: false, error: validation.errors.status ?? "Invalid status." };

  const updated = await updateApplication(id, validation.data);
  revalidate();
  return { ok: updated !== null };
}

export async function deleteApplicantAction(id: string): Promise<{ ok: boolean }> {
  await requireAdminUser();
  const ok = await deleteApplication(id);
  revalidate();
  return { ok };
}

export async function bulkUpdateApplicantStatusAction(ids: string[], status: string): Promise<{ updated: number; error?: string }> {
  await requireAdminUser();
  const validation = validateApplicationUpdate({ status });
  if (!validation.valid) return { updated: 0, error: validation.errors.status ?? "Invalid status." };

  let updated = 0;
  for (const id of ids) {
    const result = await updateApplication(id, validation.data);
    if (result) updated += 1;
  }
  revalidate();
  return { updated };
}

export async function bulkDeleteApplicantsAction(ids: string[]): Promise<{ deleted: number }> {
  await requireAdminUser();
  let deleted = 0;
  for (const id of ids) {
    const ok = await deleteApplication(id);
    if (ok) deleted += 1;
  }
  revalidate();
  return { deleted };
}
