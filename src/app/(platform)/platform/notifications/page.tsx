import GenericPanelNotificationsPage from "@/components/platform/panel/GenericPanelNotificationsPage";

export default function PlatformNotificationsPage() {
  return (
    <GenericPanelNotificationsPage
      panelName="Platform Administration"
      shortCode="ADMIN"
      description="Track platform subscription renewals, tenant registration alerts & system audit logs."
    />
  );
}
