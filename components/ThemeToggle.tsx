"use client";

import { useTheme } from "@/hooks/useTheme";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "sys" },
  { value: "light",  label: "light" },
  { value: "dark",   label: "dark" },
];

/**
 * ThemeToggle — tri-state theme selector: System · Light · Dark.
 *
 * Design:
 * - DM Mono labels, thin border using --color-ink-faint.
 * - Active button gets --color-accent background.
 * - Keyboard accessible: each option is a <button> with aria-pressed.
 * - Focus ring uses --color-accent via :focus-visible in globals.css.
 * - Small enough to sit comfortably beside ⌘K hint in the header nav.
 *
 * Applied skill: vercel-react-best-practices — "use client" only at this
 * leaf; CSS variables handle all color theming without prop drilling.
 */
export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="theme-toggle"
    >
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={preference === value}
          onClick={() => setPreference(value)}
          className="theme-toggle-btn"
          title={
            value === "system"
              ? "Follow system setting"
              : value === "light"
              ? "Light mode"
              : "Dark mode"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
