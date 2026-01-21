import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blog.manofwisdom.co",
      },
      {
        protocol: "http",
        hostname: "manofwisdom.co",
      },
      {
        protocol: "https",
        hostname: "manofwisdom.co",
      },
    ],
  },
};

export default nextConfig;
