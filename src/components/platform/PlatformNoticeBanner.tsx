"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Megaphone, X } from "lucide-react";

/** Company panels (signed-in workspace areas) — never the public site or the client portal. */
const PANEL_PREFIXES = ["/workspace", "/settings", "/onboarding", "/admin", "/hrms", "/pms", "/prms", "/tms", "/fms", "/lms", "/cms", "/dlms", "/sop", "/ots", "/seo", "/smms", "/aibots", "/messenger"];

function isPanelPath(path: string | null): boolean {
  if (!path) return false;
  if (/\/login$|\/handoff$/.test(path)) return false;
  return PANEL_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

function storageKey(message: string): string {
  let h = 0;
  for (let i = 0; i < message.length; i++) h = (h * 31 + message.charCodeAt(i)) | 0;
  return `platform-notice-dismissed:${h}`;
}

/**
 * The platform-wide maintenance banner (Platform Panel → Platform settings),
 * shown on company panels while a message is set. Floating, so it never
 * changes the panels' full-height layout; dismissible per message.
 */
export default function PlatformNoticeBanner({ message }: { message: string }) {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let wasDismissed = false;
    try {
      wasDismissed = window.localStorage.getItem(storageKey(message)) === "1";
    } catch {}
    setDismissed(wasDismissed);
  }, [message]);

  if (!message || dismissed || !isPanelPath(pathname)) return null;

  return (
    <div role="status" id="platform-notice-banner" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-2xl items-start gap-2 rounded-2xl border border-amber-500/40 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 shadow-lg dark:bg-amber-950/90 dark:text-amber-100">
        <Megaphone className="mt-0.5 size-4 shrink-0" />
        <p className="min-w-0 flex-1 break-words">{message}</p>
        <button
          type="button"
          aria-label="Dismiss notice"
          className="-mr-1 rounded-md p-0.5 opacity-70 hover:opacity-100"
          onClick={() => {
            setDismissed(true);
            try {
              window.localStorage.setItem(storageKey(message), "1");
            } catch {}
          }}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
