import { readFileSync } from "fs";
import { join } from "path";

import {
  ExperienceDataSchema,
  FeatureIdeasDataSchema,
  IndexDataSchema,
  NavDataSchema,
  ProjectsDataSchema,
  type ExperienceData,
  type FeatureIdeasData,
  type IndexData,
  type NavData,
  type ProjectsData,
} from "./types";

/** Absolute path to the content directory at the repo root. */
const CONTENT_DIR = join(process.cwd(), "content");

/**
 * Reads and parses a JSON file from the content directory.
 * Throws a descriptive error on parse or validation failure.
 */
function readContent<T>(filename: string, parse: (raw: unknown) => T): T {
  const filepath = join(CONTENT_DIR, filename);
  const raw = readFileSync(filepath, "utf-8");
  const json = JSON.parse(raw) as unknown;
  return parse(json);
}

/**
 * Returns the navigation data from `content/navItems.json`.
 * Validated against {@link NavDataSchema}.
 */
export function getNavData(): NavData {
  return readContent("navItems.json", (raw) => NavDataSchema.parse(raw));
}

/**
 * Returns the home page content from `content/index.json`.
 * Validated against {@link IndexDataSchema}.
 */
export function getIndexData(): IndexData {
  return readContent("index.json", (raw) => IndexDataSchema.parse(raw));
}

/**
 * Returns all experience entries from `content/experience.json`.
 * Validated against {@link ExperienceDataSchema}.
 */
export function getExperienceData(): ExperienceData {
  return readContent("experience.json", (raw) =>
    ExperienceDataSchema.parse(raw)
  );
}

/**
 * Returns all project entries from `content/projects.json`.
 * Validated against {@link ProjectsDataSchema}.
 */
export function getProjectsData(): ProjectsData {
  return readContent("projects.json", (raw) => ProjectsDataSchema.parse(raw));
}

/**
 * Returns the about/me page content from `content/me.json`.
 * Returns raw parsed JSON since the shape is complex and freeform.
 */
export function getMeData(): Record<string, unknown> {
  return readContent("me.json", (raw) => raw as Record<string, unknown>);
}

/**
 * Returns all feature idea entries from `content/featureIdeas.json`.
 * Validated against {@link FeatureIdeasDataSchema}.
 */
export function getFeatureIdeasData(): FeatureIdeasData {
  return readContent("featureIdeas.json", (raw) =>
    FeatureIdeasDataSchema.parse(raw)
  );
}

/**
 * Returns a single project by its key, or `undefined` if not found.
 */
export function getProjectByKey(key: string) {
  const { projects } = getProjectsData();
  return projects.find((p) => p.key === key);
}

/**
 * Returns a single feature idea by its key, or `undefined` if not found.
 */
export function getFeatureIdeaByKey(key: string) {
  const { features } = getFeatureIdeasData();
  return features.find((f) => f.key === key);
}
