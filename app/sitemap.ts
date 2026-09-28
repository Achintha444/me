import type { MetadataRoute } from "next";
import { getProjectsData, getFeatureIdeasData } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/** Base URL for the production site. */
const BASE_URL = SITE_URL;

/**
 * Generates the sitemap.xml for the portfolio.
 * Includes all static pages plus dynamic project and feature idea pages.
 * Static paths must match the real route segments under `app/`.
 * Applied skill: nextjs — Metadata API file conventions.
 *
 * @returns Every indexable URL on the site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { projects } = getProjectsData();
  const { features } = getFeatureIdeasData();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/aboutMe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/experiences`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/cv`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/feature-ideas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.key}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const featureRoutes: MetadataRoute.Sitemap = features.map((feature) => ({
    url: `${BASE_URL}/feature-ideas/${feature.key}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...featureRoutes];
}
