import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['trends', 'principles', 'practice', 'cognition']),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    sources: z.array(z.object({
      label: z.string(),
      url: z.url().refine((value) => /^https?:\/\//.test(value), '来源链接必须使用 http 或 https'),
    })).default([]),
    draft: z.boolean().default(false),
  }).superRefine((data, ctx) => {
    if (!data.draft && !data.cover) ctx.addIssue({ code: 'custom', path: ['cover'], message: '发布前请添加与文章主题对应的手绘封面。' });
    if (!data.draft && !data.coverAlt?.trim()) ctx.addIssue({ code: 'custom', path: ['coverAlt'], message: '发布前请填写封面的文字说明。' });
  }),
});

export const collections = { articles };
