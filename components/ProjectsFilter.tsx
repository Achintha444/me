"use client";

import { useState, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { ScrollReveal } from "@/components/ScrollReveal";

/** Sentinel value representing the "show all" state. */
const ALL = "all" as const;

/** Props for ProjectsFilter. */
interface ProjectsFilterProps {
  /** Full list of projects from the data source. */
  projects: Project[];
  /** All unique role values extracted server-side. */
  roles: string[];
}

/**
 * ProjectsFilter — client component that renders role filter chips and
 * a filtered project grid.
 *
 * Filtering rules:
 * - Default state ("All") shows every project.
 * - When a role chip is selected, only projects whose `role` matches are shown.
 * - The "other" project (key === "other") is always visible regardless of the
 *   active filter because it has no `role` field.
 *
 * Applied skill: vercel-react-best-practices — "use client" scoped to this
 * leaf; the parent page.tsx remains a Server Component. State is minimal
 * (a single string), no derived state stored in state.
 *
 * Applied skill: nextjs-app-router-patterns — client boundary pushed as far
 * down the tree as possible; server data (projects, roles) passed as props.
 */
export function ProjectsFilter({ projects, roles }: ProjectsFilterProps) {
  const [activeRole, setActiveRole] = useState<typeof ALL | string>(ALL);
  const groupId = useId();

  /** Returns true if a project should be visible given the active role filter. */
  function isVisible(project: Project): boolean {
    if (activeRole === ALL) return true;
    if (project.key === "other") return true;
    if (!project.role) return false;
    if (activeRole === "Developer") return project.role.includes("Developer");
    if (activeRole === "UI/UX Designer") return project.role.includes("Designer");
    return project.role === activeRole;
  }

  const visibleProjects = projects.filter(isVisible);

  return (
    <>
      {/* ── Filter Chips ──────────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="Filter projects by role"
        style={{
          paddingBlock: "var(--space-2) var(--space-2)",
          borderBottom: "1px solid var(--color-ink-faint)",
        }}
      >
        <div className="container-content">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-1)",
            }}
          >
            {/* "All" chip */}
            <FilterChip
              label="All"
              value={ALL}
              active={activeRole === ALL}
              groupId={groupId}
              onSelect={setActiveRole}
            />

            {/* Role chips */}
            {roles.map((role) => (
              <FilterChip
                key={role}
                label={role}
                value={role}
                active={activeRole === role}
                groupId={groupId}
                onSelect={setActiveRole}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Projects Grid ─────────────────────────────────────────────── */}
      <section
        aria-label="Projects grid"
        style={{ paddingBlock: "var(--section-py)" }}
      >
        <div className="container-content">
          <ul
            role="list"
            aria-label={
              activeRole === ALL
                ? "All projects"
                : `Projects filtered by role: ${activeRole}`
            }
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--space-4)",
              listStyle: "none",
            }}
          >
            {visibleProjects.map((project, i) => (
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

// ─── FilterChip ──────────────────────────────────────────────────────────────

/** Props for the FilterChip button. */
interface FilterChipProps {
  /** Display text for the chip. */
  label: string;
  /** The role value this chip represents, or "all". */
  value: typeof ALL | string;
  /** Whether this chip is currently active. */
  active: boolean;
  /** Unique group id for aria grouping context. */
  groupId: string;
  /** Callback invoked with this chip's value on click. */
  onSelect: (value: typeof ALL | string) => void;
}

/**
 * FilterChip — a single pill-shaped toggle button for role filtering.
 *
 * Uses `aria-pressed` to communicate toggle state to assistive technology.
 * Active state uses `--color-accent` as background with `--color-paper-raised`
 * foreground. Inactive state uses `--color-paper-raised` background with a
 * `--color-ink-faint` border, matching card borders throughout the page.
 *
 * Transition respects `prefers-reduced-motion` via the CSS media query on the
 * `.filter-chip` class defined in globals.css.
 */
function FilterChip({ label, value, active, onSelect }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(value)}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "0.375rem 0.875rem",
        borderRadius: "999px",
        border: active
          ? "1px solid var(--color-accent)"
          : "1px solid var(--color-ink-faint)",
        backgroundColor: active
          ? "var(--color-accent)"
          : "var(--color-paper-raised)",
        color: active ? "var(--color-paper-raised)" : "var(--color-ink-muted)",
        cursor: "pointer",
        transition:
          "background-color var(--duration-fast) var(--ease-out-quart), color var(--duration-fast) var(--ease-out-quart), border-color var(--duration-fast) var(--ease-out-quart)",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
