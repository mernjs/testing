import MyDocuments from "@/components/hrms/MyDocuments";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { listDocuments, serializeDocument } from "@/lib/hrms/documents";

export default async function MyDocumentsPage() {
  const user = await getCurrentHrmsUser();
  const docs = (await listDocuments(user!.employeeId!)).map(serializeDocument);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">My Documents</h1>
        <p className="text-sm text-muted-foreground">Download your records, or upload certificates and proofs.</p>
      </div>
      <MyDocuments
        documents={docs.map((d) => ({
          _id: d._id,
          category: d.category,
          title: d.title,
          filename: d.filename,
          contentType: d.contentType,
          size: d.size,
          expiryDate: d.expiryDate,
          version: d.version,
          uploadedByRole: d.uploadedByRole,
          createdAt: d.createdAt,
        }))}
      />
    </div>
  );
}
