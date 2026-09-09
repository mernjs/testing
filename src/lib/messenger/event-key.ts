/**
 * Isomorphic scope-key helpers — safe to import from client components
 * (unlike `events.ts`, which is `server-only`).
 */

export type EventScope =
  | { type: "dm"; id: string }
  | { type: "channel"; id: string }
  | { type: "user"; id: string }
  | { type: "call"; id: string };

export function scopeKey(scope: EventScope): string {
  return `${scope.type}:${scope.id}`;
}
