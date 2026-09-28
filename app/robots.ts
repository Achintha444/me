import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Generates robots.txt for the portfolio.
 * Allows all crawlers — including AI crawlers such as GPTBot, ClaudeBot and
 * PerplexityBot, which honour the `*` rule — and references the sitemap.
 *
 * @returns The robots.txt rules.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
