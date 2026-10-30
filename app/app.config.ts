export default defineAppConfig({
  // The site components in the block list of the visual editor: a name, an icon and the settings.
  plutoBlocks: {
    'pluto-hero': {
      label: 'Hero',
      icon: 'i-lucide-sparkles',
      group: 'landing',
      description: 'The big title at the top of the home page.',
      slots: {
        headline: { label: 'Small label', content: 'inline' },
        title: { label: 'Title', content: 'inline' },
        description: { label: 'Text', content: 'rich' },
        links: { label: 'Buttons', content: 'blocks', accepts: ['u-button'] },
        notice: { label: 'Notice', content: 'inline' }
      },
      insert:
        '::pluto-hero\n#headline\nA small label\n\n#title\nYour title\n\n#description\nA short text about Pluto.\n::'
    },
    'pluto-chip': {
      label: 'Chip',
      icon: 'i-lucide-tag',
      group: 'landing',
      description: 'A short label above a section title.',
      props: {
        icon: { type: 'icon', label: 'Icon' },
        center: { type: 'boolean', label: 'Center the label' }
      },
      slots: { default: { label: 'Text', content: 'inline' } },
      insert: '::pluto-chip{icon="i-lucide-heart"}\nA short label\n::'
    },
    'pluto-setup-demo': {
      label: 'Setup demo',
      icon: 'i-lucide-terminal',
      group: 'landing',
      description:
        'A terminal runs create-pluto, and a browser shows the store, then the admin. It plays while it is on screen.',
      insert: '::pluto-setup-demo\n::'
    },
    'pluto-layers-demo': {
      label: 'Layers demo',
      icon: 'i-lucide-layers',
      group: 'landing',
      description:
        'Pick layers, and the stack, the admin menu and the nuxt.config.ts change with them.',
      insert: '::pluto-layers-demo\n::'
    },
    'pluto-headless-demo': {
      label: 'Headless demo',
      icon: 'i-lucide-plug',
      group: 'landing',
      description:
        'A request to the public API in three stacks, and its JSON answer.',
      insert: '::pluto-headless-demo\n::'
    },
    'pluto-layer-showcase': {
      label: 'Layer cards',
      icon: 'i-lucide-blocks',
      group: 'landing',
      description:
        'The first layers of the directory, with a link to all of them.',
      props: {
        limit: { type: 'number', label: 'Number of layers' }
      },
      insert: '::pluto-layer-showcase\n::'
    },
    'pluto-palette': {
      label: 'Color palette',
      icon: 'i-lucide-palette',
      group: 'site',
      description: 'The color scales of Pluto. Used on the brand page.',
      insert: '::pluto-palette\n::'
    },
    'pluto-logo-preview': {
      label: 'Logo on light and dark',
      icon: 'i-lucide-image',
      group: 'site',
      description: 'The Pluto logo on a light and on a dark background.',
      insert: '::pluto-logo-preview\n::'
    }
  },
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
