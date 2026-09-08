import "server-only";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * PRMS attachment storage (requisition / expense / invoice / contract files).
 * Lives outside `public/`, served only through the authed API route
 * `/api/prms/attachments/[key]`. Mirrors `src/lib/pms/attachment-storage.ts`.
 */

const DIR = path.join(process.cwd(), "uploads", "prms-attachments");

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_EXT = new Set(["pdf", "png", "jpg", "jpeg", "webp", "doc", "docx", "xls", "xlsx", "csv", "txt"]);

export interface StoredAttachment {
  storageKey: string;
  filename: string;
  contentType: string;
  size: number;
}

function extensionFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "bin";
}

export function isAllowedAttachment(file: File): { ok: true } | { ok: false; error: string } {
  if (file.size > MAX_BYTES) return { ok: false, error: "File exceeds the 15 MB limit." };
  if (!ALLOWED_EXT.has(extensionFor(file.name))) return { ok: false, error: "Unsupported file type." };
  return { ok: true };
}

export async function saveAttachmentFile(file: File): Promise<StoredAttachment> {
  await mkdir(DIR, { recursive: true });
  const storageKey = `${randomUUID()}.${extensionFor(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(DIR, storageKey), buffer);
  return {
    storageKey,
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
  };
}

export function readAttachmentStream(storageKey: string) {
  // `storageKey` is always a generated `<uuid>.<ext>` — reject anything else.
  if (!/^[a-f0-9-]{36}\.[a-z0-9]+$/i.test(storageKey)) return null;
  return createReadStream(path.join(DIR, storageKey));
}

export async function deleteAttachmentFile(storageKey: string) {
  await unlink(path.join(DIR, storageKey)).catch(() => {});
}
