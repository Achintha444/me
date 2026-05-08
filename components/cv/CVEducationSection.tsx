import type { CVEducation } from "@/lib/content";
import { CV_FONT_SIZES } from "@/lib/cv-config";
import { CVSection } from "./CVSection";
import { CVEntryRow } from "./CVEntryRow";

const { section, xs } = CV_FONT_SIZES;

/** Props for CVEducationSection. */
interface CVEducationSectionProps {
  /** Education data from the CV. */
  education: CVEducation;
}

/**
 * CVEducationSection — renders the "Education" section.
 *
 * Shows: university name + accreditation (with optional WES link), duration
 * right-aligned, degree + GPA, optional research paper link, and a list of
 * Coursera certificates with hyperlinks.
 */
export function CVEducationSection({ education }: CVEducationSectionProps) {
  return (
    <CVSection label="Education" heading="Education">
      <div className="cv-entry">
        <CVEntryRow
          left={
            <>
              <strong style={{ fontSize: section, fontWeight: 700 }}>
                {education.university}
              </strong>
              <span
                style={{
                  fontSize: xs,
                  color: "var(--color-ink-muted)",
                  marginLeft: "0.4em",
                }}
              >
                ({education.accreditation}
                {education.wesLink && (
                  <>
                    ,{" "}
                    <a
                      href={education.wesLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "inherit", textDecoration: "underline" }}
                    >
                      {education.wesLink.text}
                    </a>
                  </>
                )}
                )
              </span>
            </>
          }
          right={education.duration}
        />

        {/* Degree + GPA + optional research link */}
        <p style={{ fontSize: section, margin: "0.1em 0 0" }}>
          {education.degree}
          <span
            style={{
              color: "var(--color-ink-muted)",
              marginLeft: "0.5em",
              fontSize: xs,
            }}
          >
            · {education.gpa}
          </span>
          {education.researchLink && (
            <>
              {" "}
              <a
                href={education.researchLink.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--color-accent)",
                  textDecoration: "underline",
                  fontSize: xs,
                }}
              >
                {education.researchLink.text}
              </a>
            </>
          )}
        </p>

        {/* Coursera certificates — same format as Selected Projects heading */}
        <div style={{ margin: "0.3em 0 0" }}>
          <p style={{ fontSize: section, margin: 0 }}>
            <strong style={{ fontWeight: 700 }}>
              Coursera Certificates
            </strong>
            {education.coursera.certificatesLink && (
              <>
                {" "}
                <a
                  href={education.coursera.certificatesLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--color-accent)",
                    textDecoration: "underline",
                    fontSize: xs,
                  }}
                >
                  ({education.coursera.certificatesLink.text})
                </a>
              </>
            )}
          </p>
          <p
            style={{
              fontSize: xs,
              color: "var(--color-ink-muted)",
              margin: "0.1em 0 0",
            }}
          >
            {education.coursera.courses.map((c, i) => (
              <span key={i}>
                {i > 0 && (
                  <span style={{ margin: "0 0.3em", opacity: 0.5 }}>·</span>
                )}
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {c.name}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </CVSection>
  );
}
