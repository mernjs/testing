import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Node-only libs used inside route handlers — keep them out of the bundler.
  serverExternalPackages: ["exceljs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // The separate admin panel moved into the Workspace. Old links, bookmarks and
  // URLs stored in notifications keep working. Order matters: first match wins.
  async redirects() {
    return [
      { source: "/admin", destination: "/workspace", permanent: true },
      { source: "/admin/login", destination: "/workspace/login", permanent: true },
      { source: "/admin/change-password", destination: "/workspace/change-password", permanent: true },
      // Everything else kept its path: /admin/users → /workspace/users, /admin/analytics/fms → /workspace/analytics/fms, …
      { source: "/admin/:path*", destination: "/workspace/:path*", permanent: true },

      // Everything workspace-specific lives under /workspace. Old links, bookmarks, e-mails and URLs stored in the
      // database keep working; the request's query string is carried over by Next. These patterns are anchored at the
      // start and name exact prefixes, so they never touch /api/*, /platform/*, a business panel's own /<panel>/settings
      // or the public site.
      { source: "/settings/activity", destination: "/workspace/settings/audit-log?source=workspace", permanent: true }, // company activity log → the merged Audit log
      { source: "/settings/:path*", destination: "/workspace/settings/:path*", permanent: true }, // also matches /settings itself
      { source: "/onboarding", destination: "/workspace/onboarding", permanent: true },
      { source: "/upgrade", destination: "/workspace/upgrade", permanent: true },
      // One dashboard (the Command Center became its executive sections), one Audit log, Documents under Account.
      { source: "/workspace/command-center", destination: "/workspace", permanent: true },
      { source: "/workspace/activity-log", destination: "/workspace/settings/audit-log?source=panels", permanent: true }, // management activity log → Audit log, panel activity
      { source: "/workspace/documents", destination: "/workspace/account/documents", permanent: true },
    ];
  },
  allowedDevOrigins: ['7710-103-44-54-34.ngrok-free.app'],
};

export default nextConfig;