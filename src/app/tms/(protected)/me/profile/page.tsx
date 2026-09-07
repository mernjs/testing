import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import MyProfileForm from "@/components/tms/MyProfileForm";
import { getCurrentTmsUser } from "@/lib/tms-auth";
import { getStudent, serializeStudent } from "@/lib/tms/students";

export default async function MyProfilePage() {
  const user = await getCurrentTmsUser();
  if (!user?.studentId) redirect("/tms");
  const student = await getStudent(user.studentId);
  if (!student) redirect("/tms");

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "TMS", href: "/tms/me" }, { label: "Profile" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Keep your contact details and links up to date. <span className="font-mono">{student.studentCode}</span>
        </p>
      </div>
      <MyProfileForm student={serializeStudent(student)} />
    </div>
  );
}
