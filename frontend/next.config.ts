import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const localNetworkOrigins = Object.values(networkInterfaces())
  .flat()
  .filter((details) => details?.family === "IPv4" && !details.internal)
  .map((details) => details.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    ...localNetworkOrigins,
  ],
};

export default nextConfig;
