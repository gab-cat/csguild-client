import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",
  experimental: {
    useLightningcss: true,
  },
};

export default nextConfig;
