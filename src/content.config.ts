import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\\/g, '/').replace(/\.md$/, ''),
    pattern: '**/*.md',
  }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'ko', 'ja']),
    date: z.coerce.date(),
    category: z.string(),
    title: z.string(),
    excerpt: z.string(),
    lead: z.string(),
  }),
});

export const collections = { blog };
