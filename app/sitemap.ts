import type { MetadataRoute } from "next";
import { getProjectsData, getFeatureIdeasData } from "@/lib/content";

/** Base URL for the production site. */
const BASE_URL = "https://achintha.dev";

/**
 * Generates the sitemap.xml for the portfolio.
 * Includes all static pages plus dynamic project and feature idea pages.
 * Applied skill: nextjs — Metadata API file conventions.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { projects } = getProjectsData();
  const { features } = getFeatureIdeasData();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/experience`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
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
