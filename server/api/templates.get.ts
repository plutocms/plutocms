/** One template of the store, ready to show. */
export interface StoreTemplate {
  id: string
  name: string
  description: string
  category: string
  /** The preview image (an absolute URL), 1440x900. */
  image: string | null
  /** The live demo. */
  demo: string | null
  /** The backends, in the order of the registry. A deploy uses the first one. */
  backends: string[]
  /** The CLI command that starts a project from the template. */
  command: string
  /** The deploy buttons. `null` when the source is not a folder of a GitHub repo. */
  deploy: { vercel: string; netlify: string } | null
}

export interface StoreTemplates {
  templates: StoreTemplate[]
}

/**
 * The registry of the templates repo: the same file as the CLI reads. Like the CLI,
 * `PLUTO_TEMPLATES_URL` overrides it (an http(s) URL), to test a registry before it is merged.
 * The images are relative to it.
 */
const REGISTRY_OVERRIDE = process.env.PLUTO_TEMPLATES_URL ?? ''
const REGISTRY_URL = /^https?:\/\//.test(REGISTRY_OVERRIDE)
  ? REGISTRY_OVERRIDE
  : 'https://raw.githubusercontent.com/plutocms/templates/main/templates.json'

/** The env of a Supabase project. The deploy page of the host asks for it. */
const SUPABASE_ENV = {
  env: 'SUPABASE_URL,SUPABASE_KEY,DATABASE_URL',
  envDescription: 'The values of your Supabase project',
  envLink: 'https://pluto.vulmix.dev/docs/supabase'
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const IMAGE = /^store\/[a-z0-9-]+\/[a-z0-9-]+\.(?:webp|png|jpg)$/
const GITHUB_SOURCE = /^gh:([\w.-]+)\/([\w.-]+)\/([\w./-]+)$/

const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

/**
 * One registry entry as a store template, or `null` when the entry is not usable: a missing
 * field, an unknown shape, or a premium template (the store has no premium templates yet).
 */
export function toStoreTemplate(entry: unknown): StoreTemplate | null {
  if (!entry || typeof entry !== 'object') {
    return null
  }
  const item = entry as Record<string, unknown>
  if (
    !isText(item.id) ||
    !ID.test(item.id) ||
    !isText(item.name) ||
    !isText(item.description) ||
    !isText(item.category) ||
    item.access !== 'free' ||
    !item.backends ||
    typeof item.backends !== 'object'
  ) {
    return null
  }
  const backends = Object.keys(item.backends)
  if (!backends.length) {
    return null
  }
  const name = `my-${item.category}`
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    image:
      isText(item.image) && IMAGE.test(item.image)
        ? new URL(item.image, REGISTRY_URL).href
        : null,
    demo:
      isText(item.demo) && item.demo.startsWith('https://') ? item.demo : null,
    backends,
    command: `npm create pluto@latest ${name} -t ${item.id}`,
    deploy: deployLinks(item.source, name, backends[0] === 'supabase')
  }
}

/** The Vercel and Netlify links of a `gh:<owner>/<repo>/<dir>` source. */
function deployLinks(
  source: unknown,
  name: string,
  supabase: boolean
): StoreTemplate['deploy'] {
  const match = typeof source === 'string' ? GITHUB_SOURCE.exec(source) : null
  if (!match) {
    return null
  }
  const [, owner, repo, dir] = match
  const vercel = new URLSearchParams({
    'repository-url': `https://github.com/${owner}/${repo}/tree/main/${dir}`,
    'project-name': name,
    'repository-name': name,
    ...(supabase ? SUPABASE_ENV : {})
  })
  const netlify = new URLSearchParams({
    repository: `https://github.com/${owner}/${repo}`,
    create_from_path: dir!
  })
  return {
    vercel: `https://vercel.com/new/clone?${vercel}`,
    netlify: `https://app.netlify.com/start/deploy?${netlify}`
  }
}

/**
 * `GET /api/templates`: the templates of the store, from the registry of the templates repo. A new
 * template shows with no deploy of this site. The answer is cached for 10 minutes. When GitHub
 * does not answer, the route fails (a failure is not cached) and the page says so.
 */
export default defineCachedEventHandler(
  async (): Promise<StoreTemplates> => {
    const registry = await $fetch<{ version?: number; templates?: unknown }>(
      REGISTRY_URL,
      { responseType: 'json' }
    ).catch(() => null)
    if (registry?.version !== 1 || !Array.isArray(registry.templates)) {
      throw createError({
        statusCode: 502,
        statusMessage: 'The template registry did not answer'
      })
    }
    return {
      templates: registry.templates
        .map(toStoreTemplate)
        .filter((template) => template !== null)
    }
  },
  { name: 'store-templates', maxAge: 60 * 10 }
)
