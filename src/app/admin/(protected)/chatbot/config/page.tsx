import Breadcrumbs from "@/components/admin/Breadcrumbs";
import ChatbotConfigForm from "@/components/admin/ChatbotConfigForm";
import { getChatbotConfig, serializeChatbotConfig } from "@/lib/chatbot-config";
import { isOpenAIConfigured } from "@/lib/openai";

export default async function ChatbotConfigPage() {
  const config = serializeChatbotConfig(await getChatbotConfig());

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "AI Chatbot", href: "/admin/chatbot" },
          { label: "AI Config" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Model, generation, retrieval, rate limiting, and the welcome experience. The OpenAI API key is read
          from the server environment only and is never shown or editable here.
        </p>
      </div>

      <ChatbotConfigForm config={config} openAiConfigured={isOpenAIConfigured()} />
    </div>
  );
}
