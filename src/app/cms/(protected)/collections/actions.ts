"use server";

import { requireViewer, can } from "@/lib/cms/viewer";
import { recordAudit } from "@/lib/cms/audit";
import { COLLECTIONS } from "@/lib/cms/collections/registry";
import type { CollectionKey } from "@/lib/cms/collections/types";
import {
  saveRecordDraft, publishRecord, setRecordArchived, revertRecord, createRecord, type Result,
} from "@/lib/cms/collections/store";

const SESSION_EXPIRED = "Your session has expired — please sign in again.";
const NO_PERMISSION = "You don't have permission to do that.";

function isKey(k: string): k is CollectionKey {
  return k in COLLECTIONS;
}

async function guard(permission: "COLLECTIONS_EDIT" | "COLLECTIONS_PUBLISH") {
  const v = await requireViewer().catch(() => null);
  if (!v) return { v: null, error: SESSION_EXPIRED } as const;
  if (!can(v, permission)) return { v: null, error: NO_PERMISSION } as const;
  return { v, error: null } as const;
}

const audit = (v: { userId: string; email: string | null }, action: "create" | "update" | "publish" | "delete" | "restore", key: CollectionKey, slug: string, summary: string) =>
  recordAudit({ actorId: v.userId, actorEmail: v.email, action, entity: "collection", entityId: `${key}/${slug}`, entityLabel: `${COLLECTIONS[key].singular}: ${slug}`, summary });

export async function saveRecordAction(key: string, slug: string, data: Record<string, unknown>): Promise<Result> {
  if (!isKey(key)) return { ok: false, error: "Unknown collection." };
  const { v, error } = await guard("COLLECTIONS_EDIT");
  if (!v) return { ok: false, error };
  const res = await saveRecordDraft(key, slug, data, v.userId);
  if (res.ok) await audit(v, "update", key, slug, "Saved draft");
  return res;
}

export async function publishRecordAction(key: string, slug: string): Promise<Result<{ pageCreated?: boolean }>> {
  if (!isKey(key)) return { ok: false, error: "Unknown collection." };
  const { v, error } = await guard("COLLECTIONS_PUBLISH");
  if (!v) return { ok: false, error };
  const res = await publishRecord(key, slug, v.userId);
  if (res.ok) await audit(v, "publish", key, slug, "Published");
  return res;
}

export async function archiveRecordAction(key: string, slug: string, archived: boolean): Promise<Result> {
  if (!isKey(key)) return { ok: false, error: "Unknown collection." };
  const { v, error } = await guard("COLLECTIONS_PUBLISH");
  if (!v) return { ok: false, error };
  const res = await setRecordArchived(key, slug, archived, v.userId);
  if (res.ok) await audit(v, "update", key, slug, archived ? "Archived (hidden from the site)" : "Restored to the site");
  return res;
}

export async function revertRecordAction(key: string, slug: string): Promise<Result> {
  if (!isKey(key)) return { ok: false, error: "Unknown collection." };
  const { v, error } = await guard("COLLECTIONS_PUBLISH");
  if (!v) return { ok: false, error };
  const res = await revertRecord(key, slug);
  if (res.ok) await audit(v, res.deleted ? "delete" : "restore", key, slug, res.deleted ? "Deleted (never published)" : "Unpublished changes discarded");
  return res;
}

export async function createRecordAction(key: string, slug: string): Promise<Result<{ slug: string }>> {
  if (!isKey(key)) return { ok: false, error: "Unknown collection." };
  const { v, error } = await guard("COLLECTIONS_EDIT");
  if (!v) return { ok: false, error };
  const res = await createRecord(key, slug, v.userId);
  if (res.ok) await audit(v, "create", key, res.slug, "Created");
  return res;
}
