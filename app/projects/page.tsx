import type { Metadata } from "next";
import { getProjectsData } from "@/lib/content";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProjectsFilter } from "@/components/ProjectsFilter";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Design and development projects by Achintha Isuru — UI/UX case studies, mobile apps, Flutter packages, and front-end work.",
};

/**
 * Projects list page — server component.
 *
 * Renders the static page header server-side and passes project data down to
 * the `ProjectsFilter` client component, which owns the filter state and the
 * project grid.
 *
 * Role extraction happens here on the server so no role-derivation logic runs
 * in the client bundle.
 *
 * Applied skill: nextjs-app-router-patterns — server component passes data as
 * props to a client leaf; server I/O and static markup stay out of the client
 * bundle.
 *
 * Applied skill: vercel-react-best-practices — "use client" boundary pushed to
 * the smallest subtree that needs interactivity (ProjectsFilter). The page
 * header remains fully static and server-rendered.
 */
export default function ProjectsPage() {
  const { pageTitle, projects } = getProjectsData();

  const roles = ["Developer", "UI/UX Designer"];

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

      {/* ── Filter chips + project grid (client component) ────────────── */}
      <ProjectsFilter projects={projects} roles={roles} />
    </>
  );
}
