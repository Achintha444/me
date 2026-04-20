import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFeatureIdeasData } from "@/lib/content";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Feature Ideas",
  description:
    "UI/UX feature concept analyses by Achintha Isuru — user research, wireframes, and design proposals for real-world products.",
};

/**
 * Feature Ideas list page — server component.
 * Displays all feature idea entries as a list of wide cards.
 * Hover effects via CSS `.project-card` utility class.
 */
export default function FeatureIdeasPage() {
  const { pageTitle, features } = getFeatureIdeasData();

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
              Design Thinking
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
              Unsolicited product analyses — applying UX research, cognitive
              psychology, and design principles to propose improvements for
              real-world products.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Feature Ideas List ─────────────────────────────────────────── */}
      <section
        aria-label="Feature ideas list"
        style={{ paddingBlock: "var(--section-py)" }}
      >
        <div className="container-content">
          <ul
            role="list"
            aria-label="All feature ideas"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
              listStyle: "none",
            }}
          >
            {features.map((feature, i) => (
              <li key={feature.key}>
                <ScrollReveal delay={i * 80}>
                  <Link
                    href={`/feature-ideas/${feature.key}`}
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
                    {/* Feature image */}
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "21/7",
                        backgroundColor: "var(--color-accent-dim)",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={`/${feature.image}`}
                        alt={feature.name}
                        fill
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    {/* Feature info */}
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
                      <div>
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
                          Feature Concept
                        </span>
                        <h2
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "var(--text-2xl)",
                            color: "var(--color-ink)",
                            fontWeight: 400,
                            lineHeight: 1.3,
                          }}
                        >
                          {feature.name}
                        </h2>
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
                        Read analysis →
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
