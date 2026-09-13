"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import BrandMark from "@/components/BrandMark";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { brandify } from "@/lib/brand";
import { portalLoginAction, type PortalLoginState } from "./actions";

const initial: PortalLoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(portalLoginAction, initial);
  const [show, setShow] = useState(false);
  const emailId = useId();
  const pwId = useId();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
      <GlassCard>
        <CardHeader>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary lg:hidden">
            <BrandMark className="size-4 shrink-0" />
            {brandify("YashOrbit")} <span className="text-foreground">Portal</span>
          </div>
          <CardTitle className="text-xl">Sign in to your portal</CardTitle>
          <CardDescription>One login — your dashboard is built for your role.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor={emailId}>Email</Label>
              <Input id={emailId} name="email" type="email" required autoComplete="username" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={pwId}>Password</Label>
              <div className="relative">
                <Input id={pwId} name="password" type={show ? "text" : "password"} required autoComplete="current-password" className="pr-9" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setShow((v) => !v)}
                  className="absolute top-1/2 right-1 -translate-y-1/2"
                  aria-label={show ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" name="remember" className="accent-primary" />
                Remember me
              </label>
              <Link href="/portal/forgot-password" className="font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            {state?.error && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/portal/register" className="font-medium text-primary hover:underline">
              Create your account
            </Link>
          </p>
        </CardContent>
      </GlassCard>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        External access only. You only ever see your own information.
      </p>
    </motion.div>
  );
}
