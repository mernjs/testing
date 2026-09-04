import Link from "next/link";
import { notFound } from "next/navigation";
import { Paperclip, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import StatusBadge from "@/components/admin/StatusBadge";
import { searchLeads, isValidCategory, getCategoryLabel } from "@/lib/leads";
import { LEAD_STATUSES, isValidLeadStatus } from "@/lib/lead-status";

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function SubmissionsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const { category } = await params;
  if (!isValidCategory(category)) notFound();

  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const status = sp.status && isValidLeadStatus(sp.status) ? sp.status : undefined;
  const dateFrom = parseDateParam(sp.dateFrom);
  const dateTo = parseDateParam(sp.dateTo, true);

  const { items, total, totalPages } = await searchLeads(category, {
    page,
    pageSize: 20,
    search: sp.search,
    status,
    dateFrom,
    dateTo,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (sp.search) params.set("search", sp.search);
    if (sp.status) params.set("status", sp.status);
    if (sp.dateFrom) params.set("dateFrom", sp.dateFrom);
    if (sp.dateTo) params.set("dateTo", sp.dateTo);
    params.set("page", String(targetPage));
    return `/admin/submissions/${category}?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{getCategoryLabel(category)}</h1>
        <p className="text-sm text-muted-foreground">{total} submission{total === 1 ? "" : "s"}</p>
      </div>

      <Card>
        <CardContent>
          <form className="flex flex-wrap items-end gap-4" method="GET">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="search" className="text-xs font-medium text-muted-foreground">Search</label>
              <input
                id="search"
                name="search"
                type="text"
                placeholder="Name, email, or phone"
                defaultValue={sp.search ?? ""}
                className="h-8 w-56 rounded-lg border border-input bg-background px-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-xs font-medium text-muted-foreground">Status</label>
              <select id="status" name="status" defaultValue={status ?? ""} className="h-8 rounded-lg border border-input bg-background px-2 text-sm">
                <option value="">All statuses</option>
                {LEAD_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dateFrom" className="text-xs font-medium text-muted-foreground">From</label>
              <input id="dateFrom" name="dateFrom" type="date" defaultValue={sp.dateFrom ?? ""} className="h-8 rounded-lg border border-input bg-background px-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dateTo" className="text-xs font-medium text-muted-foreground">To</label>
              <input id="dateTo" name="dateTo" type="date" defaultValue={sp.dateTo ?? ""} className="h-8 rounded-lg border border-input bg-background px-2 text-sm" />
            </div>
            <Button type="submit" size="sm">Apply</Button>
            {(sp.search || sp.status || sp.dateFrom || sp.dateTo) && (
              <Link href={`/admin/submissions/${category}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>Reset</Link>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No submissions match these filters.
                  </TableCell>
                </TableRow>
              )}
              {items.map((lead) => (
                <TableRow key={String(lead._id)} className="cursor-pointer">
                  <TableCell>
                    <Link href={`/admin/submissions/${category}/${lead._id}`} className="block font-medium hover:underline">
                      <span className="flex items-center gap-1.5">
                        {lead.name}
                        {lead.resume && <Paperclip className="size-3 text-muted-foreground" />}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{lead.email || "—"}</div>
                    <div>{lead.phone}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.subService ?? "—"}</TableCell>
                  <TableCell><StatusBadge status={lead.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Link
              href={pageHref(Math.max(page - 1, 1))}
              className={buttonVariants({ variant: "outline", size: "sm" })}
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : undefined}
            >
              <ChevronLeft className="size-3.5" data-icon="inline-start" />
              Previous
            </Link>
            <Link
              href={pageHref(Math.min(page + 1, totalPages))}
              className={buttonVariants({ variant: "outline", size: "sm" })}
              aria-disabled={page >= totalPages}
              tabIndex={page >= totalPages ? -1 : undefined}
            >
              Next
              <ChevronRight className="size-3.5" data-icon="inline-end" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
