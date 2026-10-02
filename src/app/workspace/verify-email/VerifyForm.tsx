"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmailAction, type VerifyState } from "./actions";

const initialState: VerifyState = {};

export default function VerifyForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(verifyEmailAction, initialState);
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="token" value={token} />
      {state.error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Verify my email"}
      </Button>
    </form>
  );
}
