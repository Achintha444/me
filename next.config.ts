import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * - Strict mode enabled for React 19 best practices.
 * - remotePatterns empty (all images are local in /public).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
