/**
 * Shared typographic constants for the CV page.
 *
 * These values were calibrated so the CV fits exactly two A4 pages when
 * printed. Do NOT change them without re-verifying the print layout.
 *
 * - `body`: base font size for all CV text
 * - `section`: used for narrative / paragraph body copy in sections such as
 *   Personal Summary, Leadership & Awards, Education, and Interests (11px)
 * - `sm`: slightly smaller — used for entry titles and bullet text in
 *   Employment, Projects, and Volunteering sections (9.5px)
 * - `xs`: smallest — used for dates, stack notes, meta labels, section badges
 */
export const CV_FONT_SIZES = {
  body: "11.5px",
  section: "11.5px",
  sm: "10px",
  xs: "10.5px",
} as const;

export type CVFontSizes = typeof CV_FONT_SIZES;
