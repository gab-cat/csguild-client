import type { NextConfig } from "next";

const remotePatterns = [
  {
    hostname: "lh3.googleusercontent.com",
    protocol: "https" as const,
  },
  {
    hostname: "images.unsplash.com",
    protocol: "https" as const,
  },
  {
    hostname: "127.0.0.1",
    protocol: "http" as const,
  } as const,
];

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    useLightningcss: true,
  },
  images: {
    remotePatterns,
  }
};

export default nextConfig;
