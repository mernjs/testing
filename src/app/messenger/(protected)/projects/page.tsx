import { FolderKanban } from "lucide-react";

export default function ProjectChannelsIndexPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-yashorbit-coral text-white">
        <FolderKanban className="size-6" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Project channels</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        One private channel per PMS project. Membership tracks the project team automatically — pick a channel on the left.
      </p>
    </div>
  );
}
