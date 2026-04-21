import { HeroSceneWrapper } from "@/components/HeroSceneWrapper";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getIndexData, getProjectsData } from "@/lib/content";
import { getMediumPosts } from "@/lib/medium";
import type { ContactIcon } from "@/lib/types";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Achintha Isuru — Bridging Design and Development",
  description:
    "Portfolio of Achintha Isuru — bridging design and development with Flutter, React, and Next.js.",
};

/** Technology stack chips shown in the hero section. */
const TECH_STACK = [
  "React",
  "Next.js",
  "Flutter",
  "TypeScript",
  "Figma",
  "Tailwind CSS",
] as const;

/** Maximum number of projects shown on the home page. */
const RECENT_PROJECTS_LIMIT = 3;

/** Maximum number of blog posts shown on the home page. */
const RECENT_POSTS_LIMIT = 3;

/**
 * Home page — server component.
 * Renders the hero, about snippet, recent projects, recent writing, and
 * contact sections. Hover states are applied via CSS utility classes.
 */
export default async function HomePage() {
  const indexData = getIndexData();
  const projectsData = getProjectsData();
  const allPosts = await getMediumPosts();

  const aboutSection = indexData.content.find((s) => s.id === 2);
  const contactSection = indexData.content.find((s) => s.id === 6);
  const recentProjects = projectsData.projects.slice(0, RECENT_PROJECTS_LIMIT);
  const recentPosts = allPosts.slice(0, RECENT_POSTS_LIMIT);

  const contactIcons = contactSection?.icons as ContactIcon[] | undefined;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        aria-label="Introduction"
        style={{
          paddingBlock: "var(--section-py)",
          borderBottom: "1px solid var(--color-ink-faint)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container-content" style={{ position: "relative", zIndex: 1 }}>
          {/*
           * Two-column grid on desktop (≥768px): text left, 3D right.
           * On mobile: text first, then the 3D canvas below at a fixed height.
           * The canvas column has a subtle left-edge fade so the shape doesn't
           * hard-clip against the text column gutter.
           */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "var(--space-8)",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* ── Text column ── */}
            <div
              style={{
                display: "grid",
                gap: "var(--space-3)",
              }}
            >
              {/* Available badge */}
              <div className="reveal" style={{ animationDelay: "0ms" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-accent)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    paddingInline: "0.75rem",
                    paddingBlock: "0.375rem",
                    border: "1px solid var(--color-accent)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-accent)",
                      display: "inline-block",
                    }}
                  />
                  Available for opportunities
                </span>
              </div>

              {/* Name — confident, no effects */}
              <div className="reveal" style={{ animationDelay: "100ms" }}>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-hero)",
                    lineHeight: 1.05,
                    color: "var(--color-ink)",
                    letterSpacing: "-0.02em",
                    fontWeight: 400,
                  }}
                >
                  Achintha
                  <br />
                  Isuru
                </h1>
              </div>

              {/* Role tagline */}
              <div className="reveal" style={{ animationDelay: "200ms" }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xl)",
                    color: "var(--color-ink-muted)",
                    fontWeight: 300,
                    lineHeight: 1.4,
                    maxWidth: "none",
                  }}
                >
                  Bridging{" "}
                  <span
                    style={{
                      color: "var(--color-accent)",
                      fontWeight: 500,
                      textDecoration: "underline",
                      textDecorationColor: "var(--color-accent)",
                      textUnderlineOffset: "4px",
                      textDecorationThickness: "2px",
                    }}
                  >
                    design
                  </span>{" "}
                  and{" "}
                  <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>
                    development
                  </span>
                  .
                </p>
              </div>

              {/* Tech stack chips */}
              <div className="reveal" style={{ animationDelay: "280ms" }}>
                <ul
                  role="list"
                  aria-label="Technology stack"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    listStyle: "none",
                  }}
                >
                  {TECH_STACK.map((tech) => (
                    <li key={tech}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-xs)",
                          color: "var(--color-ink-muted)",
                          backgroundColor: "var(--color-paper-raised)",
                          border: "1px solid var(--color-ink-faint)",
                          borderRadius: "var(--radius-sm)",
                          padding: "0.25rem 0.625rem",
                          display: "inline-block",
                        }}
                      >
                        {tech}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div
                className="reveal"
                style={{
                  animationDelay: "360ms",
                  display: "flex",
                  gap: "var(--space-2)",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/projects"
                  className="btn-primary"
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 1.75rem",
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-paper-raised)",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  View Work
                </Link>
                <a
                  href="https://drive.google.com/file/d/14g3EqlEhuDKGFSL3x1lwHD5oCHBANBVF/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 1.75rem",
                    backgroundColor: "transparent",
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    border: "1px solid var(--color-ink-faint)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  Download CV ↗
                </a>
              </div>
              {/* ── end text column ── */}
            </div>

            {/* ── 3D canvas column ── */}
            <div
              aria-hidden="true"
              style={{
                position: "relative",
                height: "clamp(340px, 65vw, 580px)",
                // Fade the left edge slightly so the shape blends into the gutter
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 12%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 12%)",
              }}
            >
              {/* Soft radial glow behind the shape — anchors it visually */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 70% 70% at 50% 50%, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <HeroSceneWrapper />
            </div>
          </div>
          {/* ── end hero grid ── */}
        </div>
      </section>

      {/* ── About Snippet ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="about-heading"
        style={{
          paddingBlock: "var(--section-py)",
          borderBottom: "1px solid var(--color-ink-faint)",
        }}
      >
        <div className="container-content">
          <div
            style={{
              display: "grid",
              gap: "var(--space-4)",
            }}
          >
            <ScrollReveal>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-ink-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                About
              </span>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h2
                id="about-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-3xl)",
                  color: "var(--color-ink)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                {aboutSection?.title ?? "Bridging Design and Development"}
              </h2>
            </ScrollReveal>

            {aboutSection?.content?.map(
              (
                block: {
                  content?: { body: string; key: string }[];
                  key?: string;
                }
              ) =>
                block.content?.map((item) => (
                  <ScrollReveal key={item.key} delay={160}>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-base)",
                        color: "var(--color-ink-muted)",
                        lineHeight: 1.8,
                      }}
                    >
                      {item.body}
                    </p>
                  </ScrollReveal>
                ))
            )}

            <ScrollReveal delay={240}>
              <Link
                href="/aboutMe"
                className="hover-accent"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                  textDecoration: "underline",
                  textDecorationColor: "var(--color-accent)",
                  textUnderlineOffset: "4px",
                }}
              >
                Read more about me →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Recent Projects ────────────────────────────────────────────── */}
      <section
        aria-labelledby="projects-heading"
        style={{
          paddingBlock: "var(--section-py)",
          borderBottom: "1px solid var(--color-ink-faint)",
        }}
      >
        <div className="container-content">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "var(--space-8)",
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
          >
            <ScrollReveal>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-ink-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Work
                </p>
                <h2
                  id="projects-heading"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-3xl)",
                    color: "var(--color-ink)",
                    fontWeight: 400,
                  }}
                >
                  Recent Projects
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <Link
                href="/projects"
                className="hover-accent"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-accent)",
                  fontWeight: 500,
                  textDecoration: "underline",
                  textDecorationColor: "var(--color-accent)",
                  textUnderlineOffset: "4px",
                }}
              >
                View all →
              </Link>
            </ScrollReveal>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {recentProjects.map((project, i) => (
              <ScrollReveal key={project.key} delay={i * 80}>
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
                  }}
                >
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
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
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
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-xl)",
                        color: "var(--color-ink)",
                        fontWeight: 400,
                        lineHeight: 1.3,
                      }}
                    >
                      {project.name}
                    </h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Writing ──────────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section
          aria-labelledby="writing-heading"
          style={{
            paddingBlock: "var(--section-py)",
            borderBottom: "1px solid var(--color-ink-faint)",
          }}
        >
          <div className="container-content">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "var(--space-8)",
                flexWrap: "wrap",
                gap: "var(--space-2)",
              }}
            >
              <ScrollReveal>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-ink-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Writing
                  </p>
                  <h2
                    id="writing-heading"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-3xl)",
                      color: "var(--color-ink)",
                      fontWeight: 400,
                    }}
                  >
                    From the Blog
                  </h2>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={80}>
                <Link
                  href="/blog"
                  className="hover-accent"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-accent)",
                    fontWeight: 500,
                    textDecorationLine: "underline",
                    textDecorationColor: "var(--color-accent)",
                    textUnderlineOffset: "4px",
                  }}
                >
                  View all →
                </Link>
              </ScrollReveal>
            </div>

            <ul
              role="list"
              aria-label="Recent blog posts"
              className="blog-grid"
            >
              {recentPosts.map((post, i) => (
                <li key={post.url}>
                  <ScrollReveal delay={i * 80}>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card"
                      aria-label={`Read "${post.title}" on Medium`}
                      style={{
                        display: "block",
                        border: "1px solid var(--color-ink-faint)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        backgroundColor: "var(--color-paper-raised)",
                        textDecoration: "none",
                        color: "inherit",
                        height: "100%",
                      }}
                    >
                      {post.heroImage && (
                        <div
                          style={{
                            position: "relative",
                            aspectRatio: "16/9",
                            backgroundColor: "var(--color-accent-dim)",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={post.heroImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <div style={{ padding: "var(--space-4)" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-2)",
                            marginBottom: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "var(--text-xs)",
                              color: "var(--color-accent)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Medium
                          </span>
                          {post.publishedFormatted && (
                            <>
                              <span
                                aria-hidden="true"
                                style={{
                                  color: "var(--color-ink-faint)",
                                  fontSize: "var(--text-xs)",
                                }}
                              >
                                ·
                              </span>
                              <time
                                dateTime={post.publishedAt}
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "var(--text-xs)",
                                  color: "var(--color-ink-muted)",
                                }}
                              >
                                {post.publishedFormatted}
                              </time>
                            </>
                          )}
                        </div>
                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "var(--text-xl)",
                            color: "var(--color-ink)",
                            fontWeight: 400,
                            lineHeight: 1.3,
                          }}
                        >
                          {post.title}
                        </h3>
                      </div>
                    </a>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <section
        aria-labelledby="contact-heading"
        style={{ paddingBlock: "var(--section-py)" }}
      >
        <div className="container-content">
          <div>
            <ScrollReveal>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-ink-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                  marginBottom: "var(--space-2)",
                }}
              >
                Get in touch
              </span>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h2
                id="contact-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-3xl)",
                  color: "var(--color-ink)",
                  fontWeight: 400,
                  marginBottom: "var(--space-3)",
                }}
              >
                Let&apos;s work together
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.8,
                  marginBottom: "var(--space-5)",
                }}
              >
                I&apos;m always open to new opportunities and challenges. Feel
                free to reach out if you&apos;d like to collaborate or just
                chat!
              </p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <ul
                role="list"
                aria-label="Contact links"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                  listStyle: "none",
                }}
              >
                {contactIcons?.map((icon) => (
                  <li key={icon.key + icon.link}>
                    <a
                      href={icon.link}
                      target={
                        icon.link.startsWith("mailto:") ? undefined : "_blank"
                      }
                      rel={
                        icon.link.startsWith("mailto:")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      aria-label={icon.key}
                      className="hover-accent-border"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        border: "1px solid var(--color-ink-faint)",
                        borderRadius: "var(--radius-md)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-ink-muted)",
                        textTransform: "capitalize",
                      }}
                    >
                      {icon.key}
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
