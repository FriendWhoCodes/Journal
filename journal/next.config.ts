import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mow/auth", "@mow/database"],
};

export default nextConfig;
