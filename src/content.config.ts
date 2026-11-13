import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Each post is a Markdown file in src/content/writing; its file name is its URL: /writing/<file name>/.
// A post with `draft: true` shows in `npm run dev` but is left out of the built site until the line is removed.
const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
