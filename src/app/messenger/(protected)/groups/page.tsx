import { Users } from "lucide-react";

export default function GroupsIndexPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-yashorbit-coral text-white">
        <Users className="size-6" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Group chats</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Private conversations with a fixed set of people — a squad, a team, a project stand-up. Pick one on the left or create a new group.
      </p>
    </div>
  );
}
