import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE, renderOgImage } from "@/lib/og";
import { SITE_HEADLINE, SITE_NAME } from "@/lib/site";

/** Alt text for the default share image. */
export const alt = `${SITE_NAME} — ${SITE_HEADLINE}`;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

/**
 * Default share image for every route that does not define its own — the
 * home page and all top-level sections.
 *
 * @returns The rendered PNG share card.
 */
export default function Image() {
  return renderOgImage({
    eyebrow: "Portfolio · Montréal, QC",
    title: "Bridging design and development",
    subtitle: `${SITE_HEADLINE} building web and mobile products with React, Next.js, and Flutter.`,
  });
}
