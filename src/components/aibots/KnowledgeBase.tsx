"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, CircleAlert, FileText, LoaderCircle, Pencil, RefreshCw, Trash2, Upload, X, CircleSlash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SectionCard, EmptyState } from "@/components/aibots/AibotsUi";
import ActionButton from "@/components/aibots/ActionButton";
import { cn } from "@/lib/utils";
import { deleteFileAction, refreshFilesAction, setFileEnabledAction, updateFileMetaAction } from "@/app/aibots/(protected)/actions";
import { FILE_CATEGORY_SUGGESTIONS, FILE_STATUS_LABEL, KB_CONVERTED_EXTENSIONS, KB_EXTENSIONS, MAX_UPLOAD_BYTES, type KbFileStatus } from "@/lib/aibots/constants";
import type { KbFileView } from "@/lib/aibots/knowledge";

const ACCEPT = KB_EXTENSIONS.map((e) => `.${e}`).join(",");

function size(n: number) {
  return n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function StatusPill({ status, error }: { status: KbFileStatus; error: string | null }) {
  const cls = {
    ready: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    processing: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
    failed: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    disabled: "bg-muted text-muted-foreground",
  }[status];
  const Icon = { ready: CheckCircle2, processing: LoaderCircle, failed: CircleAlert, disabled: CircleSlash }[status];
  return (
    <span title={error ?? undefined} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", cls)}>
      <Icon className={cn("size-3", status === "processing" && "animate-spin")} />
      {FILE_STATUS_LABEL[status]}
    </span>
  );
}

async function postFile(botId: string, form: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/aibots/bots/${botId}/files`, { method: "POST", body: form });
    return await res.json().catch(() => ({ ok: false, error: res.status === 413 ? "That file is too large." : "Upload failed." }));
  } catch {
    return { ok: false, error: "Network error — the upload didn't finish." };
  }
}

function CategoryInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <>
      <Input id={id} list={`${id}-list`} maxLength={60} value={value} onChange={(e) => onChange(e.target.value)} placeholder="e.g. Case Studies" />
      <datalist id={`${id}-list`}>
        {FILE_CATEGORY_SUGGESTIONS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </>
  );
}

/** New files: pick several, give them a shared category/description, upload one by one. */
function Uploader({ botId, disabled }: { botId: string; disabled: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState<{ file: File; title: string; state: "queued" | "uploading" | "done" | "error"; error?: string }[]>([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [running, setRunning] = useState(false);

  function add(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list).map((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const error = !KB_EXTENSIONS.includes(ext) ? "Unsupported type" : file.size > MAX_UPLOAD_BYTES ? `Over ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` : file.size === 0 ? "Empty file" : undefined;
      return { file, title: file.name.replace(/\.[^.]+$/, ""), state: error ? ("error" as const) : ("queued" as const), error };
    });
    setQueue((q) => [...q.filter((x) => x.state !== "done"), ...next]);
  }

  async function uploadAll() {
    setRunning(true);
    let okCount = 0;
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].state !== "queued") continue;
      setQueue((q) => q.map((x, j) => (j === i ? { ...x, state: "uploading" } : x)));
      const form = new FormData();
      form.set("file", queue[i].file);
      form.set("title", queue[i].title);
      form.set("category", category);
      form.set("description", description);
      const res = await postFile(botId, form);
      if (res.ok) okCount++;
      setQueue((q) => q.map((x, j) => (j === i ? { ...x, state: res.ok ? "done" : "error", error: res.error } : x)));
    }
    setRunning(false);
    if (okCount) {
      toast.success(`${okCount} file${okCount === 1 ? "" : "s"} sent to OpenAI for indexing.`);
      router.refresh();
    }
  }

  const pending = queue.filter((q) => q.state === "queued").length;

  return (
    <SectionCard title="Upload knowledge" description={`PDF, Word, text, Markdown, PowerPoint, HTML, JSON, CSV or Excel · up to ${MAX_UPLOAD_BYTES / 1024 / 1024} MB each. Files go straight to this bot's private OpenAI vector store.`}>
      <input ref={inputRef} type="file" multiple accept={ACCEPT} className="hidden" onChange={(e) => (add(e.target.files), (e.target.value = ""))} />
      <button
        type="button"
        disabled={disabled || running}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!disabled && !running) add(e.dataTransfer.files);
        }}
        className="flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
      >
        <Upload className="size-5" />
        <span className="font-medium text-foreground">Drop files here or click to choose</span>
        <span className="text-[11px]">CSV and Excel are converted to text first — OpenAI file search can&apos;t index them directly.</span>
      </button>
      {queue.length > 0 && (
        <div className="mt-3 space-y-3">
          <ul className="space-y-1.5">
            {queue.map((q, i) => (
              <li key={i} className="flex items-center gap-2 rounded-xl border border-border/50 px-3 py-2">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <Input
                  value={q.title}
                  disabled={q.state !== "queued"}
                  onChange={(e) => setQueue((all) => all.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                  aria-label={`Title for ${q.file.name}`}
                  className="h-8 min-w-0 flex-1"
                />
                <span className="hidden shrink-0 text-[11px] text-muted-foreground sm:inline">{size(q.file.size)}</span>
                <span className="w-24 shrink-0 text-right text-[11px]">
                  {q.state === "uploading" && <LoaderCircle className="ml-auto size-4 animate-spin text-primary" />}
                  {q.state === "done" && <span className="text-emerald-600">Uploaded</span>}
                  {q.state === "error" && <span className="text-destructive">{q.error ?? "Failed"}</span>}
                  {q.state === "queued" && (
                    <button type="button" onClick={() => setQueue((all) => all.filter((_, j) => j !== i))} aria-label={`Remove ${q.file.name}`} className="text-muted-foreground hover:text-foreground">
                      <X className="ml-auto size-4" />
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="kb-cat">Category for these files</Label>
              <CategoryInput id="kb-cat" value={category} onChange={setCategory} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="kb-desc">Description (optional)</Label>
              <Input id="kb-desc" maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What these files contain" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setQueue([])} disabled={running}>
              Clear
            </Button>
            <Button type="button" onClick={uploadAll} disabled={running || pending === 0}>
              {running ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Upload {pending || ""} file{pending === 1 ? "" : "s"}
            </Button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function EditDialog({ botId, file, onClose }: { botId: string; file: KbFileView; onClose: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState(file.title);
  const [category, setCategory] = useState(file.category);
  const [description, setDescription] = useState(file.description);
  const [pending, start] = useTransition();
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit file details</DialogTitle>
          <DialogDescription>{file.filename}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="kf-title">Title</Label>
            <Input id="kf-title" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="kf-cat">Category</Label>
            <CategoryInput id="kf-cat" value={category} onChange={setCategory} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="kf-desc">Description</Label>
            <Textarea id="kf-desc" rows={3} maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await updateFileMetaAction(botId, file._id, { title, category, description });
                if (!res.ok) return void toast.error(res.error);
                toast.success("File details saved");
                onClose();
                router.refresh();
              })
            }
          >
            {pending && <LoaderCircle className="size-4 animate-spin" />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReplaceButton({ botId, file }: { botId: string; file: KbFileView }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setBusy(true);
          const form = new FormData();
          form.set("file", f);
          form.set("fileId", file._id);
          const res = await postFile(botId, form);
          setBusy(false);
          if (!res.ok) return void toast.error(res.error ?? "Upload failed.");
          toast.success(`${file.title} replaced — re-indexing in OpenAI.`);
          router.refresh();
        }}
      />
      <Button size="icon-xs" variant="ghost" disabled={busy} onClick={() => ref.current?.click()} aria-label={`Replace ${file.title}`} title="Upload a new version">
        {busy ? <LoaderCircle className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
      </Button>
    </>
  );
}

export default function KnowledgeBase({
  botId,
  files,
  can,
  openAIReady,
}: {
  botId: string;
  files: KbFileView[];
  can: { upload: boolean; manage: boolean; del: boolean };
  openAIReady: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<KbFileView | null>(null);
  const processing = files.some((f) => f.status === "processing");

  // While OpenAI is still indexing, poll its real status.
  useEffect(() => {
    if (!processing || !openAIReady) return;
    const t = setInterval(async () => {
      await refreshFilesAction(botId);
      router.refresh();
    }, 5000);
    return () => clearInterval(t);
  }, [processing, openAIReady, botId, router]);

  const ready = files.filter((f) => f.status === "ready").length;

  return (
    <div className="space-y-4">
      {can.upload && <Uploader botId={botId} disabled={!openAIReady} />}
      <SectionCard
        title={`Knowledge files (${files.length})`}
        description={`${ready} searchable${processing ? " · indexing in OpenAI…" : ""}. Only this bot can search these files.`}
      >
        {files.length === 0 ? (
          <EmptyState icon={<FileText className="size-5" />} title="No knowledge files yet">
            Without files the bot answers from its instructions and the model&apos;s general knowledge only.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                  <th className="py-2 pr-3 font-semibold">File</th>
                  <th className="px-3 py-2 font-semibold">Category</th>
                  <th className="px-3 py-2 font-semibold">Size</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Updated</th>
                  <th className="py-2 pl-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {files.map((f) => (
                  <tr key={f._id} className={cn(!f.enabled && "opacity-60")}>
                    <td className="max-w-72 py-2 pr-3">
                      <p className="truncate font-medium">{f.title}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {f.filename}
                        {f.version > 1 && ` · v${f.version}`}
                        {f.converted && KB_CONVERTED_EXTENSIONS.includes(f.extension) && " · converted to text"}
                      </p>
                      {f.description && <p className="line-clamp-1 text-[11px] text-muted-foreground">{f.description}</p>}
                      {f.status === "failed" && f.lastError && <p className="line-clamp-2 text-[11px] text-destructive">{f.lastError}</p>}
                    </td>
                    <td className="px-3 py-2 text-xs">{f.category}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap text-muted-foreground">{size(f.size)}</td>
                    <td className="px-3 py-2">
                      <StatusPill status={f.status} error={f.lastError} />
                    </td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap text-muted-foreground">{new Date(f.updatedAt).toLocaleDateString()}</td>
                    <td className="py-2 pl-3">
                      <div className="flex items-center justify-end gap-0.5">
                        {can.manage && (
                          <>
                            <ActionButton
                              variant="ghost"
                              size="xs"
                              action={() => setFileEnabledAction(botId, f._id, !f.enabled)}
                              success={f.enabled ? "File disabled — the bot can no longer search it" : "File enabled — re-indexing"}
                              aria-label={f.enabled ? `Disable ${f.title}` : `Enable ${f.title}`}
                            >
                              {f.enabled ? "Disable" : "Enable"}
                            </ActionButton>
                            <Button size="icon-xs" variant="ghost" onClick={() => setEditing(f)} aria-label={`Edit ${f.title}`}>
                              <Pencil className="size-3.5" />
                            </Button>
                          </>
                        )}
                        {can.upload && openAIReady && <ReplaceButton botId={botId} file={f} />}
                        {can.del && (
                          <ActionButton
                            variant="ghost"
                            size="icon-xs"
                            action={() => deleteFileAction(botId, f._id)}
                            success="File deleted from the knowledge base"
                            aria-label={`Delete ${f.title}`}
                            confirm={{ title: `Delete “${f.title}”?`, description: "It is removed from this bot's OpenAI vector store and deleted from OpenAI. This can't be undone.", confirmLabel: "Delete" }}
                          >
                            <Trash2 className="size-3.5" />
                          </ActionButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {processing && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <LoaderCircle className="size-3 animate-spin" /> Checking OpenAI for indexing progress every few seconds.
          </p>
        )}
      </SectionCard>
      {editing && <EditDialog botId={botId} file={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
