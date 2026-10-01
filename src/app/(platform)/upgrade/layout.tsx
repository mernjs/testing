import CompanyPagesLayout from "@/components/hub/CompanyPagesLayout";

/** Company pages render inside the Workspace frame (same sidebar and top bar). */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <CompanyPagesLayout>{children}</CompanyPagesLayout>;
}
