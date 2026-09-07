import Breadcrumbs from "@/components/lms/Breadcrumbs";
import VoiceConfigForm from "@/components/lms/VoiceConfigForm";
import { getChatbotConfig } from "@/lib/chatbot-config";
import { isElevenLabsConfigured } from "@/lib/elevenlabs";

export default async function VoiceConfigPage() {
  const config = await getChatbotConfig();

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/lms" },
          { label: "AI Chatbot", href: "/lms/chatbot" },
          { label: "Conversation AI", href: "/lms/chatbot/voice" },
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
