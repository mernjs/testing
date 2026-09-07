import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import EmployeeForm from "@/components/hrms/EmployeeForm";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { canManageEmployees } from "@/lib/hrms-roles";
import { listDepartments, listDesignations, listTeams } from "@/lib/hrms/departments";
import { getEmployee, listEmployeeOptions, serializeEmployee, employeeFullName } from "@/lib/hrms/employees";

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentHrmsUser();
  if (!user || !canManageEmployees(user.roles)) redirect("/hrms/employees");

  const { id } = await params;
  const employee = await getEmployee(id);
  if (!employee) notFound();

  const [departments, designations, teams, managers] = await Promise.all([
    listDepartments(),
    listDesignations(),
    listTeams(),
    listEmployeeOptions(),
  ]);

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "HRMS", href: "/hrms" },
          { label: "Employees", href: "/hrms/employees" },
          { label: employeeFullName(employee), href: `/hrms/employees/${id}` },
          { label: "Edit" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Edit {employeeFullName(employee)}</h1>
        <p className="text-sm text-muted-foreground">{employee.employeeCode}</p>
      </div>

      <EmployeeForm
        mode="edit"
        employee={serializeEmployee(employee)}
        departments={departments.map((d) => ({ _id: d._id, name: d.name }))}
        designations={designations.map((d) => ({ _id: d._id, title: d.title, departmentId: d.departmentId }))}
        teams={teams.map((t) => ({ _id: t._id, name: t.name, departmentId: t.departmentId }))}
        managers={managers}
      />
    </div>
  );
}
