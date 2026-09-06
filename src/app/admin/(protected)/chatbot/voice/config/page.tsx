import Breadcrumbs from "@/components/admin/Breadcrumbs";
import VoiceConfigForm from "@/components/admin/VoiceConfigForm";
import { getChatbotConfig } from "@/lib/chatbot-config";
import { isElevenLabsConfigured } from "@/lib/elevenlabs";

export default async function VoiceConfigPage() {
  const config = await getChatbotConfig();

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "AI Chatbot", href: "/admin/chatbot" },
          { label: "Conversation AI", href: "/admin/chatbot/voice" },
          { label: "ElevenLabs Config" },
        ]}
      />
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">ElevenLabs Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Voice, model and delivery settings for voice mode on the Ask YashOrbit page. The API key is read from
          the server environment only.
        </p>
      </div>

      <VoiceConfigForm voice={config.voice} elevenLabsConfigured={isElevenLabsConfigured()} />
    </div>
  );
}
