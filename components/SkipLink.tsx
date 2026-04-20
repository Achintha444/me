/**
 * SkipLink — accessibility skip-to-content link.
 * Visually hidden until focused via the CSS :focus rule in globals.css.
 * Directs keyboard users past the navigation to #main-content.
 *
 * Server Component — focus visibility handled entirely in globals.css.
 */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to content
    </a>
  );
}
