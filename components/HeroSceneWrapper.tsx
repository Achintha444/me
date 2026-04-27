"use client";

import dynamic from "next/dynamic";
import { useEffect, useReducer } from "react";
import { useTheme } from "@/hooks/useTheme";
import { themeColors } from "@/lib/theme";

// ─── Dynamic import — never SSR'd ─────────────────────────────────────────
// Per vercel-react-best-practices `bundle-dynamic-imports`: keep the Three.js
// chunk out of the initial bundle. `ssr: false` is mandatory because WebGL
// APIs, `window`, and canvas are unavailable in Node.
const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => null }
);

// ─── Types ─────────────────────────────────────────────────────────────────

type SceneStatus = "pending" | "ready" | "fallback";

interface SceneState {
  status: SceneStatus;
  staticPose: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Returns true when the browser supports WebGL 1 or 2. */
function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Returns true when the user has opted into reduced motion. */
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Probes browser capabilities and returns the resolved scene state.
 * Called once inside useEffect after hydration.
 */
function resolveSceneState(): SceneState {
  if (!detectWebGLSupport()) {
    return { status: "fallback", staticPose: false };
  }
  return { status: "ready", staticPose: prefersReducedMotion() };
}

// ─── CSS-only static fallback ──────────────────────────────────────────────

/**
 * Fallback shown when WebGL is unavailable.
 * Uses semantic color tokens so it respects dark mode.
 */
function HeroSceneFallback() {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      style={{
        width: "100vw",
        height: "100%",
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "260px",
          height: "260px",
          opacity: 1,
        }}
      >
        {/* Left half — wireframe / design representation */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid var(--color-accent)",
            clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
          }}
        />
        {/* Right half — solid / development representation */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backgroundColor: "var(--color-accent)",
            clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Exported wrapper ──────────────────────────────────────────────────────

const INITIAL_STATE: SceneState = { status: "pending", staticPose: false };

/**
 * HeroSceneWrapper — server-component-safe entry point for the Three.js hero.
 *
 * Handles:
 * 1. Dynamic import with `ssr: false` (Three.js requires browser APIs)
 * 2. WebGL availability detection — falls back to a CSS visual if absent
 * 3. `prefers-reduced-motion` detection — passes `staticPose` to the canvas
 * 4. Theme-aware colors via useTheme() — passes current palette to HeroScene
 *    so materials update reactively without MutationObserver.
 *
 * Applied skill: vercel-react-best-practices — client boundary kept at the
 * leaf, not hoisted to the page.
 */
export function HeroSceneWrapper() {
  const [state, dispatch] = useReducer(
    (_prev: SceneState, next: SceneState) => next,
    INITIAL_STATE
  );

  const { resolved } = useTheme();
  const colors = themeColors[resolved];

  useEffect(() => {
    dispatch(resolveSceneState());
  }, []);

  if (state.status === "pending") return null;
  if (state.status === "fallback") return <HeroSceneFallback />;

  /*
   * `key={resolved}` remounts the whole Canvas on theme change. R3F's
   * reconciler can leave WebGL materials in a stale state across theme
   * flips (especially when a CSS view-transition is mid-flight, which
   * desynchronises the WebGL frame from the React tree). Remounting is
   * the only reliable way to guarantee fresh materials, lighting, and
   * IBL environment matching the active theme.
   */
  return (
    <HeroScene
      key={resolved}
      staticPose={state.staticPose}
      colors={colors}
    />
  );
}
