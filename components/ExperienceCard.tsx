import Image from "next/image";
import type { Experience } from "@/lib/types";

/** Props for the ExperienceCard component. */
interface ExperienceCardProps {
  /** A single experience entry from `content/experience.json`. */
  experience: Experience;
  /** Position index, used for accessible labelling. */
  index: number;
}

/**
 * ExperienceCard — renders a single work experience entry.
 *
 * Handles all sub-section types: Technology Stack, Organization's Activities,
 * My Responsibilities, My Accomplishments, Challenges Faced — each with
 * optional body, images, links, and presentation embeds.
 *
 * Server Component — no event handlers, hover effects via CSS classes.
 */
export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const [company, role, duration] = experience.title;

  return (
    <article
      aria-labelledby={`exp-${index}-title`}
      style={{
        border: "1px solid var(--color-ink-faint)",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-paper-raised)",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "var(--space-5)",
          borderBottom: "1px solid var(--color-ink-faint)",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2
            id={`exp-${index}-title`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-2xl)",
              color: "var(--color-ink)",
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: "0.375rem",
            }}
          >
            {company}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-accent)",
              fontWeight: 500,
              marginBottom: "0.25rem",
            }}
          >
            {role}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-ink-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {duration}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "var(--space-5)" }}>
        {experience.content.map((section, si) => {
          const body = section.body;
          const isLast = si === experience.content.length - 1;

          return (
            <div
              key={si}
              style={{
                marginBottom: isLast ? 0 : "var(--space-5)",
                paddingBottom: isLast ? 0 : "var(--space-5)",
                borderBottom: isLast
                  ? "none"
                  : "1px solid var(--color-ink-faint)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-ink-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "var(--space-2)",
                }}
              >
                {section.title}
              </h3>

              {/* Body — string or array of bullet items */}
              {body && (
                <div>
                  {typeof body === "string" ? (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-base)",
                        color: "var(--color-ink-muted)",
                        lineHeight: 1.8,
                        maxWidth: "var(--text-max)",
                      }}
                    >
                      {body}
                    </p>
                  ) : (
                    <ul
                      role="list"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-2)",
                        listStyle: "none",
                        maxWidth: "var(--text-max)",
                      }}
                    >
                      {(body as { body: string }[]).map((item, bi) => (
                        <li
                          key={bi}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "var(--text-base)",
                            color: "var(--color-ink-muted)",
                            lineHeight: 1.8,
                            paddingLeft: "1rem",
                            position: "relative",
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              left: 0,
                              top: "0.6em",
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              backgroundColor: "var(--color-accent)",
                            }}
                          />
                          {item.body}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Images */}
              {section.images && section.images.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${Math.min(section.images.length, 3)}, 1fr)`,
                    gap: "var(--space-2)",
                    marginTop: "var(--space-3)",
                  }}
                >
                  {section.images.map((img, ii) => (
                    <div
                      key={ii}
                      style={{
                        position: "relative",
                        aspectRatio: "4/3",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        backgroundColor: "var(--color-accent-dim)",
                        border: "1px solid var(--color-ink-faint)",
                      }}
                    >
                      <Image
                        src={img.image}
                        alt={img.alt ?? `${company} image ${ii + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Links */}
              {section.links && section.links.length > 0 && (
                <ul
                  role="list"
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginTop: "var(--space-3)",
                  }}
                >
                  {section.links.map((link) => (
                    <li key={link.link}>
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-accent"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-sm)",
                          color: "var(--color-accent)",
                          textDecoration: "underline",
                          textDecorationColor: "var(--color-accent)",
                          textUnderlineOffset: "3px",
                        }}
                      >
                        {link.title} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {/* Presentations */}
              {section.presentations && section.presentations.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                    marginTop: "var(--space-3)",
                  }}
                >
                  {section.presentations.map((pres) => (
                    <div
                      key={pres.link}
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingBottom: "56.25%",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        border: "1px solid var(--color-ink-faint)",
                      }}
                    >
                      <iframe
                        src={pres.link}
                        title={`${company} presentation`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}
