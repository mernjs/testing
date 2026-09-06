import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HRMS",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

// `admin-shell` is the shared dashboard design-system class (palette tokens,
// card treatment, ambient background, control nudges) — reused verbatim so the
// HRMS panel is visually identical to the Admin panel.
export default function HrmsLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell min-h-screen bg-background text-foreground">{children}</div>;
}
