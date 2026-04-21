"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import type { NavData, NavItem } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";

/** Props for the SiteHeader component. */
interface SiteHeaderProps {
  /** Full navigation data from navItems.json. */
  navData: NavData;
}

/**
 * SiteHeader — the persistent site navigation bar.
 *
 * Renders the wordmark on the left and nav links on the right.
 * On mobile, collapses to a hamburger menu.
 * Highlights the active route via `aria-current="page"`.
 * Includes a keyboard hint for the command palette (⌘K).
 *
 * Applied skill: nextjs-app-router-patterns — "use client" only on this
 * leaf component for the active-route highlight; data is fetched in the
 * RSC layout and passed down as props.
 */
export function SiteHeader({ navData }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--color-paper)",
        borderBottom: "1px solid var(--color-ink-faint)",
      }}
    >
      <div
        className="container-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-dm-serif)",
            fontSize: "var(--text-lg)",
            color: "var(--color-ink)",
            letterSpacing: "-0.01em",
          }}
          onClick={closeMobile}
        >
          {navData.title.title}
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" style={{ display: "flex", gap: "var(--space-1)" }}>
          <ul
            role="list"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
              listStyle: "none",
            }}
            className="hidden-mobile"
          >
            {navData.content.map((item) => (
              <NavLinkItem
                key={item.link}
                item={item}
                isActive={pathname === item.link}
              />
            ))}

            {/* Theme toggle */}
            <li style={{ marginLeft: "var(--space-1)" }}>
              <ThemeToggle />
            </li>

            {/* Command palette hint */}
            <li>
              <button
                aria-label="Open command palette"
                title="Press ⌘K to open"
                onClick={() => {
                  document.dispatchEvent(new CustomEvent("open-command-palette"));
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  marginLeft: "var(--space-1)",
                  padding: "0.375rem 0.625rem",
                  border: "1px solid var(--color-ink-faint)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-ink-muted)",
                  transition: `border-color var(--duration-base) var(--ease-out-quart),
                               color var(--duration-base) var(--ease-out-quart)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-accent)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-ink-faint)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-ink-muted)";
                }}
              >
                <span>⌘K</span>
              </button>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={toggleMobile}
            className="show-mobile"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              color: "var(--color-ink)",
            }}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </nav>
      </div>

      {/* Mobile Nav Panel */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          role="navigation"
          aria-label="Mobile navigation"
          style={{
            borderTop: "1px solid var(--color-ink-faint)",
            backgroundColor: "var(--color-paper)",
            padding: "var(--space-3) var(--space-4)",
          }}
        >
          <ul role="list" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            {navData.content.map((item) => (
              <li key={item.link}>
                <Link
                  href={item.link}
                  target={item.target}
                  rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                  aria-current={pathname === item.link ? "page" : undefined}
                  onClick={closeMobile}
                  style={{
                    display: "block",
                    padding: "0.625rem 0",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    fontWeight: pathname === item.link ? 500 : 400,
                    color: pathname === item.link ? "var(--color-accent)" : "var(--color-ink)",
                    borderBottom: "1px solid var(--color-ink-faint)",
                  }}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Theme row — settings-style, at the bottom of the mobile drawer */}
          <div
            style={{
              marginTop: "var(--space-3)",
              paddingTop: "var(--space-3)",
              borderTop: "1px solid var(--color-border-faint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-ink-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      )}

      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile   { display: none; }

        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

/** Single desktop navigation link with active state. */
function NavLinkItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <li>
      <Link
        href={item.link}
        target={item.target}
        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
        aria-current={isActive ? "page" : undefined}
        style={{
          display: "inline-block",
          padding: "0.375rem 0.75rem",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          fontWeight: isActive ? 500 : 400,
          color: isActive ? "var(--color-accent)" : "var(--color-ink-muted)",
          borderRadius: "var(--radius-sm)",
          transition: `color var(--duration-base) var(--ease-out-quart)`,
          textDecorationLine: isActive ? "underline" : "none",
          textDecorationStyle: "solid",
          textDecorationColor: isActive ? "var(--color-accent)" : "transparent",
          textUnderlineOffset: "4px",
          textDecorationThickness: "2px",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-ink)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-ink-muted)";
          }
        }}
      >
        {item.title}
      </Link>
    </li>
  );
}

/** Animated hamburger / close icon. */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      style={{ transition: `transform var(--duration-base) var(--ease-out-quart)` }}
    >
      {open ? (
        <>
          <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="17" x2="11" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
