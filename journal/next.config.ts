import type { NextConfig } from "next";
import { getSecurityHeaders } from "@mow/auth/server";

const nextConfig: NextConfig = {
  transpilePackages: ["@mow/auth", "@mow/database"],
  async headers() {
    return getSecurityHeaders({
      referrerPolicyOverrides: [
        { path: "/verify", policy: "no-referrer" },
      ],
    });
  },
};

export default nextConfig;
