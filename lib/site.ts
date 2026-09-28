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
  /** Optional site-relative image path used for og:image / twitter:image. */
  image?: string;
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
 * @param input - Page title, description, path and optional image.
 * @returns A Metadata object ready to export from a page.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: PageMetadataInput): Metadata {
  // The root `title.template` only applies to <title>, so the share title
  // carries the site name explicitly.
  const hasSiteName = title.includes(SITE_NAME);
  const shareTitle = hasSiteName ? title : `${title} | ${SITE_NAME}`;
  const images = image ? [{ url: image, alt: title }] : undefined;

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
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: shareTitle,
      description,
      creator: TWITTER_HANDLE,
      images: image ? [image] : undefined,
    },
  };
}
