import type { Metadata } from "next";
import { getExperienceData } from "@/lib/content";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Work history of Achintha Isuru — front-end developer and UI/UX designer with experience at WSO2, KAST, Vertify Technologies, and more.",
};

/**
 * Experiences page — server component.
 * Renders work experience as a chronological timeline from content/experience.json.
 *
 * Applied skill: nextjs-app-router-patterns — Server Component, no 'use client',
 * data read synchronously from the filesystem at request time.
 */
export default function ExperiencesPage() {
  const { pageTitle, experiences } = getExperienceData();

  return (
    <>
      {/* ── Page Header ──────────────────────────────────────────────── */}
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
              Career
            </span>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "var(--text-4xl)",
                color: "var(--color-ink)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              {pageTitle}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <p
              style={{
                marginTop: "var(--space-3)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                color: "var(--color-ink-muted)",
                lineHeight: 1.7,
                maxWidth: "var(--text-max)",
              }}
            >
              A chronological record of roles, responsibilities, and growth
              across software engineering, design, and education.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <section
        aria-label="Work experience timeline"
        style={{ paddingBlock: "var(--section-py)" }}
      >
        <div className="container-content">
          <ExperienceTimeline experiences={experiences} />
        </div>
      </section>
    </>
  );
}
