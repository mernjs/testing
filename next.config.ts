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
  allowedDevOrigins: ['7710-103-44-54-34.ngrok-free.app'],
};

export default nextConfig;