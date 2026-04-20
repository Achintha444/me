import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProjectsData } from "@/lib/content";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Design and development projects by Achintha Isuru — UI/UX case studies, mobile apps, Flutter packages, and front-end work.",
};

/**
 * Projects list page — server component.
 * Displays all projects as a responsive card grid.
 * Hover effects via CSS `.project-card` class.
 */
export default function ProjectsPage() {
  const { pageTitle, projects } = getProjectsData();

  return (
    <>
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <section
        aria-label="Page header"
        style={{
          paddingBlock: "var(--space-16) var(--space-10)",
          borderBottom: "1px solid var(--color-ink-faint)",
        }}
      >
        <div className="container-content">
          <ScrollReveal>
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
              Work
            </span>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-4xl)",
                color: "var(--color-ink)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              {pageTitle}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Projects Grid ─────────────────────────────────────────────── */}
      <section
        aria-label="Projects grid"
        style={{ paddingBlock: "var(--section-py)" }}
      >
        <div className="container-content">
          <ul
            role="list"
            aria-label="All projects"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--space-4)",
              listStyle: "none",
            }}
          >
            {projects.map((project, i) => (
              <li key={project.key}>
                <ScrollReveal delay={i * 60}>
                  <Link
                    href={`/projects/${project.key}`}
                    className="project-card"
                    style={{
                      display: "block",
                      border: "1px solid var(--color-ink-faint)",
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      backgroundColor: "var(--color-paper-raised)",
                      textDecoration: "none",
                      height: "100%",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "16/9",
                        backgroundColor: "var(--color-accent-dim)",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={`/${project.image}`}
                        alt={project.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ padding: "var(--space-4)" }}>
                      {project.role && (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "var(--text-xs)",
                            color: "var(--color-accent)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            display: "block",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {project.role}
                        </span>
                      )}
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-xl)",
                          color: "var(--color-ink)",
                          fontWeight: 400,
                          lineHeight: 1.3,
                          marginBottom: "var(--space-3)",
                        }}
                      >
                        {project.name}
                      </h2>

                      {project.overview && project.overview.length > 0 && (
                        <dl
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "var(--space-3)",
                          }}
                        >
                          {project.overview.slice(0, 2).map((item) => (
                            <div key={item.key}>
                              <dt
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "var(--text-xs)",
                                  color: "var(--color-ink-muted)",
                                }}
                              >
                                {item.title}
                              </dt>
                              <dd
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: "var(--text-xs)",
                                  color: "var(--color-ink)",
                                  fontWeight: 500,
                                }}
                              >
                                {item.body}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-xs)",
                          color: "var(--color-accent)",
                          fontWeight: 500,
                          marginTop: "var(--space-3)",
                        }}
                      >
                        View case study →
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
