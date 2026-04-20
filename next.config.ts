import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * - Strict mode enabled for React 19 best practices.
 * - remotePatterns allows Medium CDN hosts so that blog hero images can be
 *   optimised via next/image. Both `miro.medium.com` and the numbered CDN
 *   bucket `cdn-images-1.medium.com` are permitted.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      new URL("https://miro.medium.com/**"),
      new URL("https://cdn-images-1.medium.com/**"),
    ],
  },
};

export default nextConfig;
