"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateNotesAction } from "./actions";

export default function NotesEditor({ category, id, initialNotes }: { category: string; id: string; initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes);
  const [savedNotes, setSavedNotes] = useState(initialNotes);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dirty = notes !== savedNotes;

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateNotesAction(category, id, notes);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSavedNotes(notes);
      setSaved(true);
    });
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        rows={5}
        placeholder="Internal notes about this submission…"
        className="resize-none"
      />
      <div className="flex items-center gap-3">
        <Button type="button" size="sm" onClick={handleSave} disabled={isPending || !dirty}>
          {isPending ? "Saving…" : "Save Notes"}
        </Button>
        {saved && !dirty && <span className="text-xs text-muted-foreground">Saved</span>}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    </div>
  );
}
