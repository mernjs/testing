import "server-only";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Deliberately outside `public/` — knowledge-base source documents (brochures,
// RFPs, training material) are only ever served through the admin-authenticated
// download route, never as static unauthenticated files.
const KB_DIR = path.join(process.cwd(), "uploads", "knowledge-base");

export interface StoredKbFile {
  storageKey: string;
  filename: string;
  contentType: string;
  size: number;
}

function extensionFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "bin";
}

export async function saveKbFile(file: File): Promise<StoredKbFile> {
  await mkdir(KB_DIR, { recursive: true });
  // storageKey is always server-generated — no path-traversal surface.
  const storageKey = `${randomUUID()}.${extensionFor(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(KB_DIR, storageKey), buffer);
  return {
    storageKey,
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
  };
}

export function readKbFileStream(storageKey: string) {
  return createReadStream(path.join(KB_DIR, storageKey));
}

export async function readKbFileBuffer(storageKey: string): Promise<Buffer> {
  return readFile(path.join(KB_DIR, storageKey));
}

export async function deleteKbFile(storageKey: string): Promise<void> {
  await unlink(path.join(KB_DIR, storageKey)).catch(() => {});
}
