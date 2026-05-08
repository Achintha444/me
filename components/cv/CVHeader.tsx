import type { CVData } from "@/lib/content";
import { CV_FONT_SIZES } from "@/lib/cv-config";

const { xs } = CV_FONT_SIZES;

/** Props for CVHeader. */
interface CVHeaderProps {
  /** The full CV data object — only name/tagline/contact/links/skills are used. */
  cv: Pick<CVData, "name" | "tagline" | "contact" | "links" | "skills">;
}

/**
 * CVHeader — the two-column banner at the top of the CV.
 *
 * Left column: name, tagline, single-line contact + links row.
 * Right column: compact skills table (Technologies, Languages, Tools, …).
 *
 * Uses `role="banner"` because this is the document-level page header content
 * (the site `<header>` is hidden in print).
 */
export function CVHeader({ cv }: CVHeaderProps) {
  const skillRows: [string, string][] = [
    ["Technologies", cv.skills.technologies],
    ["Languages", cv.skills.languages],
    ["Tools", cv.skills.tools],
    ["Design Tools", cv.skills.designTools],
    ["Spoken", cv.skills.spokenLanguages],
  ];

  return (
    <div
      role="banner"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "1em 2em",
        alignItems: "start",
        marginBottom: "0.8em",
        paddingBottom: "0.5em",
      }}
    >
      {/* ── Left: name, tagline, contact ──────────────────────────── */}
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.7em",
            fontWeight: 700,
            lineHeight: 1.05,
            margin: 0,
            color: "var(--color-ink)",
          }}
        >
          {cv.name}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: xs,
            color: "var(--color-accent)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "0.22em 0 0.45em",
          }}
        >
          {cv.tagline}
        </p>

        {/* Contact row */}
        <p
          style={{
            fontSize: xs,
            color: "var(--color-ink-muted)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          <span>{cv.contact.address}</span>
          <span style={{ margin: "0 0.4em", opacity: 0.5 }}>·</span>
          <a
            href={`mailto:${cv.contact.email}`}
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            {cv.contact.email}
          </a>
          <span style={{ margin: "0 0.4em", opacity: 0.5 }}>·</span>
          <span>{cv.contact.phone}</span>
        </p>

        {/* Links — split into two rows */}
        {(() => {
          const row1 = cv.links.filter((l) =>
            ["LinkedIn", "GitHub", "Portfolio"].includes(l.label)
          );
          const row2 = cv.links.filter(
            (l) => !["LinkedIn", "GitHub", "Portfolio"].includes(l.label)
          );
          const renderRow = (links: typeof cv.links) =>
            links.map((l, i) => (
              <span key={l.label}>
                {i > 0 && (
                  <span style={{ margin: "0 0.4em", opacity: 0.5 }}>·</span>
                )}
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {l.label}
                </a>
              </span>
            ));
          return (
            <div
              style={{
                fontSize: xs,
                color: "var(--color-ink-muted)",
                lineHeight: 1.5,
                marginTop: "0.15em",
              }}
            >
              <p style={{ margin: 0 }}>{renderRow(row1)}</p>
              <p style={{ margin: 0 }}>{renderRow(row2)}</p>
            </div>
          );
        })()}
      </div>

      {/* ── Right: Skills block ────────────────────────────────────── */}
      <div style={{ minWidth: "240px", maxWidth: "320px" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: xs,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: "0.3em",
          }}
        >
          Skills
        </p>

        {skillRows.map(([label, value]) => (
          <div
            key={label}
            style={{ display: "flex", gap: "0.3em", marginBottom: "0.12em" }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: xs,
                fontWeight: 600,
                color: "var(--color-ink)",
                whiteSpace: "nowrap",
                minWidth: "90px",
              }}
            >
              {label}:
            </span>
            <span
              style={{
                fontSize: xs,
                color: "var(--color-ink-muted)",
                lineHeight: 1.35,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
