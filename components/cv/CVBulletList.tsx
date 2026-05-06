import type { CVBulletLinks } from "@/lib/content";

/**
 * renderBulletWithLinks — splits a bullet string around each linked term and
 * returns an array of React nodes (plain strings interleaved with `<a>`
 * elements).
 *
 * Processing is left-to-right; each term is replaced at most once per bullet.
 * If a term is not found in the current text segment it is silently skipped.
 *
 * @param text  - The raw bullet string.
 * @param links - Array of `{ text, url }` pairs to embed as hyperlinks.
 * @returns     An array of React nodes ready to render inside a `<li>`.
 */
export function renderBulletWithLinks(
  text: string,
  links: { text: string; url: string }[]
): React.ReactNode[] {
  type Segment =
    | { kind: "text"; value: string }
    | { kind: "link"; linkText: string; url: string };

  const segments: Segment[] = [{ kind: "text", value: text }];

  for (const { text: term, url } of links) {
    const next: Segment[] = [];
    for (const seg of segments) {
      if (seg.kind !== "text") {
        next.push(seg);
        continue;
      }
      const idx = seg.value.indexOf(term);
      if (idx === -1) {
        next.push(seg);
        continue;
      }
      if (idx > 0) next.push({ kind: "text", value: seg.value.slice(0, idx) });
      next.push({ kind: "link", linkText: term, url });
      const after = seg.value.slice(idx + term.length);
      if (after) next.push({ kind: "text", value: after });
    }
    segments.length = 0;
    segments.push(...next);
  }

  return segments.map((seg, i) =>
    seg.kind === "link" ? (
      <a
        key={i}
        href={seg.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "inherit", textDecoration: "underline" }}
      >
        {seg.linkText}
      </a>
    ) : (
      seg.value
    )
  );
}

/** Props for CVBulletList. */
interface CVBulletListProps {
  /** Array of bullet strings to render. */
  bullets: string[];
  /**
   * Optional map of bullet index (string key) to inline link definitions.
   * Matches the `CVBulletLinks` type from `lib/content.ts`.
   */
  bulletLinks?: CVBulletLinks;
}

/**
 * CVBulletList — renders a styled `<ul>` of bullet strings, with optional
 * inline hyperlinks interpolated via `renderBulletWithLinks`.
 */
export function CVBulletList({ bullets, bulletLinks }: CVBulletListProps) {
  return (
    <ul
      style={{
        listStyle: "disc",
        paddingLeft: "1.1em",
        margin: "0.18em 0 0",
        display: "flex",
        flexDirection: "column",
        gap: "0.14em",
      }}
    >
      {bullets.map((bullet, i) => {
        const links = bulletLinks?.[String(i)] ?? [];
        return (
          <li key={i} style={{ lineHeight: 1.38, fontSize: "inherit" }}>
            {links.length > 0 ? renderBulletWithLinks(bullet, links) : bullet}
          </li>
        );
      })}
    </ul>
  );
}
