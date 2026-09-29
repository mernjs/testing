import "server-only";
import { notFound, redirect } from "next/navigation";
import { getCurrentHubUser, type CurrentHubUser } from "@/lib/hub-auth";
import { isPlatformOwnerContext } from "@/lib/platform/tenancy/context";

/**
 * The console is for the platform owner's Super Admins only. On any other
 * company's host it doesn't exist (404) — a workspace must not even learn
 * the console is there. Every console page AND server action calls this.
 */
export async function requirePlatformAdmin(): Promise<CurrentHubUser> {
  if (!(await isPlatformOwnerContext())) notFound();
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");
  return user;
}
