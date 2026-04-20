"use client";

/**
 * Error boundary page — catches runtime errors in the page tree.
 * Must be a Client Component to receive the error prop.
 * Applied skill: nextjs — error.tsx file convention.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section
      aria-label="Error"
      style={{
        paddingBlock: "var(--section-py)",
        display: "flex",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <div className="container-content">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-accent)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            display: "block",
            marginBottom: "var(--space-3)",
          }}
        >
          Error
        </span>
        <h1
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "var(--text-4xl)",
            color: "var(--color-ink)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: "var(--space-4)",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-ink-muted)",
            lineHeight: 1.8,
            marginBottom: "var(--space-6)",
            maxWidth: "480px",
          }}
        >
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          style={{
            display: "inline-block",
            padding: "0.75rem 1.75rem",
            backgroundColor: "var(--color-accent)",
            color: "var(--color-paper-raised)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            borderRadius: "var(--radius-md)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </section>
  );
}
