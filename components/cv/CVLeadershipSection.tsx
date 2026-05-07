import type { CVLeadershipItem, CVSectionLink } from "@/lib/content";
import { CV_FONT_SIZES } from "@/lib/cv-config";
import { CVSection } from "./CVSection";

const { sm, xs } = CV_FONT_SIZES;

/** Props for CVLeadershipSection. */
interface CVLeadershipSectionProps {
  /** Array of leadership / award items from CV data. */
  leadership: CVLeadershipItem[];
  sectionLink?: CVSectionLink;
}

/**
 * CVLeadershipSection — renders the "Leadership & Awards" section.
 *
 * Each item is a plain bullet. Items may include an optional trailing link
 * (e.g. a certificate or article URL) rendered as an accent-coloured anchor.
 *
 * Gap between items is `0.13em` per the calibrated print layout.
 */
export function CVLeadershipSection({ leadership, sectionLink }: CVLeadershipSectionProps) {
  return (
    <CVSection
      label="Leadership and Awards"
      heading="Leadership & Awards"
      suffix={
        sectionLink && (
          <a
            href={sectionLink.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-accent)", textDecoration: "underline" }}
          >
            ({sectionLink.text})
          </a>
        )
      }
    >
      <ul
        style={{
          listStyle: "disc",
          paddingLeft: "1.1em",
          display: "flex",
          flexDirection: "column",
          gap: "0.13em",
        }}
      >
        {leadership.map((item, i) => (
          <li key={i} style={{ fontSize: sm, lineHeight: 1.38 }}>
            {item.text}
            {item.link && (
              <>
                {" "}
                <a
                  href={item.link.url}
                  target={item.link.url.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.link.url.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  style={{
                    color: "var(--color-accent)",
                    textDecoration: "underline",
                    fontSize: xs,
                  }}
                >
                  {item.link.text}
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </CVSection>
  );
}
