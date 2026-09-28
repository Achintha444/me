import {
  getCVData,
  getFeatureIdeasData,
  getProjectsData,
} from "@/lib/content";
import { getMediumPosts } from "@/lib/medium";
import { SITE_DESCRIPTION, SITE_HEADLINE, absoluteUrl } from "@/lib/site";
import { getEntrySummary } from "@/lib/structured-data";

/**
 * Regenerate at most hourly so recent Medium posts stay current. Must be a
 * literal to be statically analysable; mirrors `MEDIUM_REVALIDATE_SECONDS`.
 */
export const revalidate = 3600;

/** Number of recent Medium posts listed in llms.txt. */
const RECENT_POSTS_LIMIT = 10;

/** Top-level pages listed in the "Pages" section, in reading order. */
const PAGES = [
  { path: "/aboutMe", title: "About", note: "Background, education, and interests" },
  { path: "/experiences", title: "Experiences", note: "Full work history with details" },
  { path: "/projects", title: "Projects", note: "All design and development case studies" },
  { path: "/cv", title: "CV", note: "Printable curriculum vitae" },
  { path: "/blog", title: "Blog", note: "Articles published on Medium" },
  { path: "/feature-ideas", title: "Feature Ideas", note: "UI/UX feature concept analyses" },
] as const;

/**
 * Formats a Markdown list item linking to a page, with an optional note.
 *
 * @param title - Link text.
 * @param url - Absolute URL.
 * @param note - Optional description appended after a colon.
 * @returns A single Markdown list line.
 */
function linkItem(title: string, url: string, note?: string): string {
  return `- [${title}](${url})${note ? `: ${note}` : ""}`;
}

/**
 * Serves `/llms.txt` — a Markdown summary of the portfolio following the
 * llmstxt.org proposal, so LLM-based assistants and AI search engines can
 * read who Achintha Isuru is and find the key pages without parsing HTML.
 * All content is generated from the same `content/*.json` files as the site.
 *
 * @returns A `text/plain` Markdown response.
 */
export async function GET(): Promise<Response> {
  const cv = getCVData();
  const { projects } = getProjectsData();
  const { features } = getFeatureIdeasData();
  const posts = (await getMediumPosts()).slice(0, RECENT_POSTS_LIMIT);

  const currentRole = cv.employment.find((job) => /present/i.test(job.duration));

  const sections = [
    `# ${cv.name}`,
    `> ${SITE_DESCRIPTION}`,
    [
      cv.summary,
      "",
      `- Role: ${SITE_HEADLINE}${currentRole ? ` — currently ${currentRole.role} at ${currentRole.company}` : ""}`,
      `- Location: ${cv.contact.address}, Canada`,
      `- Education: ${cv.education.degree}, ${cv.education.university} (${cv.education.duration})`,
      `- Technologies: ${cv.skills.technologies}`,
      `- Languages: ${cv.skills.languages}`,
      `- Design tools: ${cv.skills.designTools}`,
      `- Spoken languages: ${cv.skills.spokenLanguages}`,
      `- Contact: ${cv.contact.email}`,
    ].join("\n"),
    [
      "## Experience",
      "",
      ...cv.employment.map(
        (job) => `- ${job.role}, ${job.company} (${job.duration})`
      ),
    ].join("\n"),
    [
      "## Pages",
      "",
      linkItem("Home", absoluteUrl("/")),
      ...PAGES.map((page) => linkItem(page.title, absoluteUrl(page.path), page.note)),
    ].join("\n"),
    [
      "## Projects",
      "",
      ...projects.map((project) =>
        linkItem(
          project.role ? `${project.name} (${project.role})` : project.name,
          absoluteUrl(`/projects/${project.key}`),
          getEntrySummary(project)
        )
      ),
    ].join("\n"),
    [
      "## Profiles",
      "",
      ...cv.links
        .filter((link) => !link.url.startsWith(absoluteUrl("/")))
        .map((link) => linkItem(link.label, link.url)),
    ].join("\n"),
  ];

  if (posts.length > 0) {
    sections.push(
      [
        "## Recent writing",
        "",
        ...posts.map((post) => linkItem(post.title, post.url, post.publishedFormatted)),
      ].join("\n")
    );
  }

  sections.push(
    [
      "## Optional",
      "",
      ...features.map((feature) =>
        linkItem(
          feature.name,
          absoluteUrl(`/feature-ideas/${feature.key}`),
          getEntrySummary(feature)
        )
      ),
    ].join("\n")
  );

  return new Response(`${sections.join("\n\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
