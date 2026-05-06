"use client";

/**
 * Minimal client component that triggers window.print().
 * Kept isolated so the CV page itself remains a Server Component.
 * Hidden in print via the .cv-print-btn class in globals.css.
 */
export function PrintButton() {
  return (
    <button
      className="cv-print-btn btn-outline"
      onClick={() => window.print()}
      aria-label="Print or save this CV as a PDF"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        letterSpacing: "0.06em",
        padding: "0.4em 1.1em",
        border: "1px solid var(--color-accent)",
        borderRadius: "var(--radius-sm)",
        background: "transparent",
        color: "var(--color-accent)",
        cursor: "pointer",
      }}
    >
      Print / Save as PDF
    </button>
  );
}
