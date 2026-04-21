import type { Metadata } from "next";
import { getMeData } from "@/lib/content";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContentSection } from "@/components/ContentSection";
import { UnicornEasterEgg } from "@/components/UnicornEasterEgg";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Achintha Isuru — his background, education, hobbies, and approach to bridging design and development.",
};

/** Shape of a paragraph item in me.json firstPara. */
interface MeParagraph {
  key: string;
  body: string;
}

/** Shape of a contact icon in me.json. */
interface MeContactIcon {
  image: string;
  key: string;
  link: string;
}

/** Shape of a content detail section in me.json. */
interface MeContentDetail {
  title: string;
  content: unknown[];
}

/**
 * About page — server component.
 * Renders personal bio, education, conducted sessions, and hobbies
 * from `content/me.json`. Hover effects via CSS utility classes.
 */
export default function AboutPage() {
  const meData = getMeData() as {
    pageTitle: string;
    content: {
      firstPara: MeParagraph[];
      contentDetails: MeContentDetail[];
      contact: {
        id: number;
        title: string;
        icons: MeContactIcon[];
      };
    };
  };

  const { content } = meData;

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
              About
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
                marginBottom: "var(--space-4)",
              }}
            >
              {meData.pageTitle}
            </h1>
          </ScrollReveal>

          {/* Bio paragraphs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              maxWidth: "var(--text-max)",
            }}
          >
            {content.firstPara.map((para, i) => (
              <ScrollReveal key={para.key} delay={160 + i * 80}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-ink-muted)",
                    lineHeight: 1.8,
                  }}
                >
                  {para.body}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content Sections (Education, Sessions, Hobbies) ────────────── */}
      <div style={{ paddingBlock: "var(--section-py)" }}>
        <div className="container-content">
          {content.contentDetails.map((section, si) => (
            <section
              key={section.title}
              aria-labelledby={`section-${si}`}
              style={{
                marginBottom:
                  si < content.contentDetails.length - 1
                    ? "var(--section-py)"
                    : 0,
              }}
            >
              <ScrollReveal>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-8)",
                  }}
                >
                  <h2
                    id={`section-${si}`}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-3xl)",
                      color: "var(--color-ink)",
                      fontWeight: 400,
                      flexShrink: 0,
                    }}
                  >
                    {section.title}
                  </h2>
                  <hr
                    style={{
                      flex: 1,
                      border: "none",
                      borderTop: "1px solid var(--color-ink-faint)",
                    }}
                  />
                </div>
              </ScrollReveal>

              {section.content.map((item, ii) => (
                <ContentSection key={ii} item={item} index={ii} />
              ))}
            </section>
          ))}
        </div>
      </div>

      {/* ── Unicorn Easter Egg (Konami code trigger) ──────────────────── */}
      <UnicornEasterEgg />

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <section
        aria-labelledby="contact-heading"
        style={{
          borderTop: "1px solid var(--color-ink-faint)",
          paddingBlock: "var(--space-12)",
        }}
      >
        <div className="container-content">
          <ScrollReveal>
            <h2
              id="contact-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-2xl)",
                color: "var(--color-ink)",
                fontWeight: 400,
                marginBottom: "var(--space-4)",
              }}
            >
              {content.contact.title}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <ul
              role="list"
              aria-label="Contact platforms"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-2)",
                listStyle: "none",
              }}
            >
              {content.contact.icons.map((icon) => (
                <li key={icon.link}>
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
                    className="hover-accent-border"
                    style={{
                      display: "inline-block",
                      padding: "0.5rem 1.125rem",
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
      </section>
    </>
  );
}
