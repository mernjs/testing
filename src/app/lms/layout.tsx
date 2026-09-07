import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMS",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return <div className="lms-shell min-h-screen bg-background text-foreground">{children}</div>;
}
