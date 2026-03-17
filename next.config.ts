import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: "/uploads/:path*",
          destination: "/api/media-proxy/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
