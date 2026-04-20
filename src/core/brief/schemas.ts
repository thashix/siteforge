import { z } from "zod";

// =============================================================================
// Validation Schemas
// =============================================================================
// These Zod schemas mirror the TypeScript types in types/site.ts
// and are used to validate:
//   1. User input from the brief wizard
//   2. AI output from the brief analyzer
//   3. API request/response payloads
// =============================================================================

export const businessSectorSchema = z.enum([
  "beauty",
  "restaurant",
  "health",
  "legal",
  "creative",
  "coaching",
  "tech",
  "realestate",
  "education",
  "retail",
  "other",
]);

export const siteToneSchema = z.enum([
  "elegant",
  "bold",
  "minimal",
  "warm",
  "playful",
  "corporate",
  "luxurious",
]);

export const sectionTypeSchema = z.enum([
  "hero",
  "services",
  "about",
  "gallery",
  "testimonials",
  "cta",
  "pricing",
  "faq",
  "contact",
  "footer",
]);

export const userBriefSchema = z.object({
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description ne doit pas dépasser 2000 caractères"),
  businessName: z.string().max(100).optional(),
  stylePreferences: z.string().max(500).optional(),
  colorPreferences: z.string().max(200).optional(),
});

export const briefMetaSchema = z.object({
  location: z.string().optional(),
  targetAudience: z.string().optional(),
  services: z.array(z.string()).optional(),
  language: z.string().default("fr"),
});

export const briefPageSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sections: z.array(sectionTypeSchema).min(1).max(10),
  sectionContents: z.record(z.string(), z.any()),
});

export const siteBriefSchema = z.object({
  sector: businessSectorSchema,
  businessName: z.string().min(1),
  tagline: z.string().min(1).max(200),
  tone: siteToneSchema,
  paletteKey: z.string().min(1),
  fontPairingKey: z.string().min(1),
  sections: z.array(sectionTypeSchema),
  sectionContents: z.record(z.string(), z.any()),
  pages: z.array(briefPageSchema).optional(),
  sharedFooter: z.any().optional(),
  navLinks: z.array(z.object({ label: z.string(), page: z.string() })).optional(),
  meta: briefMetaSchema,
});

export type UserBriefInput = z.infer<typeof userBriefSchema>;
export type SiteBriefOutput = z.infer<typeof siteBriefSchema>;
