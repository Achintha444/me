import type { CVData } from "./content";
import type { FeatureIdea, Project, ProjectContentSectionBody } from "./types";
import {
  PROFILE_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  absoluteUrl,
} from "./site";

/** Stable JSON-LD node identifiers so pages can reference shared entities. */
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** A loosely typed JSON-LD node. */
export type JsonLdNode = Record<string, unknown>;

/** Maximum length of an auto-generated description, matching typical SERP snippets. */
const SUMMARY_MAX_LENGTH = 160;

/**
 * Splits a comma-separated CV skills string into trimmed entries, dropping
 * parenthetical qualifiers such as "(actively learning)".
 *
 * @param value - Comma-separated list from `cv.json`.
 * @returns The individual entries.
 */
function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.replace(/\(.*?\)/g, "").trim())
    .filter(Boolean);
}

/**
 * Normalises a URL for de-duplication (lower-case host, no trailing slash,
 * `http` upgraded to `https`).
 *
 * @param url - Any absolute URL.
 * @returns The normalised form.
 */
function normaliseUrl(url: string): string {
  return url.replace(/^http:\/\//, "https://").replace(/\/+$/, "").toLowerCase();
}

/**
 * Builds the schema.org `Person` node describing the site owner.
 *
 * This is the single most important GEO signal on the site: `sameAs` ties the
 * portfolio to the owner's LinkedIn, GitHub, Medium, Stack Overflow, YouTube
 * and X profiles so search and AI engines resolve them to one entity, while
 * `knowsAbout`, `worksFor` and `alumniOf` give them citable facts.
 *
 * @param cv - Parsed `content/cv.json`.
 * @returns A JSON-LD `Person` node with a stable `@id`.
 */
export function buildPersonJsonLd(cv: CVData): JsonLdNode {
  const siteOrigin = normaliseUrl(SITE_URL);
  const profileUrls = [
    ...cv.links.map((link) => link.url),
    `https://x.com/${TWITTER_HANDLE.replace("@", "")}`,
  ];
  const sameAs = [
    ...new Map(
      profileUrls
        .filter((url) => !normaliseUrl(url).startsWith(siteOrigin))
        .map((url) => [normaliseUrl(url), url])
    ).values(),
  ];

  const currentRole = cv.employment.find((job) => /present/i.test(job.duration));
  const knowsAbout = [
    "UI/UX Design",
    "Front-end Development",
    "Mobile Application Development",
    "Identity and Access Management",
    ...splitList(cv.skills.technologies),
    ...splitList(cv.skills.languages),
    ...splitList(cv.skills.designTools),
  ];

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: cv.name,
    url: SITE_URL,
    image: absoluteUrl(PROFILE_IMAGE_PATH),
    jobTitle: currentRole?.role ?? "Front-end Developer and UI/UX Designer",
    description: cv.summary,
    ...(currentRole && {
      worksFor: { "@type": "Organization", name: currentRole.company },
    }),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: cv.education.university,
    },
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Montréal",
        addressRegion: "QC",
        addressCountry: "CA",
      },
    },
    knowsAbout: [...new Set(knowsAbout)],
    knowsLanguage: splitList(cv.skills.spokenLanguages),
    sameAs,
  };
}

/**
 * Builds the schema.org `WebSite` node, published by the site owner.
 *
 * @returns A JSON-LD `WebSite` node with a stable `@id`.
 */
export function buildWebsiteJsonLd(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

/**
 * Wraps one or more nodes in a JSON-LD document with a shared `@context`.
 *
 * @param nodes - Nodes to place in the `@graph`.
 * @returns A complete JSON-LD document.
 */
export function buildJsonLdGraph(nodes: JsonLdNode[]): JsonLdNode {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * Serialises a JSON-LD document for an inline `<script>` tag, escaping `<`
 * so content can never close the script element (per the Next.js JSON-LD
 * guide).
 *
 * @param data - The JSON-LD document.
 * @returns A string safe to use as the script's inner HTML.
 */
export function serializeJsonLd(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Returns the first plain-text paragraph found in a content section body,
 * searching nested bodies depth-first.
 *
 * @param body - A project or feature idea section body.
 * @returns The first non-empty string, or `undefined`.
 */
function firstText(body: ProjectContentSectionBody | undefined): string | undefined {
  if (!body) return undefined;
  if (typeof body === "string") return body.trim() || undefined;

  for (const item of body) {
    const found = firstText(item.body as ProjectContentSectionBody | undefined);
    if (found) return found;
  }
  return undefined;
}

/**
 * Derives a short plain-text summary for a project or feature idea from its
 * first body paragraph, truncated on a word boundary.
 *
 * @param entry - A project or feature idea.
 * @returns A summary of at most {@link SUMMARY_MAX_LENGTH} characters, or
 *   `undefined` if the entry has no text content.
 */
export function getEntrySummary(entry: Project | FeatureIdea): string | undefined {
  for (const section of entry.content) {
    const text = firstText(section.body)?.replace(/\s+/g, " ");
    if (!text) continue;
    if (text.length <= SUMMARY_MAX_LENGTH) return text;
    const cut = text.slice(0, SUMMARY_MAX_LENGTH - 1);
    return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
  }
  return undefined;
}

/**
 * Builds a schema.org `CreativeWork` node for a project case study, authored
 * by the site owner.
 *
 * @param project - The project entry.
 * @param description - The page description already computed for metadata.
 * @returns A JSON-LD `CreativeWork` node.
 */
export function buildProjectJsonLd(project: Project, description: string): JsonLdNode {
  const url = absoluteUrl(`/projects/${project.key}`);
  const overview = (key: string) =>
    project.overview?.find((item) => item.key === key)?.body;
  const sector = overview("sector");

  return {
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    url,
    name: project.name,
    headline: project.name,
    description,
    image: absoluteUrl(project.image),
    author: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    ...(sector && { keywords: sector.split(/[·:]/).map((s) => s.trim()).filter(Boolean) }),
    ...(project.role && { creditText: `${project.role}: ${SITE_NAME}` }),
  };
}
