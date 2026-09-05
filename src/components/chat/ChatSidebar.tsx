"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, MessageSquareText, Pencil, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat, type ChatSessionSummary } from "@/components/chat/ChatProvider";

function startOfDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function bucketFor(iso: string): string {
  const now = startOfDay(new Date());
  const day = startOfDay(new Date(iso));
  const diffDays = Math.round((now - day) / 86_400_000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Previous 7 Days";
  if (diffDays <= 30) return "Previous 30 Days";
  return "Older";
}

const BUCKET_ORDER = ["Today", "Yesterday", "Previous 7 Days", "Previous 30 Days", "Older"];

function groupSessions(sessions: ChatSessionSummary[]): { label: string; sessions: ChatSessionSummary[] }[] {
  const groups = new Map<string, ChatSessionSummary[]>();
  for (const s of sessions) {
    const label = bucketFor(s.lastActivityAt);
    (groups.get(label) ?? groups.set(label, []).get(label)!).push(s);
  }
  return BUCKET_ORDER.filter((l) => groups.has(l)).map((label) => ({ label, sessions: groups.get(label)! }));
}

function SessionRow({
  session,
  active,
  onSelect,
  onRename,
  onDelete,
}: {
  session: ChatSessionSummary;
  active: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [draft, setDraft] = React.useState(session.title);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startEditing() {
    setDraft(session.title);
    setEditing(true);
  }

  function commit() {
    const next = draft.trim();
    if (next && next !== session.title) onRename(next);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1 rounded-lg bg-muted/60 px-2 py-1.5">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          onBlur={commit}
          maxLength={80}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <button onClick={commit} className="text-muted-foreground hover:text-primary" aria-label="Save title">
          <Check className="size-3.5" />
        </button>
      </div>
    );
  }

  if (confirmDelete) {
    return (
      <div className="flex flex-col gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-2.5 py-2">
        <p className="text-xs text-foreground">Delete this chat?</p>
        <div className="flex gap-1.5">
          <button
            onClick={onDelete}
            className="rounded-md bg-destructive/15 px-2 py-1 text-[11px] font-semibold text-destructive hover:bg-destructive/25"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/row flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
        active ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted/60"
      )}
    >
      <button onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <MessageSquareText className={cn("size-3.5 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
        <span className="truncate">{session.title}</span>
      </button>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/row:opacity-100 group-focus-within/row:opacity-100 [@media(hover:none)]:opacity-100">
        <button
          onClick={startEditing}
          className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
          aria-label="Rename chat"
        >
          <Pencil className="size-3" />
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="rounded p-1 text-muted-foreground hover:bg-background hover:text-destructive"
          aria-label="Delete chat"
        >
          <Trash2 className="size-3" />
        </button>
      </div>
    </div>
  );
}

export function ChatSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { sessions, activeSessionId, newConversation, switchSession, renameSession, deleteSession } = useChat();
  const groups = groupSessions(sessions);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 p-3">
      <button
        type="button"
        onClick={() => {
          void newConversation();
          onNavigate?.();
        }}
        className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      >
        <Plus className="size-4" />
        New chat
      </button>

      <div className="-mr-1 flex-1 space-y-4 overflow-y-auto pr-1">
        {sessions.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Your conversations from this browser will appear here.
          </p>
        )}
        {groups.map((group) => (
          <div key={group.label} className="space-y-0.5">
            <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
              {group.label}
            </p>
            {group.sessions.map((s) => (
              <SessionRow
                key={s.sessionId}
                session={s}
                active={s.sessionId === activeSessionId}
                onSelect={() => {
                  void switchSession(s.sessionId);
                  onNavigate?.();
                }}
                onRename={(title) => renameSession(s.sessionId, title)}
                onDelete={() => deleteSession(s.sessionId)}
              />
            ))}
          </div>
        ))}
      </div>

      <p className="px-2 pt-1 text-[10px] leading-tight text-muted-foreground/60">
        History is stored for this browser only — no account needed.
      </p>
    </div>
  );
}

/** Mobile slide-over wrapper, mirroring the pattern in Header.tsx.
 * Mounted only while open (wrap in <AnimatePresence>). */
export function ChatSidebarDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="lg:hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
        className="fixed inset-y-0 left-0 z-[71] flex w-[86%] max-w-xs flex-col border-r border-border/50 bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-3 py-3">
          <span className="text-sm font-bold text-foreground">Chat history</span>
          <button onClick={onClose} aria-label="Close history" className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <ChatSidebar onNavigate={onClose} />
        </div>
      </motion.aside>
    </div>
  );
}
