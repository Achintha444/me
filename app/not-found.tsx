import Link from "next/link";

/**
 * 404 not-found page — shown when a route is not matched.
 * Applied skill: nextjs — file-based not-found.tsx convention.
 */
export default function NotFoundPage() {
  return (
    <section
      aria-label="Page not found"
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
            color: "var(--color-ink-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            display: "block",
            marginBottom: "var(--space-3)",
          }}
        >
          404
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
          Page not found
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
          This page doesn&apos;t exist or has been moved. Try navigating back
          to the home page.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.75rem",
            backgroundColor: "var(--color-accent)",
            color: "var(--color-paper-raised)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            borderRadius: "var(--radius-md)",
          }}
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
