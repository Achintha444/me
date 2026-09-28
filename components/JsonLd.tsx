import { serializeJsonLd, type JsonLdNode } from "@/lib/structured-data";

/** Props for {@link JsonLd}. */
interface JsonLdProps {
  /** A complete JSON-LD document (with `@context`). */
  data: JsonLdNode;
}

/**
 * Renders schema.org structured data as an inline `application/ld+json`
 * script. A native `<script>` is used rather than `next/script` because
 * JSON-LD is data, not executable code (per the Next.js JSON-LD guide).
 *
 * @param props - The JSON-LD document to embed.
 * @returns A script element containing the escaped JSON-LD.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
