import { z } from "zod/v4";

// ─── Nav ────────────────────────────────────────────────────────────────────

export const NavItemSchema = z.object({
  title: z.string(),
  link: z.string(),
  target: z.string().optional(),
});

export const NavDataSchema = z.object({
  title: z.object({
    title: z.string(),
    link: z.string(),
  }),
  content: z.array(NavItemSchema),
});

export type NavItem = z.infer<typeof NavItemSchema>;
export type NavData = z.infer<typeof NavDataSchema>;

// ─── Contact ─────────────────────────────────────────────────────────────────

export const ContactIconSchema = z.object({
  image: z.string(),
  key: z.string(),
  link: z.string(),
});

export type ContactIcon = z.infer<typeof ContactIconSchema>;

// ─── Experience ──────────────────────────────────────────────────────────────

export const ExperienceLinkSchema = z.object({
  title: z.string(),
  link: z.string(),
});

export const ExperienceImageSchema = z.object({
  image: z.string(),
  alt: z.string().optional(),
  key: z.string().optional(),
});

export const ExperiencePresentationSchema = z.object({
  link: z.string(),
});

const ExperienceBodyItemSchema = z.object({
  body: z.string(),
});

const ExperienceContentBodySchema = z.union([
  z.string(),
  z.array(ExperienceBodyItemSchema),
]);

export const ExperienceContentSectionSchema = z.object({
  title: z.string(),
  body: ExperienceContentBodySchema.optional(),
  links: z.array(ExperienceLinkSchema).optional(),
  images: z.array(ExperienceImageSchema).optional(),
  presentations: z.array(ExperiencePresentationSchema).optional(),
});

export const ExperienceSchema = z.object({
  title: z.tuple([z.string(), z.string(), z.string()]),
  content: z.array(ExperienceContentSectionSchema),
});

export const ExperienceDataSchema = z.object({
  pageTitle: z.string(),
  experiences: z.array(ExperienceSchema),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type ExperienceData = z.infer<typeof ExperienceDataSchema>;

// ─── Projects ─────────────────────────────────────────────────────────────────

export const ProjectOverviewItemSchema = z.object({
  title: z.string(),
  body: z.string(),
  key: z.string(),
});

export const ProjectLinkSchema = z.object({
  title: z.string(),
  link: z.string(),
});

export const ProjectImageSchema = z.object({
  image: z.string(),
  key: z.string(),
  alt: z.string().optional(),
});

export const ProjectPresentationSchema = z.object({
  link: z.string(),
});

const ProjectBodyItemSchema: z.ZodType<ProjectBodyItem> = z.lazy(() =>
  z.object({
    title: z.string().optional(),
    body: z.union([
      z.string(),
      z.array(z.object({ body: z.string() })),
      z.array(ProjectBodyItemSchema),
    ]).optional(),
    images: z.array(ProjectImageSchema).optional(),
    links: z.array(ProjectLinkSchema).optional(),
    key: z.string().optional(),
    presentations: z.array(ProjectPresentationSchema).optional(),
  })
);

export interface ProjectBodyItem {
  title?: string;
  body?: string | { body: string }[] | ProjectBodyItem[];
  images?: { image: string; key: string; alt?: string }[];
  links?: { title: string; link: string }[];
  key?: string;
  presentations?: { link: string }[];
}

const ProjectContentSectionBodySchema: z.ZodType<ProjectContentSectionBody> =
  z.lazy(() =>
    z.union([
      z.string(),
      z.array(z.object({ body: z.string() })),
      z.array(ProjectBodyItemSchema),
    ])
  );

export type ProjectContentSectionBody =
  | string
  | { body: string }[]
  | ProjectBodyItem[];

const ProjectContentTitleSchema = z.union([
  z.string(),
  z.tuple([z.string(), z.string(), z.string()]),
]);

export const ProjectContentSectionSchema = z.object({
  title: ProjectContentTitleSchema.optional(),
  body: ProjectContentSectionBodySchema.optional(),
  images: z.array(ProjectImageSchema).optional(),
  links: z.array(ProjectLinkSchema).optional(),
  presentations: z.array(ProjectPresentationSchema).optional(),
  key: z.string().optional(),
});

export const ProjectSchema = z.object({
  key: z.string(),
  name: z.string(),
  role: z.string().optional(),
  overview: z.array(ProjectOverviewItemSchema).optional(),
  image: z.string(),
  cols: z.number(),
  rows: z.number(),
  content: z.array(ProjectContentSectionSchema),
});

export const ProjectsDataSchema = z.object({
  pageTitle: z.string(),
  projects: z.array(ProjectSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectsData = z.infer<typeof ProjectsDataSchema>;

// ─── Feature Ideas ────────────────────────────────────────────────────────────

export const FeatureIdeaSchema = z.object({
  key: z.string(),
  name: z.string(),
  image: z.string(),
  cols: z.number(),
  rows: z.number(),
  content: z.array(ProjectContentSectionSchema),
});

export const FeatureIdeasDataSchema = z.object({
  pageTitle: z.string(),
  features: z.array(FeatureIdeaSchema),
});

export type FeatureIdea = z.infer<typeof FeatureIdeaSchema>;
export type FeatureIdeasData = z.infer<typeof FeatureIdeasDataSchema>;

// ─── Index (Home) ─────────────────────────────────────────────────────────────

export const InterestItemSchema = z.object({
  title: z.string(),
  imageUrl: z.string().optional(),
  key: z.string(),
});

export const InterestGroupSchema = z.object({
  title: z.string(),
  key: z.string(),
  color: z.string(),
  interests: z.array(InterestItemSchema),
});

export const IndexDataSchema = z.object({
  content: z.array(
    z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.array(z.any()).optional(),
      interests: z.array(InterestGroupSchema).optional(),
      icons: z.array(ContactIconSchema).optional(),
      titleLink: z
        .object({
          text: z.string(),
          link: z.string(),
          target: z.string().optional(),
        })
        .optional(),
    })
  ),
});

export type IndexData = z.infer<typeof IndexDataSchema>;
export type InterestGroup = z.infer<typeof InterestGroupSchema>;
export type InterestItem = z.infer<typeof InterestItemSchema>;
