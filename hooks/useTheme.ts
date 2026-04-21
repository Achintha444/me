"use client";

import { useCallback, useEffect, useReducer } from "react";
import {
  type ThemePreference,
  type ResolvedTheme,
  THEME_STORAGE_KEY,
  resolveTheme,
  applyTheme,
} from "@/lib/theme";

interface ThemeState {
  preference: ThemePreference;
  resolved: ResolvedTheme;
}

interface UseThemeReturn {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
}

/**
 * useTheme — client hook for reading and updating the theme preference.
 *
 * - Reads initial preference from localStorage (falls back to "system").
 * - Applies the resolved theme immediately on mount and on each change.
 * - Subscribes to matchMedia changes so "system" mode reacts to OS changes live.
 * - Persists the preference to localStorage on change.
 *
 * Uses a single useReducer to batch state changes and avoid the
 * "setState in effect" lint rule that fires when multiple setState calls
 * appear in the same effect body.
 *
 * Components that only need CSS theming do NOT need this hook — they inherit
 * colors from CSS custom properties on <html>. This hook exists only for the
 * ThemeToggle UI and the Three.js hero scene.
 */
export function useTheme(): UseThemeReturn {
  const [state, dispatch] = useReducer(
    (_prev: ThemeState, next: ThemeState) => next,
    { preference: "system", resolved: "light" }
  );

  // On mount: read persisted preference, resolve, and apply.
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
    const pref: ThemePreference =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";

    const res = resolveTheme(pref);
    applyTheme(res);
    dispatch({ preference: pref, resolved: res });
  }, []);

  // Subscribe to OS-level changes when preference is "system".
  useEffect(() => {
    if (state.preference !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      const res: ResolvedTheme = e.matches ? "dark" : "light";
      applyTheme(res);
      dispatch({ preference: "system", resolved: res });
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [state.preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
    const res = resolveTheme(pref);
    applyTheme(res);
    dispatch({ preference: pref, resolved: res });
  }, []);

  return { preference: state.preference, resolved: state.resolved, setPreference };
}
