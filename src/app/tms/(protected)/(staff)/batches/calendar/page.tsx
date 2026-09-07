import Link from "next/link";
import { List } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import BatchCalendar from "@/components/tms/BatchCalendar";
import { listBatchesForCalendar } from "@/lib/tms/batches";

export default async function BatchCalendarPage() {
  const batches = await listBatchesForCalendar();

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "TMS", href: "/tms" }, { label: "Batches", href: "/tms/batches" }, { label: "Calendar" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Batch Calendar</h1>
          <p className="text-sm text-muted-foreground">Every batch by start date.</p>
        </div>
        <Link href="/tms/batches" className={buttonVariants({ variant: "outline", size: "sm" })}>
          <List className="size-3.5" data-icon="inline-start" />
          List view
        </Link>
      </div>

      <GlassCard interactive={false}>
        <CardContent className="py-5">
          <BatchCalendar
            batches={batches.map((b) => ({
              _id: b._id,
              batchCode: b.batchCode,
              name: b.name,
              programName: b.programName,
              startDate: b.startDate as string,
              endDate: b.endDate,
              status: b.status,
              enrolled: b.enrolled,
              capacity: b.capacity,
            }))}
          />
        </CardContent>
      </GlassCard>
    </div>
  );
}
