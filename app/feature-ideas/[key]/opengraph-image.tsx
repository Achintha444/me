import { getFeatureIdeaByKey, getFeatureIdeasData } from "@/lib/content";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE, renderOgImage } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

/** Alt text for feature idea share images. */
export const alt = `UI/UX feature concept by ${SITE_NAME}`;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

/** Route params for feature idea share images. */
interface FeatureImageProps {
  params: Promise<{ key: string }>;
}

/**
 * Prerenders one share image per feature idea at build time.
 *
 * @returns The route params for every feature idea.
 */
export function generateStaticParams() {
  return getFeatureIdeasData().features.map(({ key }) => ({ key }));
}

/**
 * Share image for a feature idea: the concept's name under a
 * "Feature idea" eyebrow.
 *
 * @param props - Route params containing the feature idea key.
 * @returns The rendered PNG share card.
 */
export default async function Image({ params }: FeatureImageProps) {
  const { key } = await params;
  const feature = getFeatureIdeaByKey(key);

  return renderOgImage({
    eyebrow: "Feature idea",
    title: feature?.name ?? "Feature Ideas",
    subtitle: "UI/UX concept analysis — research, wireframes, and design proposal",
  });
}
