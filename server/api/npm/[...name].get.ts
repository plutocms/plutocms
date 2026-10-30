/** The npm data of a package for the layer directory. */
export interface NpmPackageInfo {
  name: string
  version: string | null
  /** The date of the publish of `version` (ISO). */
  published: string | null
  /** The downloads of the last 7 days. */
  downloads: number | null
  license: string | null
}

interface NpmPackument {
  'dist-tags'?: { latest?: string }
  time?: Record<string, string>
  license?: string
}

/**
 * `GET /api/npm/@plutocms/<name>`: the latest version, its date, and the weekly downloads of a
 * Pluto package. The answer is cached for 6 hours. When npm does not answer, the values are
 * `null`, and the page shows the card without them.
 */
export default defineCachedEventHandler(
  async (event): Promise<NpmPackageInfo> => {
    const name = getRouterParam(event, 'name') ?? ''
    if (!/^@plutocms\/[a-z0-9-]+$/.test(name)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Not a Pluto package'
      })
    }
    const [packument, downloads] = await Promise.all([
      $fetch<NpmPackument>(
        `https://registry.npmjs.org/${name.replace('/', '%2f')}`
      ).catch(() => null),
      $fetch<{ downloads?: number }>(
        `https://api.npmjs.org/downloads/point/last-week/${name}`
      ).catch(() => null)
    ])
    const version = packument?.['dist-tags']?.latest ?? null
    return {
      name,
      version,
      published: version ? (packument?.time?.[version] ?? null) : null,
      downloads: downloads?.downloads ?? null,
      license: packument?.license ?? null
    }
  },
  {
    name: 'npm-package',
    maxAge: 60 * 60 * 6,
    getKey: (event) => getRouterParam(event, 'name') ?? ''
  }
)
