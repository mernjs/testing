"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Eye,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { formatDateTime } from "@/lib/utils";
import ConversationSheet from "@/components/admin/ConversationSheet";
import ChatbotExportButton from "@/components/admin/ChatbotExportButton";
import { bulkDeleteConversationsAction } from "@/app/admin/(protected)/chatbot/actions";
import type { ConversationRow } from "@/lib/chat-conversations";

const DEVICE_OPTIONS = ["mobile", "tablet", "desktop", "bot", "unknown"];

export default function ConversationsDataTable({
  items,
  total,
  page,
  totalPages,
  sourcePages,
  initialSearch,
  initialDevice,
  initialSourcePage,
  initialDateFrom,
  initialDateTo,
  initialSortBy,
  initialSortDir,
}: {
  items: ConversationRow[];
  total: number;
  page: number;
  totalPages: number;
  sourcePages: string[];
  initialSearch: string;
  initialDevice: string;
  initialSourcePage: string;
  initialDateFrom: string;
  initialDateTo: string;
  initialSortBy: string;
  initialSortDir: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = React.useTransition();

  const [searchInput, setSearchInput] = React.useState(initialSearch);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [sheetSession, setSheetSession] = React.useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const updateParams = React.useCallback(
    (updates: Record<string, string | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (resetPage) params.delete("page");
      startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams]
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== initialSearch) updateParams({ search: searchInput || undefined });
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, initialSearch, updateParams]);

  function toggleSort(field: string) {
    const dir = initialSortBy === field && initialSortDir === "desc" ? "asc" : "desc";
    updateParams({ sortBy: field, sortDir: dir });
  }

  function sortIcon(field: string) {
    if (initialSortBy !== field) return <ChevronsUpDown className="size-3 opacity-50" />;
    return initialSortDir === "desc" ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />;
  }

  const allSelected = items.length > 0 && items.every((i) => selected.has(i._id));
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(items.map((i) => i._id)));
  }
  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    const ids = [...selected];
    const res = await bulkDeleteConversationsAction(ids);
    toast.success(`Deleted ${res.deleted} conversation${res.deleted === 1 ? "" : "s"}`);
    setSelected(new Set());
    router.refresh();
  }

  const hasActiveFilters = Boolean(
    initialSearch || initialDevice || initialSourcePage || initialDateFrom || initialDateTo
  );

  function openSheet(sessionId: string) {
    setSheetSession(sessionId);
    setSheetOpen(true);
  }

  function pageParams(target: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(target));
    return params.toString();
  }

  return (
    <div className="space-y-3">
      <GlassCard>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Message text, session or visitor ID"
                  className="h-8 w-64 pl-8"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Device</label>
              <Select
                value={initialDevice || "all"}
                onValueChange={(v) => updateParams({ device: !v || v === "all" ? undefined : v })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All devices</SelectItem>
                  {DEVICE_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d[0].toUpperCase() + d.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Source Page</label>
              <Select
                value={initialSourcePage || "all"}
                onValueChange={(v) => updateParams({ sourcePage: !v || v === "all" ? undefined : v })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All pages</SelectItem>
                  {sourcePages.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">From</label>
              <Input
                type="date"
                value={initialDateFrom}
                onChange={(e) => updateParams({ dateFrom: e.target.value || undefined })}
                className="w-auto"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">To</label>
              <Input
                type="date"
                value={initialDateTo}
                onChange={(e) => updateParams({ dateTo: e.target.value || undefined })}
                className="w-auto"
              />
            </div>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput("");
                  router.replace(pathname);
                }}
              >
                <X className="size-3.5" data-icon="inline-start" />
                Reset
              </Button>
            )}
            <div className="ml-auto">
              <ChatbotExportButton
                params={{
                  search: initialSearch,
                  device: initialDevice,
                  sourcePage: initialSourcePage,
                  dateFrom: initialDateFrom,
                  dateTo: initialDateTo,
                }}
              />
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardContent className="max-h-[65vh] overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead>Conversation</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort("messageCount")}>
                    Msgs {sortIcon("messageCount")}
                  </button>
                </TableHead>
                <TableHead>
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort("startedAt")}>
                    Started {sortIcon("startedAt")}
                  </button>
                </TableHead>
                <TableHead>
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort("lastActivityAt")}>
                    Last activity {sortIcon("lastActivityAt")}
                  </button>
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                    No conversations match these filters.
                  </TableCell>
                </TableRow>
              )}
              {items.map((row) => (
                <TableRow key={row._id} className="cursor-pointer" onClick={() => openSheet(row.sessionId)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(row._id)}
                      onCheckedChange={() => toggleOne(row._id)}
                      aria-label="Select conversation"
                    />
                  </TableCell>
                  <TableCell className="max-w-[260px]">
                    <div className="flex items-center gap-2">
                      {row.flagged && <ShieldAlert className="size-3.5 shrink-0 text-destructive" />}
                      <span className="truncate text-sm">{row.preview}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{row.sessionId.slice(0, 8)}…</span>
                  </TableCell>
                  <TableCell className="max-w-[170px]">
                    {row.visitorName || row.visitorEmail ? (
                      <>
                        <p className="truncate text-sm font-medium">{row.visitorName ?? "—"}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{row.visitorEmail ?? ""}</p>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground/70">Anonymous</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.device}
                    <span className="block text-[11px]">{row.browser}</span>
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">
                    {row.sourcePage || "(direct)"}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">{row.messageCount}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(row.startedAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(row.lastActivityAt)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/admin/chatbot/conversations/${row.sessionId}`}
                      className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                      aria-label="Open conversation"
                    >
                      <Eye className="size-3.5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </GlassCard>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} conversation{total === 1 ? "" : "s"}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Link
              href={`${pathname}?${pageParams(Math.max(1, page - 1))}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
              aria-disabled={page <= 1}
            >
              Previous
            </Link>
            <span>
              Page {page} of {totalPages}
            </span>
            <Link
              href={`${pathname}?${pageParams(Math.min(totalPages, page + 1))}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
              aria-disabled={page >= totalPages}
            >
              Next
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-fit items-center gap-3 rounded-full border border-border/60 bg-card/95 px-4 py-2 shadow-xl backdrop-blur-xl"
          >
            <span className="text-sm font-medium">{selected.size} selected</span>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" size="sm">
                    <Trash2 className="size-3.5" data-icon="inline-start" />
                    Delete
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {selected.size} conversations?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the selected sessions and all of their messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <button
              onClick={() => setSelected(new Set())}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Clear selection"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConversationSheet sessionId={sheetSession} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
