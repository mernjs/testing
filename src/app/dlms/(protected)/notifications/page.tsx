import GenericPanelNotificationsPage from "@/components/platform/panel/GenericPanelNotificationsPage";

export default function DlmsNotificationsPage() {
  return (
    <GenericPanelNotificationsPage
      panelName="Document Lifecycle Management"
      shortCode="DLMS"
      description="Track secure document vault uploads, file expiration warnings & access permission alerts."
    />
  );
}
