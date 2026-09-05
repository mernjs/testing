import "server-only";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Deliberately outside `public/` — AI voice responses are only ever served
// through the admin-authenticated playback route, never as static files.
const VOICE_DIR = path.join(process.cwd(), "uploads", "voice");

export interface StoredVoiceAudio {
  storageKey: string;
  size: number;
}

/** Persists an AI voice response (mp3). storageKey is server-generated. */
export async function saveVoiceAudio(audio: Buffer, ext = "mp3"): Promise<StoredVoiceAudio> {
  await mkdir(VOICE_DIR, { recursive: true });
  const storageKey = `${randomUUID()}.${ext}`;
  await writeFile(path.join(VOICE_DIR, storageKey), audio);
  return { storageKey, size: audio.byteLength };
}

export function readVoiceAudioStream(storageKey: string) {
  return createReadStream(path.join(VOICE_DIR, storageKey));
}

export async function readVoiceAudioBuffer(storageKey: string): Promise<Buffer> {
  return readFile(path.join(VOICE_DIR, storageKey));
}

export async function deleteVoiceAudio(storageKey: string | null | undefined): Promise<void> {
  if (!storageKey) return;
  await unlink(path.join(VOICE_DIR, storageKey)).catch(() => {});
}
