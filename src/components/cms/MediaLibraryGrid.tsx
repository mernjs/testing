"use client";

import { useConfirm } from "@/components/cms/ui/ConfirmProvider";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, Loader2, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/lms/GlassCard";
import { useCmsMediaUpload } from "@/lib/useCmsMediaUpload";
import { deleteCmsMediaAction } from "@/app/cms/(protected)/media/actions";
import type { CmsMediaDoc } from "@/lib/cms/media";

export default function MediaLibraryGrid({ initialItems, canUpload, canDelete }: { initialItems: CmsMediaDoc[]; canUpload: boolean; canDelete: boolean }) {
  const confirm = useConfirm();
  const [items, setItems] = useState(initialItems);
  const { uploadFile, progress } = useCmsMediaUpload();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const media = await uploadFile(file);
    if (media) {
      setItems((prev) => [media, ...prev]);
      toast.success("Uploaded");
    }
  };

  const remove = async (item: CmsMediaDoc) => {
    if (!(await confirm({ title: `Delete “${item.name}”?`, description: "Pages that still use this image will show it as broken.", confirmLabel: "Delete file", destructive: true }))) return;
    setItems((prev) => prev.filter((m) => m._id !== item._id));
    const res = await deleteCmsMediaAction(item._id, item.name);
    if (!res.ok) toast.error(res.error);
  };

  const copyUrl = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/api/cms/media/${id}`);
    toast.success("URL copied");
  };

  return (
    <div className="space-y-4">
      {canUpload && (
        <>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          <Button variant="outline" size="sm" onClick={() => fileInput.current?.click()} disabled={progress !== null}>
            {progress !== null ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            {progress !== null ? `Uploading… ${progress}%` : "Upload image"}
          </Button>
        </>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((m) => (
          <GlassCard key={m._id} className="overflow-hidden p-0">
            <div className="relative aspect-square">
              <Image src={`/api/cms/media/${m._id}`} alt={m.altText || m.name} fill unoptimized className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-1 p-2">
              <span className="truncate text-xs text-muted-foreground">{m.name}</span>
              <div className="flex shrink-0 items-center gap-1">
                <Button type="button" variant="ghost" size="icon-xs" onClick={() => copyUrl(m._id)} aria-label="Copy URL">
                  <Copy className="size-3.5" />
                </Button>
                {canDelete && (
                  <Button type="button" variant="ghost" size="icon-xs" onClick={() => remove(m)} aria-label="Delete">
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      {items.length === 0 && <GlassCard className="p-8 text-center text-sm text-muted-foreground">No media uploaded yet.</GlassCard>}
    </div>
  );
}
