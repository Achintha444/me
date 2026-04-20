import { XMLParser } from "fast-xml-parser";

/** Medium RSS feed URL for the portfolio author. */
export const MEDIUM_FEED_URL =
  "https://medium.com/feed/@achinthaisuru444";

/** ISR revalidation interval in seconds (1 hour). */
export const MEDIUM_REVALIDATE_SECONDS = 3600;

/** Reading speed assumed for reading-time estimates (words per minute). */
export const READING_SPEED_WPM = 200;

/**
 * A single parsed Medium post in a normalized shape suitable for rendering.
 *
 * @remarks
 * The raw RSS feed exposes CDATA blobs of HTML for content. This type
 * represents the extracted, stripped values — no HTML strings leak into
 * consumers.
 */
export interface MediumPost {
  /** Unique URL of the post on Medium — used as the React key and href. */
  url: string;
  /** The post title, HTML-entity-decoded. */
  title: string;
  /** ISO 8601 publication date string, suitable for `<time dateTime>`. */
  publishedAt: string;
  /** Human-readable date string, e.g. "Jan 2025". */
  publishedFormatted: string;
  /** First ~160 characters of the post body with HTML stripped. */
  excerpt: string;
  /** Estimated reading time in minutes, derived from body word count. */
  readingTimeMinutes: number;
  /** URL of the hero/thumbnail image, or null if the post has none. */
  heroImage: string | null;
}

/** Strip HTML tags and collapse whitespace. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract the first <img src="..."> from an HTML string, or null. */
function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/** Estimate reading time from a plain-text body. */
function estimateReadingTime(plainText: string): number {
  const wordCount = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / READING_SPEED_WPM));
}

/** Format an ISO date string as a short human-readable label (e.g. "Apr 2026"). */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/* ─── RSS shape — minimal typing for what fast-xml-parser returns ─────── */

/**
 * fast-xml-parser wraps CDATA sections as `{ __cdata: "..." }` when
 * `cdataPropName` is configured. A field may therefore be a plain string
 * or this wrapper object.
 */
type CdataValue = string | { __cdata: string };

/** Unwrap a potentially CDATA-wrapped string field. */
function unwrapCdata(value: CdataValue | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.__cdata ?? "";
}

interface RssItem {
  title?: CdataValue;
  link?: CdataValue;
  pubDate?: CdataValue;
  description?: CdataValue;
  "content:encoded"?: CdataValue;
}

interface RssFeed {
  rss?: {
    channel?: {
      item?: RssItem | RssItem[];
    };
  };
}

/**
 * Fetches and parses the Medium RSS feed, returning a normalized array of
 * {@link MediumPost} objects ordered newest-first.
 *
 * Uses Next.js `fetch` with `{ next: { revalidate } }` for hourly ISR.
 * Returns an empty array — never throws — so callers can render a graceful
 * empty state instead of crashing.
 *
 * @returns An array of {@link MediumPost}, or `[]` on any error.
 */
export async function getMediumPosts(): Promise<MediumPost[]> {
  try {
    const response = await fetch(MEDIUM_FEED_URL, {
      next: { revalidate: MEDIUM_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(
        `[medium] RSS fetch failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      cdataPropName: "__cdata",
      isArray: (name) => name === "item",
    });

    const parsed = parser.parse(xml) as RssFeed;
    const items = parsed?.rss?.channel?.item ?? [];
    const itemArray: RssItem[] = Array.isArray(items) ? items : [items];

    const posts: MediumPost[] = itemArray
      .map((item): MediumPost | null => {
        const url = unwrapCdata(item.link);
        const title = stripHtml(unwrapCdata(item.title) || "Untitled");
        const pubDate = unwrapCdata(item.pubDate);
        const content =
          unwrapCdata(item["content:encoded"]) ||
          unwrapCdata(item.description);

        if (!url) return null;

        const plainText = stripHtml(content);
        const excerpt = plainText.slice(0, 160).trimEnd();
        const readingTimeMinutes = estimateReadingTime(plainText);
        const heroImage = extractFirstImage(content);

        let publishedAt = "";
        let publishedFormatted = "";
        if (pubDate) {
          const date = new Date(pubDate);
          if (!isNaN(date.getTime())) {
            publishedAt = date.toISOString();
            publishedFormatted = formatDate(date.toISOString());
          }
        }

        return {
          url,
          title,
          publishedAt,
          publishedFormatted,
          excerpt: excerpt + (plainText.length > 160 ? "…" : ""),
          readingTimeMinutes,
          heroImage,
        };
      })
      .filter((post): post is MediumPost => post !== null);

    return posts;
  } catch (error) {
    console.error("[medium] Failed to fetch or parse RSS feed:", error);
    return [];
  }
}
