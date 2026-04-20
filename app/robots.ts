import type { MetadataRoute } from "next";

/** Base URL for the production site. */
const BASE_URL = "https://achintha.dev";

/**
 * Generates robots.txt for the portfolio.
 * Allows all crawlers and references the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
