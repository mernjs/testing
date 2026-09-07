import Link from "next/link";
import { List } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import ApplicationsBoard from "@/components/tms/ApplicationsBoard";
import { getApplicationsBoard, serializeApplication } from "@/lib/tms/applications";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/tms/constants";
import type { BoardCard } from "@/components/tms/ApplicationsBoard";

export default async function ApplicationsBoardPage() {
  const board = await getApplicationsBoard();
  const serialized = {} as Record<ApplicationStatus, BoardCard[]>;
  for (const s of APPLICATION_STATUSES) {
    serialized[s.value] = board[s.value].map((a) => ({ ...serializeApplication(a), programName: a.programName }));
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "TMS", href: "/tms" }, { label: "Applications", href: "/tms/applications" }, { label: "Board" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Application Pipeline</h1>
          <p className="text-sm text-muted-foreground">Drag cards to move applicants through the pipeline.</p>
        </div>
        <Link href="/tms/applications" className={buttonVariants({ variant: "outline", size: "sm" })}>
          <List className="size-3.5" data-icon="inline-start" />
          List view
        </Link>
      </div>

      <GlassCard interactive={false}>
        <CardContent className="py-4">
          <ApplicationsBoard board={serialized} />
        </CardContent>
      </GlassCard>
    </div>
  );
}
