import type { CVEmployment, CVSectionLink } from "@/lib/content";
import { CV_FONT_SIZES } from "@/lib/cv-config";
import { CVSection } from "./CVSection";
import { CVEntryRow } from "./CVEntryRow";
import { CVBulletList } from "./CVBulletList";

const { sm, xs } = CV_FONT_SIZES;

/** Props for CVEmploymentSection. */
interface CVEmploymentSectionProps {
  /** Array of employment entries from CV data. */
  employment: CVEmployment[];
  sectionLink?: CVSectionLink;
}

/**
 * CVEmploymentSection — renders the "Employment History" section.
 *
 * Each entry shows: company name, optional courses annotation, role, optional
 * tech stack — all on one EntryRow with the duration right-aligned — followed
 * by a bullet list.
 *
 * Gap between entries is `0.65em` per the calibrated print layout.
 */
export function CVEmploymentSection({ employment, sectionLink }: CVEmploymentSectionProps) {
  return (
    <CVSection
      label="Employment History"
      heading="Employment History"
      suffix={
        sectionLink && (
          <a
            href={sectionLink.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-accent)", textDecoration: "underline" }}
          >
            ({sectionLink.text})
          </a>
        )
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65em" }}>
        {employment.map((job, i) => (
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
                    {job.company}
                  </strong>

                  {job.courses && (
                    <span
                      style={{
                        fontSize: xs,
                        color: "var(--color-ink-muted)",
                        marginLeft: "0.4em",
                      }}
                    >
                      — {job.courses}
                    </span>
                  )}

                  <span
                    style={{
                      fontSize: xs,
                      color: "var(--color-ink-muted)",
                      marginLeft: "0.35em",
                    }}
                  >
                    | {job.role}
                  </span>

                  {job.stack && (
                    <em
                      style={{
                        fontSize: xs,
                        color: "var(--color-ink-muted)",
                        fontStyle: "italic",
                        marginLeft: "0.35em",
                      }}
                    >
                      — {job.stack}
                    </em>
                  )}
                </>
              }
              right={job.duration}
            />
            <CVBulletList bullets={job.bullets} bulletLinks={job.bulletLinks} />
          </div>
        ))}
      </div>
    </CVSection>
  );
}
