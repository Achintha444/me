/**
 * CVSection — wraps a CV content block with a labelled `<section>` element
 * and a styled section heading rule.
 *
 * The heading renders as `<h2>` with an accent-coloured horizontal rule,
 * matching the `SectionHeading` pattern that was inline in page.tsx.
 */

/** Props for CVSection. */
interface CVSectionProps {
  /** `aria-label` value for the wrapping `<section>`. */
  label: string;
  /** The section heading text (e.g. "Employment History"). */
  heading: React.ReactNode;
  /**
   * Optional suffix rendered to the right of the heading text — used for
   * "(View All …)" links.
   */
  suffix?: React.ReactNode;
  /** Section body content. */
  children: React.ReactNode;
  /** Whether to suppress the default `0.9em` bottom margin (e.g. on the last section). */
  last?: boolean;
}

/**
 * Renders the shared section heading chrome (accent-coloured uppercase label
 * + horizontal rule) and wraps children in a semantic `<section>`.
 */
export function CVSection({
  label,
  heading,
  suffix,
  children,
  last = false,
}: CVSectionProps) {
  return (
    <section
      aria-label={label}
      style={{ marginBottom: last ? undefined : "0.9em" }}
    >
      {/* Heading row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.5em",
          marginBottom: "0.5em",
        }}
      >
        <h2
          className="cv-section-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.82em",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            lineHeight: 1,
            margin: 0,
          }}
        >
          {heading}
        </h2>

        {suffix && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75em",
              color: "var(--color-ink-muted)",
              fontWeight: 400,
            }}
          >
            {suffix}
          </span>
        )}

        {/* Decorative rule */}
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "var(--color-accent)",
            opacity: 0.5,
            alignSelf: "center",
          }}
        />
      </div>

      {children}
    </section>
  );
}
