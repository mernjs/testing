import "server-only";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Employee document storage. Deliberately outside `public/` — these are
 * sensitive (Aadhaar, PAN, bank proofs) and must only be served through the
 * authenticated download route. Mirrors `src/lib/resume-storage.ts`.
 */

const DOCS_DIR = path.join(process.cwd(), "uploads", "hrms-documents");

export interface StoredDocument {
  storageKey: string;
  filename: string;
  contentType: string;
  size: number;
}

function extensionFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "bin";
}

export async function saveDocumentFile(file: File): Promise<StoredDocument> {
  await mkdir(DOCS_DIR, { recursive: true });
  // storageKey is always server-generated — no path-traversal surface.
  const storageKey = `${randomUUID()}.${extensionFor(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(DOCS_DIR, storageKey), buffer);
  return {
    storageKey,
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
  };
}

export function readDocumentStream(storageKey: string) {
  return createReadStream(path.join(DOCS_DIR, storageKey));
}

export async function deleteDocumentFile(storageKey: string) {
  await unlink(path.join(DOCS_DIR, storageKey)).catch(() => {});
}
