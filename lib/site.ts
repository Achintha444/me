import type { Metadata } from "next";

/**
 * Canonical production origin. Every absolute URL the site emits — canonical
 * links, Open Graph URLs, sitemap entries, JSON-LD `@id`s and llms.txt links —
 * is derived from this single value, so moving to a custom domain is a
 * one-line change here.
 */
export const SITE_URL = "https://achintha-isuru.vercel.app";

/** Site / person name used as the Open Graph site name and title suffix. */
export const SITE_NAME = "Achintha Isuru";

/** Primary professional headline used in the default title and structured data. */
export const SITE_HEADLINE = "Front-end Developer & UI/UX Designer";

/** Default meta description for pages that do not provide their own. */
export const SITE_DESCRIPTION =
  "Portfolio of Achintha Isuru — a Montréal-based front-end developer and UI/UX designer bridging design and development with React, Next.js, and Flutter.";

/** X (Twitter) handle used for `twitter:creator`. */
export const TWITTER_HANDLE = "@AchinthaIs47441";

/** Route of the site-wide generated share image (`app/opengraph-image.tsx`). */
const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";

/** Portrait used as the Person image in structured data. */
export const PROFILE_IMAGE_PATH = "/images/me/me-1.webp";

/**
 * Resolves a site-relative path to an absolute URL on {@link SITE_URL}.
 *
 * @param path - A path beginning with `/` (e.g. `/projects/fabvis`).
 * @returns The absolute URL string.
 */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Inputs for {@link buildPageMetadata}. */
interface PageMetadataInput {
  /**
   * Page title. The root layout template appends the site name unless the
   * title already contains it, in which case it is used verbatim.
   */
  title: string;
  /** Meta, Open Graph and Twitter description. */
  description: string;
  /** Site-relative path of the page, used for the canonical and og:url. */
  path: string;
  /**
   * Set when the page's segment has its own `opengraph-image.tsx`, so the
   * default share image is not emitted over it.
   */
  hasSegmentImage?: boolean;
  /** Open Graph object type. Defaults to `website`. */
  type?: "website" | "article" | "profile";
}

/**
 * Builds a complete per-page Metadata object.
 *
 * Next.js merges metadata between segments shallowly, so a page that sets
 * `openGraph` replaces the root layout's `openGraph` entirely. This helper
 * always emits the full `openGraph` and `twitter` objects together with a
 * canonical URL, so each page is self-describing to search and AI engines.
 *
 * Share images default to the site-wide card from `app/opengraph-image.tsx`,
 * because the shallow merge would otherwise drop it from nested pages.
 * Segments with their own `opengraph-image.tsx` must pass
 * `hasSegmentImage`: an explicit `images` value here would replace the
 * segment's generated image.
 *
 * @param input - Page title, description, path, image source and Open Graph type.
 * @returns A Metadata object ready to export from a page.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  hasSegmentImage = false,
  type = "website",
}: PageMetadataInput): Metadata {
  // The root `title.template` only applies to <title>, so the share title
  // carries the site name explicitly.
  const hasSiteName = title.includes(SITE_NAME);
  const shareTitle = hasSiteName ? title : `${title} | ${SITE_NAME}`;
  // The key must be omitted, not set to undefined: Next.js treats a present
  // `images` key as an override of the segment's generated image.
  const images = hasSegmentImage ? {} : { images: [DEFAULT_OG_IMAGE_PATH] };

  return {
    title: hasSiteName ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      siteName: SITE_NAME,
      url: path,
      title: shareTitle,
      description,
      ...images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      creator: TWITTER_HANDLE,
      ...images,
    },
  };
}
