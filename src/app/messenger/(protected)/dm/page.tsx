import { MessagesSquare } from "lucide-react";

export default function DmIndexPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-yashorbit-coral text-white">
        <MessagesSquare className="size-6" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Your direct messages</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Select a conversation on the left, or start a new one with the compose button.
      </p>
    </div>
  );
}
