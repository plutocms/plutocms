import { plutoLayer } from '@plutocms/core/layers'

// Set PLUTO_LOCAL_ROOT=.. in .env to use the local Pluto checkouts (Pluto development).
// Without it, the site uses the published npm packages.

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [plutoLayer('@plutocms/nuxt-content')],

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
      websiteName: 'Pluto'
    }
  },

  /*
   * The pages are Markdown files in the GitHub repository, edited in the admin
   * at /admin. The Pluto defaults cover the CMS: the local `content/` folder in
   * development, GitHub in production, and the repo from Vercel or the git
   * remote. The nuxt-content layer sets `postType: false` and
   * `commit.skipDeploy: false`, so an edit redeploys the site.
   */

  // Three content types: the docs (`content/docs`, at `/docs`), the layer directory
  // (`content/layers`, at `/layers`), and the other pages (the landing `index.md`).
  // `render: 'hybrid'` is for testing and will go back to `'build'`. The pages are built with
  // the site, and the server reads a page from the repository only when its file changed
  // after the build. Hybrid mode needs a server, so the content pages are not prerendered.
  plutoNuxtContent: {
    types: [
      {
        preset: 'docs',
        name: 'doc',
        source: 'docs',
        routePrefix: '/docs',
        label: 'Doc',
        labelPlural: 'Docs'
      },
      {
        preset: 'docs',
        name: 'layer',
        source: 'layers',
        routePrefix: '/layers',
        label: 'Layer',
        labelPlural: 'Layers'
      },
      {
        preset: 'docs',
        name: 'page',
        source: '',
        exclude: ['docs/', 'layers/'],
        label: 'Page',
        labelPlural: 'Pages'
      }
    ],
    render: 'hybrid'
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
      // Prettier formats the code (format on save, `bun run prettier`). ESLint checks the
      // code, not its layout.
      stylistic: false
    }
  },

  llms: {
    domain: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'Pluto',
    description:
      'Documentation of Pluto, the layerable CMS built on Nuxt. Use it in a Nuxt app, or headless with any stack.',
    full: {
      title: 'Pluto - Full Documentation',
      description: 'This is the full documentation of Pluto.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/docs/getting-started%' }
        ]
      },
      {
        title: 'Core',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/docs/core%' }
        ]
      },
      {
        title: 'GitHub CMS',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/docs/github-cms%' }
        ]
      },
      {
        title: 'Supabase',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/docs/supabase%' }
        ]
      },
      {
        title: 'Layers',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/docs/layers%' }
        ]
      },
      {
        title: 'Guides',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/docs/guides%' }
        ]
      },
      {
        title: 'Layer directory',
        contentCollection: 'layers'
      },
      {
        title: 'Contributing',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/docs/contributing%' }
        ]
      }
    ]
  },

  // The OG images render at run time: with no prerendered pages, nothing creates them at build time.
  // Set `zeroRuntime: true` again when the site goes back to `render: 'build'` and prerenders.
  ogImage: {},

  routeRules: {
    // The admin is a single-page app. Never prerender it.
    '/admin/**': { prerender: false }
  }

  // There is no `prerender` key on purpose. In hybrid mode, a prerendered docs page would hide a
  // later edit. For `render: 'build'`, add `prerender: { routes: ['/'], crawlLinks: true }` again.
})
