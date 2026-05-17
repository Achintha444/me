import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";

/** Shape of an image entry in content sections. */
interface ContentImage {
  image: string;
  alt?: string;
  key?: string;
}

/** Shape of a link entry in content sections. */
interface ContentLink {
  title: string;
  link: string;
}

/** Shape of a presentation (YouTube/embed) entry. */
interface ContentPresentation {
  link: string;
}

/** A body paragraph entry with optional nested items. */
interface BodyItem {
  body?: string | BodyItem[];
  title?: string;
  images?: ContentImage[];
  links?: ContentLink[];
  presentations?: ContentPresentation[];
  key?: string;
}

/** Props for the ContentSection component. */
interface ContentSectionProps {
  /** Raw content item from JSON — shape varies between About, Experience, Projects. */
  item: unknown;
  /** Index used for staggered animation delays. */
  index?: number;
}

/**
 * ContentSection — a generic renderer for the freeform content sections
 * used across About, Experience, and Projects pages.
 *
 * Handles the nested structures present in the JSON data files:
 * - Title arrays (e.g., [company, role, duration])
 * - String or array bodies
 * - Inline images with next/image
 * - Links
 * - YouTube/iframe embeds
 *
 * Server Component — no event handlers, hover via CSS classes.
 */
export function ContentSection({ item, index = 0 }: ContentSectionProps) {
  const section = item as {
    title?: string | string[];
    body?: string | BodyItem[];
    images?: ContentImage[];
    links?: ContentLink[];
    presentations?: ContentPresentation[];
    content?: unknown[];
    key?: string;
  };

  const delay = index * 80;
  const hasNestedContent =
    Array.isArray(section.content) && section.content.length > 0;

  return (
    <div
      style={{
        marginBottom: "var(--space-8)",
        paddingBottom: hasNestedContent ? 0 : "var(--space-8)",
        borderBottom: hasNestedContent
          ? "none"
          : "1px solid var(--color-ink-faint)",
      }}
    >
      {/* Title — handles both string titles and [org, role, duration] tuples */}
      {section.title && (
        <ScrollReveal delay={delay}>
          {Array.isArray(section.title) ? (
            <div style={{ marginBottom: "var(--space-4)" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl)",
                  color: "var(--color-ink)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: "0.25rem",
                }}
              >
                {section.title[0]}
              </h3>
              {section.title[1] && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-accent)",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                  }}
                >
                  {section.title[1]}
                </p>
              )}
              {section.title[2] && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-ink-muted)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {section.title[2]}
                </p>
              )}
            </div>
          ) : (
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-2xl)",
                color: "var(--color-ink)",
                fontWeight: 400,
                marginBottom: "var(--space-3)",
              }}
            >
              {section.title}
            </h3>
          )}
        </ScrollReveal>
      )}

      {/* Nested content sections */}
      {section.content && Array.isArray(section.content) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {section.content.map((sub, i) => (
            <ContentSection key={i} item={sub} index={index + i + 1} />
          ))}
        </div>
      )}

      {/* Body text */}
      {section.body && (
        <ScrollReveal delay={delay + 80}>
          <BodyRenderer body={section.body} />
        </ScrollReveal>
      )}

      {/* Images grid */}
      {section.images && section.images.length > 0 && (
        <ScrollReveal delay={delay + 160}>
          <ImageGrid images={section.images} />
        </ScrollReveal>
      )}

      {/* Links */}
      {section.links && section.links.length > 0 && (
        <ScrollReveal delay={delay + 200}>
          <ul
            role="list"
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "var(--space-3)",
            }}
          >
            {section.links.map((link) => (
              <li key={link.link}>
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-accent"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-accent)",
                    textDecoration: "underline",
                    textDecorationColor: "var(--color-accent)",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {link.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      )}

      {/* Presentations */}
      {section.presentations && section.presentations.length > 0 && (
        <ScrollReveal delay={delay + 240}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              marginTop: "var(--space-4)",
            }}
          >
            {section.presentations.map((pres) => (
              <div
                key={pres.link}
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "56.25%",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--color-ink-faint)",
                }}
              >
                <iframe
                  src={pres.link}
                  title="Presentation embed"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}

/** Renders a body value that is either a plain string or an array of body items. */
function BodyRenderer({ body }: { body: string | BodyItem[] }) {
  if (typeof body === "string") {
    return (
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
          color: "var(--color-ink-muted)",
          lineHeight: 1.8,
          marginBottom: "var(--space-3)",
        }}
      >
        {body}
      </p>
    );
  }

  const isSimpleList = body.every(
    (item) => !item.title && !item.images && !item.links && !item.presentations && typeof item.body === "string"
  );

  if (isSimpleList) {
    return (
      <ul
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
          color: "var(--color-ink-muted)",
          lineHeight: 1.8,
          paddingLeft: "1.25rem",
          listStyle: "disc",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        {body.map((item, i) => (
          <li key={i}>{item.body as string}</li>
        ))}
      </ul>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {body.map((item, i) => {
        if (item.title) {
          return (
            <div key={i} style={{ marginBottom: "var(--space-2)" }}>
              <h4
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  color: "var(--color-ink)",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                {item.title}
              </h4>
              {item.body && (
                <BodyRenderer body={item.body as string | BodyItem[]} />
              )}
              {item.images && item.images.length > 0 && (
                <ImageGrid images={item.images} />
              )}
              {item.links && item.links.length > 0 && (
                <ul
                  role="list"
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginTop: "var(--space-2)",
                  }}
                >
                  {item.links.map((link) => (
                    <li key={link.link}>
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-accent"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-sm)",
                          color: "var(--color-accent)",
                          textDecoration: "underline",
                          textDecorationColor: "var(--color-accent)",
                          textUnderlineOffset: "3px",
                        }}
                      >
                        {link.title} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {item.presentations && item.presentations.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                    marginTop: "var(--space-3)",
                  }}
                >
                  {item.presentations.map((pres) => (
                    <div
                      key={pres.link}
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingBottom: "56.25%",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        border: "1px solid var(--color-ink-faint)",
                      }}
                    >
                      <iframe
                        src={pres.link}
                        title="Presentation embed"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        if (typeof item.body === "string") {
          return (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                color: "var(--color-ink-muted)",
                lineHeight: 1.8,
              }}
            >
              {item.body}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

/** Renders a responsive grid of images using next/image. */
function ImageGrid({ images }: { images: ContentImage[] }) {
  if (images.length === 0) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(images.length, 3)}, 1fr)`,
        gap: "var(--space-2)",
        marginTop: "var(--space-3)",
      }}
    >
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            aspectRatio: "6/3",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            backgroundColor: "var(--color-accent-dim)",
            border: "1px solid var(--color-ink-faint)",
          }}
        >
          <Image
            src={img.image}
            alt={img.alt ?? img.key ?? "Content image"}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      ))}
    </div>
  );
}
