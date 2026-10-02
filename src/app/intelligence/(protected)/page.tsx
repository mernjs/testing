import { redirect } from "next/navigation";
import ChatWorkspace from "@/components/intelligence/ChatWorkspace";
import { getCurrentIntelligenceUser } from "@/lib/intelligence-auth";
import { isOpenAIConfigured } from "@/lib/openai";

/** A new conversation. (An existing one is `/intelligence/c/<id>`.) */
export default async function IntelligenceHomePage() {
  const user = await getCurrentIntelligenceUser();
  if (!user) redirect("/intelligence/login");
  return <ChatWorkspace conversationId={null} title={null} initialMessages={[]} ownerEmail={user.email} openAIReady={(await isOpenAIConfigured())} />;
}
