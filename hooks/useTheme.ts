"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type ThemePreference,
  type ResolvedTheme,
  THEME_STORAGE_KEY,
  resolveTheme,
  applyTheme,
} from "@/lib/theme";

interface UseThemeReturn {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
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
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
    const pref: ThemePreference =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";

    const res = resolveTheme(pref);
    applyTheme(res);
    setPreferenceState(pref);
    setResolved(res);
  }, []);

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

  const setPreference = useCallback((pref: ThemePreference) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch {
      // localStorage unavailable (private mode, quota) — still apply theme in-memory
    }
    const res = resolveTheme(pref);
    applyTheme(res);
    setPreferenceState(pref);
    setResolved(res);
  }, []);

  return { preference, resolved, setPreference };
}
