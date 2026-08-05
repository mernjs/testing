import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { whatsapp } from "@/lib/contact";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#0b3d1e] shadow-xl shadow-black/20 transition-transform hover:scale-110 active:scale-95"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
