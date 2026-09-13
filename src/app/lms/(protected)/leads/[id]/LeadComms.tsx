"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { StickyNote, Send, FileQuestion } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addLeadNoteAction, sendLeadMessageAction } from "../actions";
import type { SerializedLeadMessage } from "@/lib/lead-management/types";

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function LeadComms({
  leadId,
  internal,
  portal,
}: {
  leadId: string;
  internal: SerializedLeadMessage[];
  portal: SerializedLeadMessage[];
}) {
  const [tab, setTab] = useState<"internal" | "portal">("portal");
  const [text, setText] = useState("");
  const [docReq, setDocReq] = useState(false);
  const [pending, start] = useTransition();

  const list = tab === "internal" ? internal : portal;

  function submit() {
    if (!text.trim()) return;
    start(async () => {
      const res =
        tab === "internal"
          ? await addLeadNoteAction(leadId, text)
          : await sendLeadMessageAction(leadId, text, docReq ? "document_request" : "message");
      if (res.error) return void toast.error(res.error);
      toast.success(tab === "internal" ? "Note added." : "Message sent to the portal.");
      setText("");
      setDocReq(false);
    });
  }

  return (
    <GlassCard>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Communication</CardTitle>
        <div className="flex gap-1 rounded-lg border border-border/60 p-0.5">
          {(["portal", "internal"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium",
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {t === "portal" ? "Portal messages" : "Internal notes"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {list.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {tab === "internal" ? "No internal notes yet." : "No messages sent to the portal yet."}
            </p>
          )}
          {list.map((m) => (
            <div
              key={m._id}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm",
                tab === "internal" ? "border-amber-500/30 bg-amber-500/[0.06]" : "border-border/50"
              )}
            >
              <div className="mb-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                {tab === "internal" ? <StickyNote className="size-3" /> : <Send className="size-3" />}
                {m.channel === "document_request" ? "Document request" : tab === "internal" ? "Internal note" : "Sent to portal"}
                <span className="ml-auto">{when(m.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap text-foreground">{m.body}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-border/50 pt-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={tab === "internal" ? "Add an internal note (never shown to the lead)…" : "Write a message the lead sees in their portal…"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          />
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={submit} disabled={pending || !text.trim()}>
              {tab === "internal" ? "Add note" : "Send to portal"}
            </Button>
            {tab === "portal" && (
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input type="checkbox" checked={docReq} onChange={(e) => setDocReq(e.target.checked)} />
                <FileQuestion className="size-3.5" /> This is a document request
              </label>
            )}
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );
}
