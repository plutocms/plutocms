import type { NpmPackageInfo } from '~~/server/api/npm/[...name].get'

/** The kinds of layers, in the order of the filter. */
export const LAYER_KINDS = {
  core: { label: 'Core', icon: 'i-lucide-orbit' },
  backend: { label: 'Backend', icon: 'i-lucide-database' },
  feature: { label: 'Feature', icon: 'i-lucide-puzzle' },
  'add-on': { label: 'Add-on', icon: 'i-lucide-plug' },
  tooling: { label: 'Tooling', icon: 'i-lucide-wrench' }
} as const

export type LayerKind = keyof typeof LAYER_KINDS

/** The backends a layer works with. */
export const LAYER_BACKENDS: Record<string, { label: string; icon: string }> = {
  git: { label: 'Git CMS', icon: 'i-simple-icons-git' },
  supabase: { label: 'Supabase', icon: 'i-simple-icons-supabase' }
}

/** The name of a layer page from its path: `/layers/supabase-shop` → `supabase-shop`. */
export function layerSlug(path: string): string {
  return path.split('/').pop() ?? path
}

/** The npm data of a package (version, weekly downloads), from the cached server route. */
export function useNpmPackage(name: MaybeRefOrGetter<string>) {
  return useFetch<NpmPackageInfo>(() => `/api/npm/${toValue(name)}`, {
    key: `npm:${toValue(name)}`,
    lazy: true
  })
}

/** `12345` → `12.3k`. */
export function formatDownloads(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '–'
  }
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}
