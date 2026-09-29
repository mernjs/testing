"use server";

import { requireViewer, can } from "@/lib/cms/viewer";
import { recordAudit } from "@/lib/cms/audit";
import { createPage, deletePage, listPages, type Result } from "@/lib/cms/pages";
import type { PageSection } from "@/lib/cms/section-registry";

const SESSION_EXPIRED = "Your session has expired — please sign in again.";
const NO_PERMISSION = "You don't have permission to do that.";

export async function listPagesAction() {
  const v = await requireViewer().catch(() => null);
  if (!v || !can(v, "VIEW")) return [];
  return listPages();
}

export async function createPageAction(input: { path: string; title: string; templateKey: string }): Promise<Result<{ id: string }>> {
  let v;
  try {
    v = await requireViewer();
  } catch {
    return { ok: false, error: SESSION_EXPIRED };
  }
  if (!can(v, "PAGES_CREATE")) return { ok: false, error: NO_PERMISSION };

  // A new page starts empty; its sections are added in the page builder.
  const sections: PageSection[] = [];
  const res = await createPage({ path: input.path, title: input.title, templateKey: input.templateKey, sections }, v.userId);
  if (res.ok) {
    await recordAudit({ actorId: v.userId, actorEmail: v.email, action: "create", entity: "page", entityId: res.id, entityLabel: input.path, path: input.path, summary: "Created" });
  }
  return res;
}

export async function deletePageAction(id: string, path: string): Promise<Result> {
  let v;
  try {
    v = await requireViewer();
  } catch {
    return { ok: false, error: SESSION_EXPIRED };
  }
  if (!can(v, "PAGES_DELETE")) return { ok: false, error: NO_PERMISSION };

  const res = await deletePage(id);
  if (res.ok) {
    await recordAudit({ actorId: v.userId, actorEmail: v.email, action: "delete", entity: "page", entityId: id, entityLabel: path, path, summary: "Deleted" });
  }
  return res;
}
