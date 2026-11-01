import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    // The docs are at `/docs/**`: the file path is the route.
    docs: defineCollection({
      type: 'page',
      source: 'docs/**',
      schema: z.object({
        links: z
          .array(
            z.object({
              label: z.string(),
              icon: z.string(),
              to: z.string(),
              target: z.string().optional()
            })
          )
          .optional()
      })
    }),
    // The layer directory (`/layers`): one page for each layer. The frontmatter fills the card
    // and the header of the detail page; the body is the detail page.
    layers: defineCollection({
      type: 'page',
      source: 'layers/**',
      schema: z.object({
        // The npm package, for example `@plutocms/supabase-shop`.
        package: z.string(),
        // An Iconify name, for example `i-lucide-store`.
        icon: z.string(),
        kind: z.enum(['core', 'backend', 'feature', 'add-on', 'tooling']),
        // The backends that the layer works with: `git` (the Git CMS), `supabase`.
        backends: z.array(z.string()).default([]),
        // The layers that it extends (package names).
        extends: z.array(z.string()).default([]),
        repo: z.string(),
        // The docs page of the layer, for example `/docs/layers/shop`.
        docs: z.string().optional(),
        official: z.boolean().default(true),
        order: z.number().default(100)
      })
    })
  }
})
