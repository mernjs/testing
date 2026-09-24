import "server-only";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

// Reuse a single OpenAI client across hot reloads in dev and across invocations
// in production. The client is lazily created so that importing this module in
// a context where the key isn't configured doesn't crash the whole route —
// callers get a clear error only when they actually try to use it.
const globalForOpenAI = globalThis as unknown as {
  _openAIClient?: OpenAI;
};

export function getOpenAI(): OpenAI {
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. The AI chatbot is unavailable until it is configured."
    );
  }
  return (globalForOpenAI._openAIClient ??= new OpenAI({ apiKey }));
}

/** True when the server is configured to talk to OpenAI at all. */
export function isOpenAIConfigured(): boolean {
  return Boolean(apiKey);
}

/**
 * True when OpenAI rejected a request because the model doesn't accept `param`
 * (e.g. reasoning models refuse `temperature`) — callers retry without it.
 */
export function isUnsupportedParamError(err: unknown, param: string): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; param?: string; message?: string };
  if (e.status !== 400) return false;
  if (e.param === param) return true;
  return typeof e.message === "string" && e.message.toLowerCase().includes(param);
}
