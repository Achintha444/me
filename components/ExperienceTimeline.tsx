import Image from "next/image";
import type { Experience } from "@/lib/types";
import { ScrollReveal } from "@/components/ScrollReveal";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

/**
 * ExperienceTimeline — a modern classic vertical timeline.
 *
 * Accessibility: ordered list for chronological sequence, each entry wrapped
 * in <li> with a <time> element for the date range. Heading hierarchy:
 * company → h2, detail sections → h3 (mono, uppercase label style).
 *
 * Responsive: vertical line on left edge for all viewports; on wider screens
 * the node dot aligns to the line with adequate gutter.
 *
 * Motion: respects prefers-reduced-motion (animations defined in globals.css
 * are suppressed via the existing media query).
 *
 * Server Component — no 'use client', hover effects via CSS classes only.
 */
export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <ol
      aria-label="Work experience in reverse chronological order"
      style={{
        listStyle: "none",
        position: "relative",
        paddingLeft: 0,
      }}
    >
      {experiences.map((exp, i) => {
        const [company, role, duration] = exp.title;
        const isLast = i === experiences.length - 1;

        return (
          <li
            key={i}
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "2.5rem 1fr",
              gap: "0 var(--space-5)",
              paddingBottom: isLast ? 0 : "var(--space-8)",
            }}
          >
            {/* ── Left gutter: vertical line + node dot ── */}
            <div
              aria-hidden="true"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Node dot */}
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-accent)",
                  border: "3px solid var(--color-paper)",
                  outline: "1.5px solid var(--color-accent)",
                  flexShrink: 0,
                  marginTop: "0.45rem",
                  zIndex: 1,
                  position: "relative",
                }}
              />
              {/* Connecting line (hidden on last entry) */}
              {!isLast && (
                <div
                  style={{
                    width: "1px",
                    flex: 1,
                    backgroundColor: "var(--color-ink-faint)",
                    marginTop: "var(--space-1)",
                  }}
                />
              )}
            </div>

            {/* ── Right: entry content ── */}
            <div style={{ minWidth: 0, paddingBottom: isLast ? 0 : "var(--space-2)" }}>
              <ScrollReveal delay={i * 70}>
                {/* Entry header */}
                <header style={{ marginBottom: "var(--space-4)" }}>
                  <h2
                    id={`exp-${i}-title`}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-2xl)",
                      color: "var(--color-ink)",
                      fontWeight: 400,
                      lineHeight: 1.2,
                      marginBottom: "0.35rem",
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
                      marginBottom: "0.375rem",
                    }}
                  >
                    {role}
                  </p>

                  <time
                    dateTime={duration}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-ink-muted)",
                      letterSpacing: "0.06em",
                      display: "inline-block",
                    }}
                  >
                    {duration}
                  </time>
                </header>

                {/* Entry detail sections */}
                <div
                  style={{
                    border: "1px solid var(--color-ink-faint)",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--color-paper-raised)",
                    overflow: "hidden",
                  }}
                >
                  {exp.content.map((section, si) => {
                    const body = section.body;
                    const isLastSection = si === exp.content.length - 1;

                    return (
                      <div
                        key={si}
                        style={{
                          padding: "var(--space-4) var(--space-5)",
                          borderBottom: isLastSection
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

                        {/* Body — string or bullet list */}
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
                                  listStyle: "none",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "var(--space-2)",
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
                                      paddingLeft: "1.1rem",
                                      position: "relative",
                                    }}
                                  >
                                    <span
                                      aria-hidden="true"
                                      style={{
                                        position: "absolute",
                                        left: 0,
                                        top: "0.72em",
                                        width: "4px",
                                        height: "4px",
                                        borderRadius: "50%",
                                        backgroundColor: "var(--color-accent)",
                                        flexShrink: 0,
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
                              marginTop: body ? "var(--space-3)" : 0,
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
                              marginTop: body ? "var(--space-3)" : 0,
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

                        {/* Presentation embeds */}
                        {section.presentations && section.presentations.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--space-3)",
                              marginTop: body ? "var(--space-3)" : 0,
                            }}
                          >
                            {section.presentations.map((pres) => (
                              <div
                                key={pres.link}
                                style={{
                                  position: "relative",
                                  width: "100%",
                                  paddingBottom: "56.25%",
                                  borderRadius: "var(--radius-md)",
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
              </ScrollReveal>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
