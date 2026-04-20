import Link from "next/link";
import type { NavData } from "@/lib/types";

/** Props for the SiteFooter component. */
interface SiteFooterProps {
  /** Navigation data used to render footer links. */
  navData: NavData;
}

/** Current year constant for copyright display. */
const CURRENT_YEAR = new Date().getFullYear();

/** Contact links shown in the footer. */
const CONTACT_LINKS = [
  { label: "GitHub", href: "https://github.com/Achintha444" },
  { label: "LinkedIn", href: "http://linkedin.com/in/achintha-isuru" },
  { label: "Medium", href: "https://medium.com/@achinthaisuru444" },
  { label: "Email", href: "mailto:achinthaisuru97@gmail.com" },
] as const;

/**
 * SiteFooter — full-width footer with navigation links, contact links,
 * and copyright. Server Component — hover effects via CSS classes.
 */
export function SiteFooter({ navData }: SiteFooterProps) {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-ink-faint)",
        backgroundColor: "var(--color-paper)",
        paddingBlock: "var(--space-8)",
      }}
      aria-label="Site footer"
    >
      <div className="container-content">
        {/* Top row: wordmark + nav links */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "var(--space-6)",
          }}
        >
          {/* Wordmark block */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                color: "var(--color-ink)",
                display: "block",
                marginBottom: "var(--space-1)",
              }}
              className="hover-accent"
            >
              Achintha Isuru
            </Link>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-ink-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Front-end Developer &amp; UI/UX Designer
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul
              role="list"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-1) var(--space-4)",
                listStyle: "none",
              }}
            >
              {navData.content.map((item) => (
                <li key={item.link}>
                  <Link
                    href={item.link}
                    target={item.target}
                    rel={
                      item.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="hover-accent"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="divider" style={{ marginBottom: "var(--space-4)" }} />

        {/* Bottom row: copyright + social links */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-ink-muted)",
            }}
          >
            &copy; {CURRENT_YEAR} Achintha Isuru. All rights reserved.
          </p>

          <ul
            role="list"
            style={{
              display: "flex",
              gap: "var(--space-3)",
              listStyle: "none",
            }}
          >
            {CONTACT_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="hover-accent"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-ink-muted)",
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
