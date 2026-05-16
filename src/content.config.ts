import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const optionalString = z
  .string()
  .nullish()
  .transform((v) => (v == null || v === '' ? undefined : v));

const aeoSchema = z
  .object({
    tldr: optionalString,
    entity_type: z
      .enum([
        'Article',
        'OpinionNewsArticle',
        'Prediction',
        'Project',
        'Review',
        'Theme',
      ])
      .default('Article'),
    author: optionalString,
  })
  .optional();

const baseSchema = z.object({
  title: z.string(),
  date: z.coerce.date().optional(),
  description: optionalString,
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  cover: optionalString,
  role: optionalString,
  order: z.number().optional(),
  link: optionalString,
  aeo: aeoSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: baseSchema,
});

const predictions = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/predictions' }),
  schema: baseSchema.extend({
    confidence: optionalString,
    status: optionalString,
    target: z.coerce.date().optional(),
  }),
});

const ideas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ideas' }),
  schema: baseSchema,
});

const curation = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/curation' }),
  schema: baseSchema.extend({
    author: optionalString,
  }),
});

const themes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/themes' }),
  schema: baseSchema.extend({
    year: z.string(),
    range: optionalString,
    objective: optionalString,
  }),
});

export const collections = { projects, predictions, ideas, curation, themes };
