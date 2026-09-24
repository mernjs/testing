import { redirect } from "next/navigation";
import { getCurrentAibotsUser } from "@/lib/aibots-auth";
import BrandMark from "@/components/BrandMark";
import { brandify } from "@/lib/brand";
import LoginForm from "./LoginForm";

export default async function AibotsLoginPage() {
  const user = await getCurrentAibotsUser();
  if (user) redirect("/aibots");

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-10 lg:flex">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-primary/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
          <div className="absolute top-[10%] right-[5%] h-[50%] w-[50%] rounded-full bg-secondary/15 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute -bottom-[20%] left-[20%] h-[70%] w-[70%] rounded-full bg-yashorbit-coral/15 blur-[140px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-slate-400/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="relative z-10 flex items-center gap-2 text-lg font-bold">
          <BrandMark className="size-7 shrink-0" />
          {brandify("YashOrbit")} <span className="text-foreground">AI Bots</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Every AI assistant,{" "}
            <span className="bg-gradient-to-r from-primary to-yashorbit-coral bg-clip-text text-transparent">one place.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Purpose-built AI bots with their own instructions and knowledge base —
            proposals, requirements, meetings and more, each chat kept in its own thread.
          </p>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">Private staff area — not indexed, not public.</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
