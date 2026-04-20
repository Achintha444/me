import type { Metadata } from "next";
import Image from "next/image";
import { getMediumPosts } from "@/lib/medium";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing by Achintha Isuru on design, engineering, and the craft of building thoughtful digital products.",
};

/**
 * Blog list page — server component.
 *
 * Fetches posts from the Medium RSS feed via {@link getMediumPosts} which
 * provides hourly ISR. Renders a graceful empty state if the feed is
 * unavailable or returns zero posts.
 *
 * Applied skill: nextjs-app-router-patterns — Server Component with
 * `fetch` + `{ next: { revalidate } }` for ISR; no client bundle added.
 * Applied skill: vercel-react-best-practices — data fetched at the
 * component level; no prop drilling, no client-side waterfall.
 */
export default async function BlogPage() {
  const posts = await getMediumPosts();

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
              Writing
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
              Blog
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                color: "var(--color-ink-muted)",
                lineHeight: 1.8,
                marginTop: "var(--space-3)",
                maxWidth: "var(--text-max)",
              }}
            >
              Thoughts on design systems, front-end engineering, and the
              details that make digital products feel right.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Posts List ────────────────────────────────────────────────── */}
      <section
        aria-label="Blog posts"
        style={{ paddingBlock: "var(--section-py)" }}
      >
        <div className="container-content">
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <ul
              role="list"
              aria-label="All blog posts"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
                listStyle: "none",
              }}
            >
              {posts.map((post, i) => (
                <li key={post.url}>
                  <ScrollReveal delay={i * 80}>
                    <article
                      aria-label={post.title}
                      style={{
                        border: "1px solid var(--color-ink-faint)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        backgroundColor: "var(--color-paper-raised)",
                      }}
                    >
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card"
                        aria-label={`Read "${post.title}" on Medium`}
                        style={{
                          display: "block",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        {/* Hero image */}
                        {post.heroImage && (
                          <div
                            style={{
                              position: "relative",
                              aspectRatio: "21/7",
                              backgroundColor: "var(--color-accent-dim)",
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              src={post.heroImage}
                              alt={post.title}
                              fill
                              sizes="(max-width: 1200px) 100vw, 1200px"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        )}

                        {/* Post info */}
                        <div
                          style={{
                            padding: "var(--space-5)",
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "var(--space-4)",
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Meta row */}
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
                              {post.publishedAt && (
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
                              <span
                                aria-hidden="true"
                                style={{
                                  color: "var(--color-ink-faint)",
                                  fontSize: "var(--text-xs)",
                                }}
                              >
                                ·
                              </span>
                              <span
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "var(--text-xs)",
                                  color: "var(--color-ink-muted)",
                                }}
                              >
                                {post.readingTimeMinutes} min read
                              </span>
                            </div>

                            {/* Title */}
                            <h2
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "var(--text-2xl)",
                                color: "var(--color-ink)",
                                fontWeight: 400,
                                lineHeight: 1.3,
                                marginBottom: "var(--space-2)",
                              }}
                            >
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            {post.excerpt && (
                              <p
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: "var(--text-sm)",
                                  color: "var(--color-ink-muted)",
                                  lineHeight: 1.7,
                                  maxWidth: "72ch",
                                }}
                              >
                                {post.excerpt}
                              </p>
                            )}
                          </div>

                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "var(--text-sm)",
                              color: "var(--color-accent)",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              alignSelf: "center",
                            }}
                          >
                            Read on Medium →
                          </span>
                        </div>
                      </a>
                    </article>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

/** Rendered when the feed returns zero posts or is unreachable. */
function EmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        textAlign: "center",
        paddingBlock: "var(--space-16)",
        color: "var(--color-ink-muted)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          marginBottom: "var(--space-2)",
          color: "var(--color-ink)",
        }}
      >
        No posts yet
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
        }}
      >
        Check back soon — new writing on design and engineering is on the way.
      </p>
    </div>
  );
}
