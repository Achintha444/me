import type { CVProject } from "@/lib/content";
import { CV_FONT_SIZES } from "@/lib/cv-config";
import { CVSection } from "./CVSection";
import { CVEntryRow } from "./CVEntryRow";
import { CVBulletList } from "./CVBulletList";

const { sm, xs } = CV_FONT_SIZES;

/** Props for CVProjectsSection. */
interface CVProjectsSectionProps {
  /** Array of project entries from CV data. */
  projects: CVProject[];
}

/**
 * CVProjectsSection — renders the "Selected Projects" section.
 *
 * Each entry shows: project name, type in parentheses, optional role, optional
 * stack — all on one EntryRow with the duration right-aligned — followed by
 * a bullet list.
 *
 * Gap between entries is `0.6em` per the calibrated print layout.
 */
export function CVProjectsSection({ projects }: CVProjectsSectionProps) {
  return (
    <CVSection
      label="Selected Projects"
      heading="Selected Projects"
      suffix={
        <a
          href="/projects"
          style={{ color: "var(--color-accent)", textDecoration: "underline" }}
        >
          (View All Projects)
        </a>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6em" }}>
        {projects.map((proj, i) => (
          <div key={i} className="cv-entry">
            <CVEntryRow
              left={
                <>
                  <strong
                    style={{
                      fontSize: sm,
                      fontWeight: 700,
                      color: "var(--color-ink)",
                    }}
                  >
                    {proj.name}
                  </strong>

                  <span
                    style={{
                      fontSize: xs,
                      color: "var(--color-ink-muted)",
                      marginLeft: "0.25em",
                    }}
                  >
                    ({proj.type})
                  </span>

                  {proj.role && (
                    <span
                      style={{
                        fontSize: xs,
                        color: "var(--color-ink-muted)",
                        marginLeft: "0.35em",
                      }}
                    >
                      | {proj.role}
                    </span>
                  )}

                  {proj.stack && (
                    <em
                      style={{
                        fontSize: xs,
                        color: "var(--color-ink-muted)",
                        fontStyle: "italic",
                        marginLeft: "0.35em",
                      }}
                    >
                      — {proj.stack}
                    </em>
                  )}
                </>
              }
              right={proj.duration}
            />
            <CVBulletList
              bullets={proj.bullets}
              bulletLinks={proj.bulletLinks}
            />
          </div>
        ))}
      </div>
    </CVSection>
  );
}
