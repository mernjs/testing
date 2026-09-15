"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { deleteAdminDocument, type DocumentModule } from "@/lib/admin/documents";

function revalidate() {
  revalidatePath("/admin/documents");
}

export async function deleteAdminDocumentAction(
  module: DocumentModule,
  id: string,
  ownerId: string
): Promise<{ ok: boolean }> {
  const admin = await requireAdminUser();
  const result = await deleteAdminDocument(module, id, ownerId, admin.id);
  if (result.ok) revalidate();
  return result;
}

export async function bulkDeleteAdminDocumentsAction(
  rows: { module: DocumentModule; id: string; ownerId: string }[]
): Promise<{ deleted: number }> {
  const admin = await requireAdminUser();
  let deleted = 0;
  for (const row of rows) {
    const result = await deleteAdminDocument(row.module, row.id, row.ownerId, admin.id);
    if (result.ok) deleted += 1;
  }
  revalidate();
  return { deleted };
}
