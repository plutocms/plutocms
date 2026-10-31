export default defineAppConfig({
  ui: {
    colors: {
      primary: 'tholin',
      secondary: 'haze',
      neutral: 'kuiper'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: 'Pluto'
  },
  header: {
    title: 'Pluto',
    to: '/',
    search: true,
    colorMode: true,
    links: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/plutocms/pluto',
        target: '_blank',
        'aria-label': 'GitHub'
      }
    ]
  },
  footer: {
    credits: `Pluto • MIT • © ${new Date().getFullYear()}`,
    tagline: 'Made at the edge of the solar system.',
    // The docs are a Nuxt Content site that Pluto edits. The link explains it.
    poweredBy: {
      label: 'These docs run on Pluto',
      to: '/docs/getting-started/why-pluto#these-docs-run-on-pluto'
    },
    colorMode: false,
    links: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/plutocms/pluto',
        target: '_blank',
        'aria-label': 'Pluto on GitHub'
      }
    ]
  },
  toc: {
    title: 'On this page',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/plutocms/plutocms/edit/main/content',
      links: [
        {
          icon: 'i-lucide-star',
          label: 'Star on GitHub',
          to: 'https://github.com/plutocms/pluto',
          target: '_blank'
        }
      ]
    }
  }
})
