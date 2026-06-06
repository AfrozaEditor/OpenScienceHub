import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

function getLocalNetworkOrigins() {
  try {
    return Object.values(networkInterfaces())
      .flatMap((details) =>
        (details ?? [])
          .filter((item) => item.family === "IPv4" && !item.internal)
          .map((item) => item.address),
      );
  } catch {
    return [];
  }
}

const localNetworkOrigins = getLocalNetworkOrigins();
const configuredLanHost = process.env.LAN_HOST_IP;

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    ...(configuredLanHost ? [configuredLanHost] : []),
    ...localNetworkOrigins,
  ],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.BACKEND_INTERNAL_API_BASE_URL || "http://backend:8000/api/v1"}/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${process.env.BACKEND_INTERNAL_MEDIA_BASE_URL || "http://backend:8000/media"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
