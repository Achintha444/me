"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  type ThemePreference,
  type ResolvedTheme,
  THEME_STORAGE_KEY,
  resolveTheme,
  applyTheme,
  applyThemeWithTransition,
  getThemeState,
  getServerThemeState,
  setThemeState,
  subscribeTheme,
} from "@/lib/theme";

interface UseThemeReturn {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (pref: ThemePreference, origin?: { x: number; y: number }) => void;
}

let hydrated = false;

/**
 * Hydrates the module-level theme store from localStorage exactly once.
 * Runs on first client mount; no-op on subsequent calls or on the server.
 */
function hydrateThemeStore() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
  const pref: ThemePreference =
    stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system";
  const res = resolveTheme(pref);
  applyTheme(res);
  setThemeState({ preference: pref, resolved: res });
}

/**
 * useTheme — reads and updates the shared theme state.
 *
 * Backed by a module-level observable (see lib/theme.ts), so every consumer
 * sees the same state and re-renders when any caller changes the preference.
 * Components that only need CSS theming don't need this hook.
 */
export function useTheme(): UseThemeReturn {
  const state = useSyncExternalStore(
    subscribeTheme,
    getThemeState,
    getServerThemeState
  );

  const bootstrappedRef = useRef(false);
  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    hydrateThemeStore();
  }, []);

  useEffect(() => {
    if (state.preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const res: ResolvedTheme = e.matches ? "dark" : "light";
      applyTheme(res);
      setThemeState({ preference: "system", resolved: res });
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [state.preference]);

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
      setThemeState({ preference: pref, resolved: res });
    },
    []
  );

  return {
    preference: state.preference,
    resolved: state.resolved,
    setPreference,
  };
}
