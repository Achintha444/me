import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFeatureIdeasData,
  getFeatureIdeaByKey,
} from "@/lib/content";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContentSection } from "@/components/ContentSection";

/** Route params for feature idea detail pages. */
interface FeatureDetailParams {
  params: Promise<{ key: string }>;
}

/**
 * Pre-generate all feature idea detail pages at build time.
 */
export async function generateStaticParams() {
  const { features } = getFeatureIdeasData();
  return features.map((feature) => ({ key: feature.key }));
}

/**
 * Generates dynamic page metadata per feature idea.
 */
export async function generateMetadata({
  params,
}: FeatureDetailParams): Promise<Metadata> {
  const { key } = await params;
  const feature = getFeatureIdeaByKey(key);

  if (!feature) {
    return { title: "Feature Idea not found" };
  }

  return {
    title: feature.name,
    description: `Feature concept analysis: ${feature.name}`,
  };
}

/**
 * Feature Idea detail page — server component.
 * Renders the full analysis content for a single feature idea.
 */
export default async function FeatureIdeaDetailPage({
  params,
}: FeatureDetailParams) {
  const { key } = await params;
  const feature = getFeatureIdeaByKey(key);

  if (!feature) {
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
            href="/feature-ideas"
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
            ← All Feature Ideas
          </Link>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        aria-label="Feature idea header"
        style={{
          paddingBlock: "var(--space-10) var(--space-8)",
          borderBottom: "1px solid var(--color-ink-faint)",
        }}
      >
        <div className="container-content">
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
              Feature Concept
            </span>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1
              style={{
                fontFamily: "var(--font-dm-serif)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "var(--color-ink)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              {feature.name}
            </h1>
          </ScrollReveal>
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
              src={`/${feature.image}`}
              alt={feature.name}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </ScrollReveal>
      </div>

      {/* ── Analysis Content ──────────────────────────────────────────── */}
      <section
        aria-label="Feature analysis content"
        style={{ paddingBlock: "var(--section-py)" }}
      >
        <div className="container-content">
          {feature.content.map((section, i) => (
            <ContentSection key={i} item={section} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
