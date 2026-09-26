"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginAsPortalUserAction } from "../impersonate-actions";

interface LoginAsPortalUserButtonProps {
  externalUserId: string;
  leadId?: string;
  displayName?: string;
  /** When true renders a full-width labelled button; default is icon-only. */
  variant?: "icon" | "full";
}

export default function LoginAsPortalUserButton({
  externalUserId,
  leadId,
  displayName,
  variant = "icon",
}: LoginAsPortalUserButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    if (isPending || clicked) return;
    setClicked(true);
    startTransition(async () => {
      const result = await loginAsPortalUserAction(externalUserId, leadId);
      if (!result.ok) {
        toast.error(result.error);
        setClicked(false);
        return;
      }
      toast.success(
        displayName
          ? `Signed in as ${displayName}. Opening portal…`
          : "Signed in as portal user. Opening portal…"
      );
      router.push("/portal");
    });
  }

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isPending || clicked}
        id={`login-as-portal-user-${externalUserId}`}
        title="Open this lead's portal account in the External Portal"
      >
        {isPending || clicked ? (
          <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
        ) : (
          <LogIn className="size-3.5" data-icon="inline-start" />
        )}
        Login as Portal User
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      disabled={isPending || clicked}
      aria-label="Login as portal user"
      id={`login-as-portal-user-${externalUserId}`}
      title="Login as this portal user"
    >
      {isPending || clicked ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogIn className="size-4" />
      )}
    </Button>
  );
}
