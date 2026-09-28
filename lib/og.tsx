import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "./site";

/** Open Graph image dimensions recommended by Facebook, LinkedIn and X. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/** Generated share images are PNG, which every social platform supports. */
export const OG_IMAGE_CONTENT_TYPE = "image/png";

/**
 * Light-theme design tokens mirrored from `app/globals.css`. ImageResponse
 * renders outside the DOM and cannot resolve CSS custom properties, so the
 * resolved values are duplicated here; keep them in sync with the source
 * tokens named in each comment.
 */
const OG_TOKENS = {
  /** --color-paper → --paper-50 */
  paper: "#F7F5F2",
  /** --color-ink → --ink-full */
  ink: "#0F0E0D",
  /** --color-ink-muted → --ink-mid */
  inkMuted: "#6B6560",
  /** --color-accent → --terracotta-500 */
  accent: "#C84B31",
} as const;

/** Directory holding the TTF files used to render share images. */
const FONT_DIR = join(process.cwd(), "assets/og-fonts");

/** Horizontal/vertical padding of the card, in pixels. */
const CARD_PADDING = 72;

/** Inputs for {@link renderOgImage}. */
interface OgImageInput {
  /** Small uppercase label above the title (e.g. "Case study"). */
  eyebrow: string;
  /** The main headline. */
  title: string;
  /** Optional supporting line below the title. */
  subtitle?: string;
}

/**
 * Picks a title font size that keeps long project names within three lines.
 *
 * @param title - The headline text.
 * @returns Font size in pixels.
 */
function titleFontSize(title: string): number {
  if (title.length <= 32) return 84;
  if (title.length <= 60) return 68;
  return 54;
}

/**
 * Loads the DM font family used across the site (display serif, body sans and
 * mono) as ImageResponse font descriptors.
 *
 * @returns Font descriptors for ImageResponse.
 */
async function loadFonts() {
  const [serif, sans, mono] = await Promise.all([
    readFile(join(FONT_DIR, "DMSerifDisplay-Regular.ttf")),
    readFile(join(FONT_DIR, "DMSans-Medium.ttf")),
    readFile(join(FONT_DIR, "DMMono-Regular.ttf")),
  ]);

  return [
    { name: "DM Serif Display", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "DM Sans", data: sans, weight: 500 as const, style: "normal" as const },
    { name: "DM Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

/**
 * Renders a 1200×630 PNG share card in the portfolio's editorial style:
 * paper background, mono eyebrow, serif headline, sans subtitle and a
 * terracotta accent rule above the site name and domain.
 *
 * @param input - Eyebrow, title and optional subtitle text.
 * @returns An ImageResponse suitable as an `opengraph-image` route's result.
 */
export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: OgImageInput): Promise<ImageResponse> {
  const domain = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: CARD_PADDING,
          backgroundColor: OG_TOKENS.paper,
          color: OG_TOKENS.ink,
          fontFamily: "DM Sans",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "DM Mono",
              fontSize: 24,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: OG_TOKENS.accent,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "DM Serif Display",
              fontSize: titleFontSize(title),
              lineHeight: 1.08,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                fontSize: 32,
                lineHeight: 1.35,
                color: OG_TOKENS.inkMuted,
                maxWidth: 1000,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", width: 96, height: 6, backgroundColor: OG_TOKENS.accent }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div style={{ display: "flex", fontFamily: "DM Serif Display", fontSize: 36 }}>
              {SITE_NAME}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "DM Mono",
                fontSize: 22,
                color: OG_TOKENS.inkMuted,
              }}
            >
              {domain}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE, fonts: await loadFonts() }
  );
}
