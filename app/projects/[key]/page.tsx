import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectsData, getProjectByKey } from "@/lib/content";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContentSection } from "@/components/ContentSection";

/** Route params for project detail pages. */
interface ProjectDetailParams {
  params: Promise<{ key: string }>;
}

/**
 * Pre-generate all project detail pages at build time.
 * Applied skill: nextjs-app-router-patterns — generateStaticParams
 * with Server Components for static rendering.
 */
export async function generateStaticParams() {
  const { projects } = getProjectsData();
  return projects.map((project) => ({ key: project.key }));
}

/**
 * Generates dynamic page metadata per project.
 * Applied skill: nextjs — generateMetadata with async params.
 */
export async function generateMetadata({
  params,
}: ProjectDetailParams): Promise<Metadata> {
  const { key } = await params;
  const project = getProjectByKey(key);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.name,
    description: `Case study: ${project.name}${project.role ? ` — ${project.role}` : ""}`,
  };
}

/**
 * Project detail page — server component.
 * Renders the full case study content for a single project.
 */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailParams) {
  const { key } = await params;
  const project = getProjectByKey(key);

  if (!project) {
    notFound();
  }

  return (
    <>
      {/* ── Back navigation ────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid var(--color-ink-faint)",
          padding: "var(--space-3) 0",
        }}
      >
        <div className="container-content">
          <Link
            href="/projects"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            ← All Projects
          </Link>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        aria-label="Project header"
        style={{
          paddingBlock: "var(--space-10) var(--space-8)",
          borderBottom: "1px solid var(--color-ink-faint)",
        }}
      >
        <div className="container-content">
          {/* Role chip */}
          {project.role && (
            <ScrollReveal>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: "var(--space-2)",
                }}
              >
                {project.role}
              </span>
            </ScrollReveal>
          )}

          {/* Project title */}
          <ScrollReveal delay={80}>
            <h1
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "var(--color-ink)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                marginBottom: "var(--space-5)",
              }}
            >
              {project.name}
            </h1>
          </ScrollReveal>

          {/* Overview metadata */}
          {project.overview && project.overview.length > 0 && (
            <ScrollReveal delay={160}>
              <dl
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-5)",
                }}
              >
                {project.overview.map((item) => (
                  <div key={item.key}>
                    <dt
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-ink-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.title}
                    </dt>
                    <dd
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-ink)",
                        fontWeight: 500,
                      }}
                    >
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ── Hero Image ────────────────────────────────────────────────── */}
      <div className="container-content" style={{ paddingTop: "var(--space-6)" }}>
        <ScrollReveal>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/7",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              backgroundColor: "var(--color-accent-dim)",
              border: "1px solid var(--color-ink-faint)",
            }}
          >
            <Image
              src={`/${project.image}`}
              alt={project.name}
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        </ScrollReveal>
      </div>

      {/* ── Case Study Content ─────────────────────────────────────────── */}
      <section
        aria-label="Case study content"
        style={{ paddingBlock: "var(--section-py)" }}
      >
        <div className="container-content">
          {project.content.map((section, i) => (
            <ContentSection key={i} item={section} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
