"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, ShieldCheck, KeyRound, UserX, Plus, Lock, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import AdminDataGrid, { type AdminDataGridColumn, type BulkActionsContext } from "@/components/admin/data-grid/AdminDataGrid";
import { formatDate, formatDateTime } from "@/lib/utils";
import { roleLabelsForRoles } from "@/lib/admin/role-catalog";
import { resetAdminUserPasswordAction, deactivateAdminUserAction, bulkDeactivateAdminUsersAction } from "./actions";
import RoleEditorSheet from "./RoleEditorSheet";
import PermissionOverridesSheet from "./PermissionOverridesSheet";
import CreateUserSheet from "./CreateUserSheet";
import TempPasswordDialog from "./TempPasswordDialog";

export interface AdminUserRow {
  _id: string;
  email: string;
  roles: string[];
  permissionOverrides: Record<string, boolean>;
  mustChangePassword: boolean;
  locked: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

function RowActions({
  row,
  currentAdminId,
  onEditRoles,
  onEditPermissions,
  onTempPassword,
}: {
  row: AdminUserRow;
  currentAdminId: string;
  onEditRoles: (row: AdminUserRow) => void;
  onEditPermissions: (row: AdminUserRow) => void;
  onTempPassword: (info: { email: string; tempPassword: string }) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isSelf = row._id === currentAdminId;
  const isActive = row.roles.length > 0;

  function resetPassword() {
    startTransition(async () => {
      const result = await resetAdminUserPasswordAction(row._id);
      if (!result.ok || !result.tempPassword) toast.error(result.error ?? "Could not reset password.");
      else onTempPassword({ email: row.email, tempPassword: result.tempPassword });
    });
  }

  function handleDeactivate() {
    startTransition(async () => {
      const result = await deactivateAdminUserAction(row._id);
      if (!result.ok) toast.error(result.error ?? "Could not deactivate account.");
      else toast.success("Account deactivated");
      setConfirmOpen(false);
    });
  }

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Row actions">
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEditRoles(row)}>
            <ShieldCheck className="size-3.5" />
            Edit roles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEditPermissions(row)}>
            <SlidersHorizontal className="size-3.5" />
            Edit permissions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={resetPassword} disabled={isPending}>
            <KeyRound className="size-3.5" />
            Reset password
          </DropdownMenuItem>
          {isActive && (
            <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)} disabled={isSelf}>
              <UserX className="size-3.5" />
              Deactivate
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {row.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              Clears every role. They&apos;ll lose access to every module until roles are granted again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate} disabled={isPending}>
              {isPending ? "Deactivating…" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BulkActions({ ctx, currentAdminId }: { ctx: BulkActionsContext; currentAdminId: string }) {
  const [pending, setPending] = useState(false);
  const includesSelf = ctx.selectedIds.includes(currentAdminId);

  async function handleBulkDeactivate() {
    setPending(true);
    const result = await bulkDeactivateAdminUsersAction(ctx.selectedIds);
    setPending(false);
    if (result.skipped > 0) {
      toast.warning(`${result.deactivated} deactivated. ${result.skipped} skipped (your own account can't be deactivated).`);
    } else {
      toast.success(`Deactivated ${result.deactivated} account${result.deactivated === 1 ? "" : "s"}`);
    }
    ctx.clearSelection();
    ctx.refresh();
  }

  return (
    <>
      <a
        href={`/api/admin/users/export?ids=${encodeURIComponent(ctx.selectedIds.join(","))}`}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium hover:bg-muted"
      >
        Export
      </a>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button type="button" variant="destructive" size="sm" disabled={pending}>
              <UserX className="size-3.5" data-icon="inline-start" />
              Deactivate
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {ctx.selectedIds.length} account{ctx.selectedIds.length === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>
              Clears every role for each selected account.
              {includesSelf && " Your own account is selected — it will be skipped."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDeactivate}>Deactivate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function UsersGrid({
  rows,
  total,
  page,
  totalPages,
  sortBy,
  sortDir,
  filters,
  hasActiveFilters,
  currentAdminId,
}: {
  rows: AdminUserRow[];
  total: number;
  page: number;
  totalPages: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  filters?: React.ReactNode;
  hasActiveFilters?: boolean;
  currentAdminId: string;
}) {
  const [editRolesFor, setEditRolesFor] = useState<AdminUserRow | null>(null);
  const [editPermissionsFor, setEditPermissionsFor] = useState<AdminUserRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [tempPasswordInfo, setTempPasswordInfo] = useState<{ email: string; tempPassword: string } | null>(null);

  const columns: AdminDataGridColumn<AdminUserRow>[] = [
    {
      key: "email",
      label: "Account",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <p className="font-medium text-foreground">{row.email}</p>
          {row.locked && <Lock className="size-3.5 text-destructive" />}
          {row._id === currentAdminId && <Badge variant="outline" className="h-4 px-1 text-[10px]">You</Badge>}
        </div>
      ),
    },
    {
      key: "roles",
      label: "Roles",
      render: (row) =>
        row.roles.length === 0 ? (
          <Badge variant="outline" className="text-muted-foreground">Deactivated</Badge>
        ) : (
          <div className="flex flex-wrap gap-1">
            {roleLabelsForRoles(row.roles).map((label) => (
              <Badge key={label} variant="outline" className="text-[11px]">{label}</Badge>
            ))}
            {Object.keys(row.permissionOverrides).length > 0 && (
              <Badge className="text-[11px]">
                {Object.keys(row.permissionOverrides).length} override
                {Object.keys(row.permissionOverrides).length === 1 ? "" : "s"}
              </Badge>
            )}
          </div>
        ),
    },
    {
      key: "mustChangePassword",
      label: "Password",
      render: (row) => (row.mustChangePassword ? <Badge variant="outline">Temp</Badge> : "Set"),
    },
    { key: "createdAt", label: "Created", sortable: true, render: (row) => formatDate(row.createdAt) },
    {
      key: "lastLoginAt",
      label: "Last login",
      sortable: true,
      render: (row) => (row.lastLoginAt ? formatDateTime(row.lastLoginAt) : "Never"),
    },
  ];

  return (
    <>
      <AdminDataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row._id}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        emptyLabel="No accounts match these filters."
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        toolbarExtra={
          <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-3.5" data-icon="inline-start" />
            New account
          </Button>
        }
        rowActions={(row) => (
          <RowActions
            row={row}
            currentAdminId={currentAdminId}
            onEditRoles={setEditRolesFor}
            onEditPermissions={setEditPermissionsFor}
            onTempPassword={setTempPasswordInfo}
          />
        )}
        renderBulkActions={(ctx) => <BulkActions ctx={ctx} currentAdminId={currentAdminId} />}
      />

      <RoleEditorSheet
        key={`roles-${editRolesFor?._id ?? "none"}`}
        userId={editRolesFor?._id ?? null}
        userEmail={editRolesFor?.email ?? null}
        initialRoles={editRolesFor?.roles ?? []}
        currentAdminId={currentAdminId}
        open={editRolesFor !== null}
        onOpenChange={(open) => !open && setEditRolesFor(null)}
      />

      <PermissionOverridesSheet
        key={`permissions-${editPermissionsFor?._id ?? "none"}`}
        userId={editPermissionsFor?._id ?? null}
        userEmail={editPermissionsFor?.email ?? null}
        userRoles={editPermissionsFor?.roles ?? []}
        initialOverrides={editPermissionsFor?.permissionOverrides ?? {}}
        open={editPermissionsFor !== null}
        onOpenChange={(open) => !open && setEditPermissionsFor(null)}
      />

      <CreateUserSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(email, tempPassword) => setTempPasswordInfo({ email, tempPassword })}
      />

      <TempPasswordDialog info={tempPasswordInfo} onClose={() => setTempPasswordInfo(null)} />
    </>
  );
}
