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

// ─── CV / Resume ─────────────────────────────────────────────────────────────

/** Inline link reference within a bullet. */
export interface CVBulletLink {
  text: string;
  url: string;
}

/** Map of bullet index (as string key) to an array of inline link replacements. */
export type CVBulletLinks = Record<string, CVBulletLink[]>;

/** A single employment entry. */
export interface CVEmployment {
  company: string;
  role: string;
  type?: string;
  courses?: string;
  stack?: string;
  duration: string;
  bullets: string[];
  bulletLinks?: CVBulletLinks;
}

/** A single project entry. */
export interface CVProject {
  name: string;
  type: string;
  role: string | null;
  stack: string;
  duration: string;
  bullets: string[];
  bulletLinks?: CVBulletLinks;
}

/** A leadership / award item. */
export interface CVLeadershipItem {
  text: string;
  link?: { text: string; url: string };
}

/** A volunteering entry. */
export interface CVVolunteering {
  organization: string;
  link?: { text: string; url: string };
  bullets: string[];
}

/** Education block. */
export interface CVEducation {
  university: string;
  accreditation: string;
  wesLink?: { text: string; url: string };
  duration: string;
  degree: string;
  gpa: string;
  researchLink?: { text: string; url: string };
  coursera: {
    certificatesLink?: { text: string; url: string };
    courses: { name: string; link: string }[];
  };
}

/** The full CV data shape. */
export interface CVData {
  name: string;
  tagline: string;
  contact: { email: string; phone: string; address: string };
  links: { label: string; url: string }[];
  skills: {
    technologies: string;
    languages: string;
    tools: string;
    designTools: string;
    spokenLanguages: string;
  };
  summary: string;
  employment: CVEmployment[];
  projects: CVProject[];
  leadership: CVLeadershipItem[];
  volunteering: CVVolunteering[];
  education: CVEducation;
  interests: string;
}

/**
 * Returns the CV / resume data from `content/cv.json`.
 * The JSON is cast directly — no Zod schema needed for a freeform document
 * that is only consumed server-side by the CV page.
 */
export function getCVData(): CVData {
  return readContent("cv.json", (raw) => raw as CVData);
}
