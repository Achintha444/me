/**
 * Shared typographic constants for the CV page.
 *
 * These values were calibrated so the CV fits exactly two A4 pages when
 * printed. Do NOT change them without re-verifying the print layout.
 *
 * - `body`: base font size for all CV text
 * - `sm`: slightly smaller — used for entry titles, bullet text, body copy
 * - `xs`: smallest — used for dates, stack notes, meta labels, section badges
 */
export const CV_FONT_SIZES = {
  body: "10.5px",
  sm: "9.5px",
  xs: "8.8px",
} as const;

export type CVFontSizes = typeof CV_FONT_SIZES;
