import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// In dev, the site uses the local checkouts next to it (`../nuxt-content` and
// `../pluto`) when they exist, so unpublished layer changes work at once.
// PLUTO_USE_LOCAL=false turns this off; PLUTO_NUXT_CONTENT_PATH and
// PLUTO_PLUTO_PATH (which the layer reads) still win. A production build, or a
// clone without the checkouts (Vercel), uses the published npm packages.
const useLocal
  = process.env.PLUTO_USE_LOCAL === 'true'
    || (process.env.PLUTO_USE_LOCAL !== 'false' && process.env.NODE_ENV !== 'production')

if (useLocal) {
  for (const [variable, folder] of [
    ['PLUTO_NUXT_CONTENT_PATH', '../nuxt-content'],
    ['PLUTO_PLUTO_PATH', '../pluto']
  ] as const) {
    const path = fileURLToPath(new URL(`${folder}/`, import.meta.url))
    if (!process.env[variable] && existsSync(`${path}nuxt.config.ts`)) {
      process.env[variable] = path
    }
  }
}

const nuxtContentLayer = process.env.PLUTO_NUXT_CONTENT_PATH || '@plutocms/nuxt-content'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [[nuxtContentLayer, { install: true }]],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    },
    experimental: {
      sqliteConnector: 'native'
    }
  },

  experimental: {
    asyncContext: true
  },

  runtimeConfig: {
    public: {
      // The site name in the admin navbar and in the admin tab title.
      websiteName: 'Pluto CMS'
    }
  },

  /*
   * The Pluto CMS: the pages are Markdown files in the GitHub repository,
   * edited in the admin at /admin. In development, the pages are read from
   * and written to the local `content/` folder, so a dev server never writes
   * to the real repository. Set PLUTO_CMS_STORAGE=github to test against GitHub.
   */
  plutoCms: {
    enabled: true,
    storage:
      process.env.PLUTO_CMS_STORAGE === 'github' || process.env.NODE_ENV === 'production'
        ? 'github'
        : 'fs',
    github: {
      repo: process.env.PLUTO_CMS_REPO || 'plutocms/plutocms',
      branch: process.env.PLUTO_CMS_BRANCH || 'main',
      // The URL name of the GitHub App, for the "install the app" link.
      appSlug: process.env.PLUTO_CMS_APP_SLUG
    },
    // The pages are in `content/` in the repository.
    dir: 'content',
    // The docs have no blog posts.
    postType: false,
    // An edit must redeploy the site, so the commit message has no `[skip ci]`.
    commit: {
      skipDeploy: false
    }
  },

  // The landing page (`index.md`) is a page too, so the source is the content dir.
  plutoNuxtContent: {
    types: [{ preset: 'docs', name: 'doc', source: '' }]
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      // The Pluto layer sets `standalone: false` and `sortConfigKeys` for apps
      // that use the antfu config. This app has its own ESLint config.
      standalone: true,
      nuxt: {
        sortConfigKeys: false
      },
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  llms: {
    domain: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'Pluto CMS',
    description: 'Documentation of Pluto CMS, the layerable CMS for Nuxt.',
    full: {
      title: 'Pluto CMS - Full Documentation',
      description: 'This is the full documentation of Pluto CMS.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' }
        ]
      },
      {
        title: 'Core',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/core%' }
        ]
      },
      {
        title: 'GitHub CMS',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/github-cms%' }
        ]
      },
      {
        title: 'Supabase',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/supabase%' }
        ]
      },
      {
        title: 'Layers',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/layers%' }
        ]
      },
      {
        title: 'Guides',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/guides%' }
        ]
      },
      {
        title: 'Contributing',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/contributing%' }
        ]
      }
    ]
  },

  ogImage: {
    zeroRuntime: true
  },

  routeRules: {
    // The admin is a single-page app. Never prerender it.
    '/admin/**': { prerender: false }
  },

  prerender: {
    routes: [
      '/'
    ],
    crawlLinks: true
  }
})
