import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['principles', 'practice', 'cognition']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/updates' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cadence: z.enum(['daily', 'weekly']),
    sources: z.array(z.object({
      label: z.string(),
      url: z.url().refine((value) => /^https?:\/\//.test(value), '来源链接必须使用 http 或 https'),
    })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, updates };
