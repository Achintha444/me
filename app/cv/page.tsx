import type { Metadata } from "next";
import { getCVData, type CVBulletLinks } from "@/lib/content";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae of Achintha Isuru — Front-end Developer and UI/UX Designer with 4+ years of experience building responsive web and mobile applications.",
};

// ─── Inline-link interpolation ────────────────────────────────────────────────

/**
 * Given a bullet string and its associated link map for that bullet index,
 * splits the text around each linked term and returns an array of React nodes
 * (plain strings and <a> elements). Safe: if a term is not found in the string
 * it is skipped silently.
 */
function renderBulletWithLinks(
  text: string,
  links: { text: string; url: string }[]
): React.ReactNode[] {
  // Work through the text left-to-right, replacing each term once.
  type Segment = { kind: "text"; value: string } | { kind: "link"; linkText: string; url: string };
  const segments: Segment[] = [{ kind: "text", value: text }];

  for (const { text: term, url } of links) {
    const next: Segment[] = [];
    for (const seg of segments) {
      if (seg.kind !== "text") {
        next.push(seg);
        continue;
      }
      const idx = seg.value.indexOf(term);
      if (idx === -1) {
        next.push(seg);
        continue;
      }
      if (idx > 0) next.push({ kind: "text", value: seg.value.slice(0, idx) });
      next.push({ kind: "link", linkText: term, url });
      const after = seg.value.slice(idx + term.length);
      if (after) next.push({ kind: "text", value: after });
    }
    segments.length = 0;
    segments.push(...next);
  }

  return segments.map((seg, i) =>
    seg.kind === "link" ? (
      <a
        key={i}
        href={seg.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "inherit", textDecoration: "underline" }}
      >
        {seg.linkText}
      </a>
    ) : (
      seg.value
    )
  );
}

/**
 * Renders a bullet list for an employment or project entry, applying any
 * inline hyperlinks defined in the `bulletLinks` map.
 */
function BulletList({
  bullets,
  bulletLinks,
}: {
  bullets: string[];
  bulletLinks?: CVBulletLinks;
}) {
  return (
    <ul
      style={{
        listStyle: "disc",
        paddingLeft: "1.1em",
        margin: "0.18em 0 0",
        display: "flex",
        flexDirection: "column",
        gap: "0.14em",
      }}
    >
      {bullets.map((bullet, i) => {
        const links = bulletLinks?.[String(i)] ?? [];
        return (
          <li key={i} style={{ lineHeight: 1.38, fontSize: "inherit" }}>
            {links.length > 0 ? renderBulletWithLinks(bullet, links) : bullet}
          </li>
        );
      })}
    </ul>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({
  children,
  suffix,
}: {
  children: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "0.5em",
        marginBottom: "0.35em",
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
        {children}
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
  );
}

// ─── Divider between section heading and content ──────────────────────────────

function EntryRow({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * CV page — server component. Reads all CV data from content/cv.json and
 * renders a print-optimised two-page A4 resume that also looks polished on screen.
 *
 * Applied skills:
 * - nextjs-app-router-patterns: pure Server Component, no 'use client'
 * - vercel-react-best-practices: composition over monolith, typed data
 */
export default function CVPage() {
  const cv = getCVData();

  // Shared font sizes kept as CSS custom properties for easy tweaking
  const body = "10.5px";
  const sm = "9.5px";
  const xs = "8.8px";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { size: A4; margin: 0; }
              header, footer, .skip-link, .cv-print-btn, [data-command-palette] {
                display: none !important;
              }
              #main-content { padding: 0 !important; margin: 0 !important; }
              body {
                background: #fff !important;
                color: #000 !important;
                font-size: 10px !important;
                line-height: 1.35 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .cv-wrapper {
                padding: 12mm 14mm !important;
                max-width: 100% !important;
              }
              .cv-entry { break-inside: avoid; }
              .cv-body a {
                color: #1a56db !important;
                text-decoration: underline !important;
              }
              .cv-section-heading { color: #C84B31 !important; }
            }
          `,
        }}
      />
      <div
        className="cv-wrapper"
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "var(--space-4) var(--space-4) var(--space-8)",
          fontFamily: "var(--font-body)",
          fontSize: body,
          color: "var(--color-ink)",
          lineHeight: 1.45,
        }}
    >
      {/* ── Print / Save button — hidden in print via .cv-print-btn ───────── */}
      <div
        className="cv-print-btn"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "var(--space-2)",
        }}
      >
        <PrintButton />
      </div>

      {/* ── CV body ────────────────────────────────────────────────────────── */}
      <div className="cv-body">
        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div
          role="banner"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "1em 2em",
            alignItems: "start",
            marginBottom: "0.55em",
            paddingBottom: "0.45em",
            borderBottom: "2px solid var(--color-accent)",
          }}
        >
          {/* Left: name, tagline, contact line */}
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
            {/* Contact + links in one line */}
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
              {cv.links.map((l, i) => (
                <span key={i}>
                  <span style={{ margin: "0 0.4em", opacity: 0.5 }}>·</span>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "underline" }}
                  >
                    {l.label}
                  </a>
                </span>
              ))}
            </p>
          </div>

          {/* Right: Skills block */}
          <div style={{ minWidth: "200px", maxWidth: "240px" }}>
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
            {(
              [
                ["Technologies", cv.skills.technologies],
                ["Languages", cv.skills.languages],
                ["Tools", cv.skills.tools],
                ["Design Tools", cv.skills.designTools],
                ["Spoken", cv.skills.spokenLanguages],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: "0.3em", marginBottom: "0.12em" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: xs,
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    whiteSpace: "nowrap",
                    minWidth: "70px",
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

        {/* ── PERSONAL SUMMARY ───────────────────────────────────────────── */}
        <section aria-label="Personal Summary" style={{ marginBottom: "0.5em" }}>
          <SectionHeading>Personal Summary</SectionHeading>
          <p style={{ fontSize: sm, lineHeight: 1.45, margin: 0 }}>
            {cv.summary}
          </p>
        </section>

        {/* ── EMPLOYMENT ─────────────────────────────────────────────────── */}
        <section aria-label="Employment History" style={{ marginBottom: "0.5em" }}>
          <SectionHeading
            suffix={
              <a
                href="/experiences"
                style={{ color: "var(--color-accent)", textDecoration: "underline" }}
              >
                (View All Experiences)
              </a>
            }
          >
            Employment History
          </SectionHeading>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.42em" }}>
            {cv.employment.map((job, i) => (
              <div key={i} className="cv-entry">
                <EntryRow
                  left={
                    <>
                      <strong
                        style={{ fontSize: sm, fontWeight: 700, color: "var(--color-ink)" }}
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
                <BulletList
                  bullets={job.bullets}
                  bulletLinks={job.bulletLinks}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── SELECTED PROJECTS ──────────────────────────────────────────── */}
        <section aria-label="Selected Projects" style={{ marginBottom: "0.5em" }}>
          <SectionHeading
            suffix={
              <a
                href="/projects"
                style={{ color: "var(--color-accent)", textDecoration: "underline" }}
              >
                (View All Projects)
              </a>
            }
          >
            Selected Projects
          </SectionHeading>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.38em" }}>
            {cv.projects.map((proj, i) => (
              <div key={i} className="cv-entry">
                <EntryRow
                  left={
                    <>
                      <strong
                        style={{ fontSize: sm, fontWeight: 700, color: "var(--color-ink)" }}
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
                <BulletList
                  bullets={proj.bullets}
                  bulletLinks={proj.bulletLinks}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── LEADERSHIP & AWARDS ────────────────────────────────────────── */}
        <section aria-label="Leadership and Awards" style={{ marginBottom: "0.5em" }}>
          <SectionHeading
            suffix={
              <a
                href="/aboutMe"
                style={{ color: "var(--color-accent)", textDecoration: "underline" }}
              >
                (View All Awards)
              </a>
            }
          >
            Leadership &amp; Awards
          </SectionHeading>

          <ul
            style={{
              listStyle: "disc",
              paddingLeft: "1.1em",
              display: "flex",
              flexDirection: "column",
              gap: "0.13em",
            }}
          >
            {cv.leadership.map((item, i) => (
              <li key={i} style={{ fontSize: sm, lineHeight: 1.38 }}>
                {item.text}
                {item.link && (
                  <>
                    {" "}
                    <a
                      href={item.link.url}
                      target={item.link.url.startsWith("http") ? "_blank" : undefined}
                      rel={item.link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{
                        color: "var(--color-accent)",
                        textDecoration: "underline",
                        fontSize: xs,
                      }}
                    >
                      {item.link.text}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ── VOLUNTEERING ───────────────────────────────────────────────── */}
        <section aria-label="Volunteering Experiences" style={{ marginBottom: "0.5em" }}>
          <SectionHeading>Volunteering Experiences</SectionHeading>

          {cv.volunteering.map((vol, i) => (
            <div key={i} className="cv-entry">
              <strong style={{ fontSize: sm, fontWeight: 700 }}>
                {vol.link ? (
                  <a
                    href={vol.link.url}
                    target={vol.link.url.startsWith("http") ? "_blank" : undefined}
                    rel={vol.link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ color: "inherit", textDecoration: "underline" }}
                  >
                    {vol.organization}
                  </a>
                ) : (
                  vol.organization
                )}
              </strong>
              <BulletList bullets={vol.bullets} />
            </div>
          ))}
        </section>

        {/* ── EDUCATION ──────────────────────────────────────────────────── */}
        <section aria-label="Education" style={{ marginBottom: "0.5em" }}>
          <SectionHeading>Education</SectionHeading>

          <div className="cv-entry">
            <EntryRow
              left={
                <>
                  <strong style={{ fontSize: sm, fontWeight: 700 }}>
                    {cv.education.university}
                  </strong>
                  <span
                    style={{
                      fontSize: xs,
                      color: "var(--color-ink-muted)",
                      marginLeft: "0.4em",
                    }}
                  >
                    ({cv.education.accreditation}
                    {cv.education.wesLink && (
                      <>
                        ,{" "}
                        <a
                          href={cv.education.wesLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "inherit", textDecoration: "underline" }}
                        >
                          {cv.education.wesLink.text}
                        </a>
                      </>
                    )}
                    )
                  </span>
                </>
              }
              right={cv.education.duration}
            />
            <p style={{ fontSize: sm, margin: "0.1em 0 0" }}>
              {cv.education.degree}
              <span
                style={{
                  color: "var(--color-ink-muted)",
                  marginLeft: "0.5em",
                  fontSize: xs,
                }}
              >
                · {cv.education.gpa}
              </span>
              {cv.education.researchLink && (
                <>
                  {" "}
                  <a
                    href={cv.education.researchLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--color-accent)",
                      textDecoration: "underline",
                      fontSize: xs,
                    }}
                  >
                    {cv.education.researchLink.text}
                  </a>
                </>
              )}
            </p>

            {/* Coursera certificates */}
            <p
              style={{
                fontSize: xs,
                color: "var(--color-ink-muted)",
                margin: "0.2em 0 0",
              }}
            >
              <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                Coursera Certificates
              </strong>
              {cv.education.coursera.certificatesLink && (
                <>
                  {" "}
                  <a
                    href={cv.education.coursera.certificatesLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-accent)", textDecoration: "underline" }}
                  >
                    ({cv.education.coursera.certificatesLink.text})
                  </a>
                </>
              )}
              :{" "}
              {cv.education.coursera.courses.map((c, i) => (
                <span key={i}>
                  {i > 0 && <span style={{ margin: "0 0.3em", opacity: 0.5 }}>·</span>}
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
        </section>

        {/* ── INTERESTS ──────────────────────────────────────────────────── */}
        <section aria-label="Interests">
          <SectionHeading>Interests</SectionHeading>
          <p style={{ fontSize: sm, margin: 0, color: "var(--color-ink-muted)" }}>
            {cv.interests}
          </p>
        </section>
      </div>
    </div>
    </>
  );
}
