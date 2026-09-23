import "server-only";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Lead-message attachments live in `uploads/lead-message-files/` — deliberately
 * outside `public/` so they are only ever served through the authenticated
 * route `/api/lead-messages/files/[key]` (which re-derives access from the
 * message the file is attached to). Mirrors `src/lib/messenger/attachments.ts`,
 * minus its `chat_shared_files` ledger — there's no Files hub for Lead
 * Management, so that bookkeeping isn't needed here.
 */

const FILES_DIR = path.join(process.cwd(), "uploads", "lead-message-files");

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

const ALLOWED_EXT = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "md",
  "png", "jpg", "jpeg", "gif", "webp", "svg",
  "mp4", "webm", "mov", "m4a", "mp3", "ogg", "wav",
  "zip",
]);

export type AttachmentKind = "image" | "voice" | "video" | "file";

export interface Attachment {
  storageKey: string;
  filename: string;
  contentType: string;
  size: number;
  kind: AttachmentKind;
}

function extOf(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "bin";
}

export function kindFor(contentType: string, filename: string): AttachmentKind {
  const ext = extOf(filename);
  if (contentType.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
  if (contentType.startsWith("video/") || ["mp4", "webm", "mov"].includes(ext)) return "video";
  if (contentType.startsWith("audio/") || ["m4a", "mp3", "ogg", "wav"].includes(ext)) return "voice";
  return "file";
}

export async function saveLeadAttachment(file: File): Promise<Attachment> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("File is larger than 25 MB.");
  const ext = extOf(file.name);
  if (!ALLOWED_EXT.has(ext)) throw new Error(`Files of type .${ext} aren't allowed.`);

  await mkdir(FILES_DIR, { recursive: true });
  const storageKey = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(FILES_DIR, storageKey), buffer);

  const contentType = file.type || "application/octet-stream";
  return {
    storageKey,
    filename: file.name,
    contentType,
    size: file.size,
    kind: kindFor(contentType, file.name),
  };
}

export function readLeadAttachmentStream(storageKey: string) {
  if (!/^[a-zA-Z0-9._-]+$/.test(storageKey)) return null;
  try {
    return createReadStream(path.join(FILES_DIR, storageKey));
  } catch {
    return null;
  }
}
