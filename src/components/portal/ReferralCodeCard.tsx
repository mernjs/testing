"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, Link2, MessageCircle, Send, Mail } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";

export default function ReferralCodeCard({ code, link }: { code: string; link: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy(kind: "code" | "link") {
    try {
      await navigator.clipboard.writeText(kind === "code" ? code : link);
      setCopied(kind);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  const shareText = encodeURIComponent(`Join me on YashOrbit and get welcome credits: ${link}`);

  const pill = "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:border-primary";

  return (
    <GlassCard interactive={false}>
      <CardContent className="space-y-3 py-4">
        <p className="text-xs font-medium text-muted-foreground">Your referral code</p>
        <p className="font-mono text-3xl font-black tracking-widest text-foreground">{code}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <button type="button" onClick={() => copy("code")} className={pill}>
            {copied === "code" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} Copy code
          </button>
          <button type="button" onClick={() => copy("link")} className={pill}>
            {copied === "link" ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />} Copy link
          </button>
          <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer" className={pill}>
            <MessageCircle className="size-3.5" /> WhatsApp
          </a>
          <a href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className={pill}>
            <Send className="size-3.5" /> Telegram
          </a>
          <a href={`mailto:?subject=${encodeURIComponent("Join me on YashOrbit")}&body=${shareText}`} className={pill}>
            <Mail className="size-3.5" /> Email
          </a>
        </div>
        <p className="break-all text-xs text-muted-foreground">{link}</p>
      </CardContent>
    </GlassCard>
  );
}
