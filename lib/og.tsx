import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

/**
 * Render scale. Cards are laid out on the standard 1200×630 grid and rendered
 * at 2×: LinkedIn treats 1200×627 as a minimum and recompresses/upscales
 * previews on high-density screens, which blurs a 1× image.
 */
const OG_SCALE = 2;

/** Open Graph image dimensions: 1.91:1, rendered at {@link OG_SCALE}×. */
export const OG_IMAGE_SIZE = { width: 1200 * OG_SCALE, height: 630 * OG_SCALE };

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

/**
 * Converts a length on the 1200×630 layout grid to rendered pixels.
 *
 * @param value - Length in layout pixels.
 * @returns Length in rendered pixels.
 */
function px(value: number): number {
  return value * OG_SCALE;
}

/** Padding of the card, in layout pixels. */
const CARD_PADDING = 80;

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
 * Sizes stay large because feeds show the card at a fraction of its width.
 *
 * @param title - The headline text.
 * @returns Font size in layout pixels.
 */
function titleFontSize(title: string): number {
  if (title.length <= 32) return 96;
  if (title.length <= 44) return 80;
  return 64;
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
 * Renders a 1.91:1 PNG share card in the portfolio's editorial style: paper
 * background, mono eyebrow, serif headline, sans subtitle, and a terracotta
 * accent rule above the site name. The domain is omitted because LinkedIn,
 * X and Slack print it under the card themselves.
 *
 * @param input - Eyebrow, title and optional subtitle text.
 * @returns An ImageResponse suitable as an `opengraph-image` route's result.
 */
export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: OgImageInput): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: px(CARD_PADDING),
          backgroundColor: OG_TOKENS.paper,
          color: OG_TOKENS.ink,
          fontFamily: "DM Sans",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: px(24) }}>
          <div
            style={{
              display: "flex",
              fontFamily: "DM Mono",
              fontSize: px(30),
              letterSpacing: "0.1em",
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
              fontSize: px(titleFontSize(title)),
              lineHeight: 1.05,
              maxWidth: px(1040),
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                fontSize: px(38),
                lineHeight: 1.3,
                color: OG_TOKENS.inkMuted,
                maxWidth: px(1040),
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: px(24) }}>
          <div style={{ display: "flex", width: px(64), height: px(6), backgroundColor: OG_TOKENS.accent }} />
          <div style={{ display: "flex", fontFamily: "DM Serif Display", fontSize: px(44) }}>
            {SITE_NAME}
          </div>
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE, fonts: await loadFonts() }
  );
}
