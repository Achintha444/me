"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ThemePreference,
  type ResolvedTheme,
  THEME_STORAGE_KEY,
  resolveTheme,
  applyTheme,
  applyThemeWithTransition,
} from "@/lib/theme";

interface UseThemeReturn {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (pref: ThemePreference, origin?: { x: number; y: number }) => void;
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

/**
 * useTheme — client hook for reading and updating the theme preference.
 *
 * Reads initial preference from localStorage on mount, persists on change,
 * subscribes to OS-level preference changes when in "system" mode.
 * Components that only need CSS theming do NOT need this hook — they
 * inherit colors from CSS custom properties on <html>.
 */
export function useTheme(): UseThemeReturn {
  // Lazy initializers run only on the client after hydration.
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference);
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveTheme(readStoredPreference())
  );

  // Sync the DOM once on mount (covers the case where ThemeScript set a
  // different value than the SSR default before React hydrated).
  const mountSynced = useRef(false);
  useEffect(() => {
    if (mountSynced.current) return;
    mountSynced.current = true;
    applyTheme(resolved);
  }, [resolved]);

  useEffect(() => {
    if (preference !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const res: ResolvedTheme = e.matches ? "dark" : "light";
      applyTheme(res);
      setResolved(res);
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  const setPreference = useCallback(
    (pref: ThemePreference, origin?: { x: number; y: number }) => {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, pref);
      } catch {
        // localStorage unavailable (private mode, quota) — still apply theme in-memory
      }
      const res = resolveTheme(pref);
      if (origin) {
        applyThemeWithTransition(res, origin);
      } else {
        applyTheme(res);
      }
      setPreferenceState(pref);
      setResolved(res);
    },
    []
  );

  return { preference, resolved, setPreference };
}
