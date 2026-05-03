import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  transpilePackages: ['pdfjs-dist'],
  webpack: (config, { isServer }) => {
    // pdfjs-dist v4 requires canvas as an optional native dep; mock it for the
    // server/edge bundles so the build doesn't fail when canvas isn't installed.
    if (!isServer) {
      config.resolve.alias = {
        ...(config.resolve.alias as Record<string, unknown>),
        canvas: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
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
