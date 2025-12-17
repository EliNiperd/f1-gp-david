import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["media.formula1.com"],
  },
};

export default nextConfig;
