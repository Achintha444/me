/**
 * ThemeScript — injects a blocking inline script into <head> that sets
 * data-theme on <html> before first paint, preventing a flash of
 * unstyled / wrong-theme content (FOUC).
 *
 * This is a Server Component. It emits no client bundle.
 * The script runs synchronously during HTML parsing — before CSS paints
 * and before React hydrates — so the correct theme class is always present.
 *
 * It only sets a data attribute; it does not touch anything React tracks,
 * so there are no hydration mismatches.
 */
export function ThemeScript() {
  const script = `(function(){try{var p=localStorage.getItem('theme-preference')||'system';var r=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;document.documentElement.dataset.theme=r;}catch(e){}})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
