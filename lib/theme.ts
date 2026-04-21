/**
 * lib/theme.ts — pure theme logic, zero React imports.
 *
 * Provides:
 *   - Types for tri-state preference and resolved theme
 *   - Storage key constant
 *   - resolveTheme() — maps preference + system state to resolved value
 *   - applyTheme()   — writes data-theme attribute on <html>
 *   - themeColors    — Three.js material colors keyed by resolved theme
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

// ─── Storage key ──────────────────────────────────────────────────────────────

export const THEME_STORAGE_KEY = "theme-preference";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolves a tri-state preference to a concrete "light" | "dark" value.
 * When preference is "system", defers to the matchMedia API.
 */
export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

/**
 * Applies the resolved theme by setting `data-theme` on `<html>`.
 * Only call in client context.
 */
export function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = resolved;
  }
}

// ─── Three.js color map ───────────────────────────────────────────────────────

export interface ThemeColors {
  /** Wireframe (design half) line color */
  wireframe: string;
  /** Solid (dev half) mesh base color */
  solid: string;
  /** Full-wireframe seam glow color */
  seam: string;
  /** Ambient light color */
  ambient: string;
  /** Key directional light color */
  keyLight: string;
  /** Rim directional light color */
  rimLight: string;
  /** Terracotta bounce point light color */
  bounce: string;
}

export const themeColors: Record<ResolvedTheme, ThemeColors> = {
  light: {
    wireframe: "#A83A23",
    solid:     "#E8E0D6",
    seam:      "#0F0E0D",
    ambient:   "#FFF5EE",
    keyLight:  "#FFFFFF",
    rimLight:  "#E8D5C0",
    bounce:    "#C84B31",
  },
  dark: {
    wireframe: "#E8714E",
    solid:     "#3D2820",
    seam:      "#EDE6DD",
    ambient:   "#2A1F1A",
    keyLight:  "#FFE8D6",
    rimLight:  "#C86040",
    bounce:    "#E8714E",
  },
};
