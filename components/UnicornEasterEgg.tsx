"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * The Konami code sequence as an ordered tuple of KeyboardEvent.key values.
 * Named constant — no magic strings in call sites.
 */
const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

/** How long (ms) the reveal stays visible before auto-dismissing. */
const REVEAL_DURATION_MS = 4000;

/**
 * UnicornEasterEgg — listens globally for the Konami code sequence
 * (↑↑↓↓←→←→BA) and reveals a brief, auto-dismissing "unicorn" message.
 *
 * Design decisions:
 * - Pure keyboard trigger: no on-screen affordance, preserving the clean layout.
 * - `aria-live="polite"` announces the reveal to screen readers without interrupting.
 * - Respects `prefers-reduced-motion`: skips the fade animation, just shows/hides.
 * - Dismiss via Escape, clicking the overlay, or automatically after REVEAL_DURATION_MS.
 * - Applied skill: vercel-react-best-practices — `useRef` for mutable sequence
 *   progress (no re-render on each keystroke), state only for the visible flag.
 *
 * @example
 * // Mount once as a leaf inside the About Server Component:
 * <UnicornEasterEgg />
 */
export function UnicornEasterEgg() {
  const [visible, setVisible] = useState(false);
  const progressRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reveal = useCallback(() => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(dismiss, REVEAL_DURATION_MS);
  }, [dismiss]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Dismiss on Escape if revealed
      if (e.key === "Escape" && visible) {
        dismiss();
        return;
      }

      const expected = KONAMI_SEQUENCE[progressRef.current];

      if (e.key === expected) {
        progressRef.current += 1;
        if (progressRef.current === KONAMI_SEQUENCE.length) {
          progressRef.current = 0;
          reveal();
        }
      } else {
        // Reset — but check if the failed key starts a new sequence
        progressRef.current = e.key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, reveal, dismiss]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      {/* aria-live region — always in DOM so screen readers register it early */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}
      >
        {visible ? "Unicorn unlocked. Designer plus engineer — rare breed." : ""}
      </div>

      {/* Visual reveal — fixed overlay, centered */}
      {visible && (
        <div
          role="dialog"
          aria-label="Unicorn easter egg"
          aria-modal="false"
          onClick={dismiss}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
            // Subtle dark scrim — doesn't block the page read, just frames the card
            background: "rgba(15, 14, 13, 0.45)",
            animation: "unicorn-overlay-in var(--duration-slow, 400ms) var(--ease-out-quart, ease) forwards",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--color-paper-raised)",
              border: "1px solid var(--color-ink-faint)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-6) var(--space-8)",
              textAlign: "center",
              maxWidth: 380,
              width: "calc(100% - var(--space-8))",
              animation: "unicorn-card-in var(--duration-slow, 400ms) var(--ease-out-quart, ease) forwards",
              boxShadow: "0 32px 64px -16px rgba(15,14,13,0.18)",
            }}
          >
            {/* Glyph — single, restrained */}
            <p
              aria-hidden="true"
              style={{
                fontSize: "2.4rem",
                lineHeight: 1,
                marginBottom: "var(--space-3)",
              }}
            >
              🦄
            </p>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                color: "var(--color-ink)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                marginBottom: "var(--space-1)",
              }}
            >
              you found the unicorn
            </p>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-accent)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "var(--space-4)",
              }}
            >
              designer + engineer — rare breed
            </p>

            <button
              onClick={dismiss}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-ink-muted)",
                background: "transparent",
                border: "1px solid var(--color-ink-faint)",
                borderRadius: "var(--radius-md)",
                padding: "0.4rem 1rem",
                cursor: "pointer",
                letterSpacing: "0.06em",
              }}
            >
              dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
