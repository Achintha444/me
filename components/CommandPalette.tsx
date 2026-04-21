"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { NavItem } from "@/lib/types";

/** Props for the CommandPalette component. */
interface CommandPaletteProps {
  /** Navigation items to display in the palette. */
  navItems: NavItem[];
}

/** All navigable commands including nav links. */
interface PaletteCommand {
  id: string;
  label: string;
  href: string;
  group: string;
  external?: boolean;
}

/**
 * CommandPalette — a ⌘K keyboard-driven navigation modal.
 *
 * Opens on ⌘K (Mac) or Ctrl+K (Win/Linux), or via a custom DOM event
 * dispatched from the header button. Supports fuzzy search across all
 * navigable commands. Keyboard navigable: Arrow keys, Enter, Escape.
 *
 * Applied skill: vercel-react-best-practices — uses functional setState,
 * useCallback for stable handlers, and useRef for transient values.
 */
export function CommandPalette({ navItems }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /** All commands derived from nav items — stable reference built once. */
  const commands: PaletteCommand[] = navItems.map((item) => ({
    id: item.link,
    label: item.title,
    href: item.link,
    group: "Navigation",
    external: item.target === "_blank",
  }));

  /** Filtered commands based on the current query string. */
  const filteredCommands =
    query.trim() === ""
      ? commands
      : commands.filter((cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase())
        );

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const executeCommand = useCallback(
    (cmd: PaletteCommand) => {
      closePalette();
      if (cmd.external) {
        window.open(cmd.href, "_blank", "noopener noreferrer");
      } else {
        router.push(cmd.href);
      }
    },
    [closePalette, router]
  );

  /** Listen for ⌘K / Ctrl+K keyboard shortcut. */
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          openPalette();
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, openPalette, closePalette]);

  /** Listen for the custom event dispatched by the header button. */
  useEffect(() => {
    const handleCustomEvent = () => openPalette();
    document.addEventListener("open-command-palette", handleCustomEvent);
    return () =>
      document.removeEventListener("open-command-palette", handleCustomEvent);
  }, [openPalette]);

  /** Auto-focus input when palette opens. */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  /** Handle keyboard navigation within the palette. */
  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        closePalette();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filteredCommands[activeIndex];
        if (cmd) executeCommand(cmd);
      }
    },
    [closePalette, filteredCommands, activeIndex, executeCommand]
  );

  /** Scroll active item into view. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector(`[data-active="true"]`) as HTMLElement;
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  return (
    <>
      {/*
       * Single fixed overlay: acts as both the dimmed backdrop and the
       * flex centering container. Clicking the overlay (but not the dialog
       * itself) closes the palette. The dialog is horizontally AND vertically
       * centered via flexbox — no top/transform hacks needed.
       */}
      <div
        aria-hidden="true"
        onClick={closePalette}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, transparent)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          animation: `palette-overlay-in var(--duration-base) var(--ease-out-quart) forwards`,
        }}
      >
        {/* Palette modal — stopPropagation prevents backdrop click from firing */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onKeyDown={handleKeyNavigation}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            zIndex: 101,
            width: "min(600px, 100%)",
            backgroundColor: "var(--color-paper-raised)",
            border: "1px solid var(--color-ink-faint)",
            borderRadius: "var(--radius-lg)",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.10)",
            overflow: "hidden",
            animation: `palette-in var(--duration-slow) var(--ease-out-quart) forwards`,
          }}
        >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--color-ink-faint)",
          }}
        >
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            aria-label="Search commands"
            aria-autocomplete="list"
            aria-controls="palette-results"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              color: "var(--color-ink)",
            }}
          />
          <kbd
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-ink-muted)",
              backgroundColor: "var(--color-paper)",
              border: "1px solid var(--color-ink-faint)",
              borderRadius: "var(--radius-sm)",
              padding: "0.125rem 0.375rem",
            }}
          >
            esc
          </kbd>
        </div>

        {/* Results list */}
        <ul
          id="palette-results"
          ref={listRef}
          role="listbox"
          aria-label="Navigation commands"
          style={{
            listStyle: "none",
            padding: "0.5rem",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {filteredCommands.length === 0 ? (
            <li
              style={{
                padding: "2rem",
                textAlign: "center",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-ink-muted)",
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </li>
          ) : (
            filteredCommands.map((cmd, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={cmd.id}
                  role="option"
                  aria-selected={isActive}
                  data-active={isActive}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setActiveIndex(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    backgroundColor: isActive
                      ? "var(--color-accent-dim)"
                      : "transparent",
                    transition: `background-color var(--duration-fast)`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: isActive
                        ? "var(--color-accent)"
                        : "var(--color-ink)",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {cmd.label}
                  </span>
                  {cmd.external && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      ↗
                    </span>
                  )}
                  {isActive && !cmd.external && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-accent)",
                      }}
                    >
                      ↵
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>

        {/* Footer hint */}
        <div
          style={{
            padding: "0.625rem 1.25rem",
            borderTop: "1px solid var(--color-ink-faint)",
            display: "flex",
            gap: "1rem",
          }}
        >
          {[
            { key: "↑↓", label: "navigate" },
            { key: "↵", label: "open" },
            { key: "esc", label: "close" },
          ].map(({ key, label }) => (
            <span
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-ink-muted)",
              }}
            >
              <kbd
                style={{
                  backgroundColor: "var(--color-paper)",
                  border: "1px solid var(--color-ink-faint)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.125rem 0.25rem",
                }}
              >
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
        {/* /footer hint — end palette modal div */}
        </div>
      </div>
      {/* /overlay */}
    </>
  );
}

/** Search magnifier icon for the palette input. */
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ color: "var(--color-ink-muted)", flexShrink: 0 }}
    >
      <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
      <line
        x1="9.5"
        y1="9.5"
        x2="13.5"
        y2="13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
