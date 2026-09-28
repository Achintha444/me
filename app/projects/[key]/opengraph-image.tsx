import { getProjectByKey, getProjectsData } from "@/lib/content";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE, renderOgImage } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

/** Alt text for project share images. */
export const alt = `Project case study by ${SITE_NAME}`;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

/** Route params for project share images. */
interface ProjectImageProps {
  params: Promise<{ key: string }>;
}

/**
 * Prerenders one share image per project at build time.
 *
 * @returns The route params for every project.
 */
export function generateStaticParams() {
  return getProjectsData().projects.map(({ key }) => ({ key }));
}

/**
 * Share image for a project case study: project name, with the author's
 * role and the project's sector as the subtitle.
 *
 * @param props - Route params containing the project key.
 * @returns The rendered PNG share card.
 */
export default async function Image({ params }: ProjectImageProps) {
  const { key } = await params;
  const project = getProjectByKey(key);
  const sector = project?.overview?.find((item) => item.key === "sector")?.body;

  return renderOgImage({
    eyebrow: "Case study",
    title: project?.name ?? "Projects",
    subtitle: [project?.role, sector].filter(Boolean).join(" · ") || undefined,
  });
}
