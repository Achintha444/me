/**
 * CVEntryRow — a flex row with a left content region and a right-aligned
 * monospaced duration string, used for employment, project, and education
 * entries.
 */

/** Props for CVEntryRow. */
interface CVEntryRowProps {
  /** Primary left-hand content (title, company, role chips). */
  left: React.ReactNode;
  /** Right-hand content — typically a date range string. */
  right: React.ReactNode;
}

/**
 * Renders a two-column flex row: left region expands to fill available width;
 * right region is a non-wrapping monospaced date label.
 */
export function CVEntryRow({ left, right }: CVEntryRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: "0.5em",
      }}
    >
      <div style={{ flex: 1 }}>{left}</div>
      <div
        style={{
          flexShrink: 0,
          fontFamily: "var(--font-mono)",
          fontSize: "0.72em",
          color: "var(--color-ink-muted)",
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        {right}
      </div>
    </div>
  );
}
