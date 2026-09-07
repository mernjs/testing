import "server-only";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/** Task attachment storage — outside `public/`, served only via the authed route. */

const DIR = path.join(process.cwd(), "uploads", "pms-attachments");

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
  return createReadStream(path.join(DIR, storageKey));
}

export async function deleteAttachmentFile(storageKey: string) {
  await unlink(path.join(DIR, storageKey)).catch(() => {});
}
