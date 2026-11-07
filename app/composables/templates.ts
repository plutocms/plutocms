import type { StoreTemplate, StoreTemplates } from '~~/server/api/templates.get'

/** The templates of the store, from the cached server route (the registry of the templates repo). */
export function useStoreTemplates() {
  return useFetch<StoreTemplates>('/api/templates', { key: 'store-templates' })
}

/**
 * "Start from scratch": the `-t none` option of the CLI. It is not in the registry, and it has no
 * folder, so it has no preview, no demo and no deploy button.
 */
export const SCRATCH_TEMPLATE: StoreTemplate = {
  id: 'none',
  name: 'Start from scratch',
  description:
    'No template: a Nuxt app that extends Pluto, with no pages of its own. A good start for a developer or an agent.',
  category: 'none',
  image: null,
  demo: null,
  backends: ['git', 'supabase'],
  command: 'npm create pluto@latest my-app -t none',
  deploy: null
}

/** The label of a template category. */
export const TEMPLATE_CATEGORIES: Record<
  string,
  { label: string; icon: string }
> = {
  blog: { label: 'Blog', icon: 'i-lucide-pen-line' },
  shop: { label: 'Shop', icon: 'i-lucide-shopping-bag' },
  dashboard: { label: 'Admin only', icon: 'i-lucide-layout-dashboard' },
  none: { label: 'Developer', icon: 'i-lucide-code' }
}
