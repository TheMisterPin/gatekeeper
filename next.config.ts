import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/gatekeeper',
  assetPrefix: '/gatekeeper/',
  allowedDevOrigins: ["10.78.116.218"],
};

export default nextConfig;
