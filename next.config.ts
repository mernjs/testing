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
    ];
  },
  allowedDevOrigins: ['7710-103-44-54-34.ngrok-free.app'],
};

export default nextConfig;