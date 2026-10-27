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
      insert: '::pluto-hero\n#headline\nA small label\n\n#title\nYour title\n\n#description\nA short text about Pluto.\n::'
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
    // The Pluto layer sets the default size of buttons, inputs and form fields
    // to xl for the admin. The docs template needs the Nuxt UI default (md).
    // The admin shares these values, so it uses md too.
    button: {
      defaultVariants: {
        size: 'md'
      }
    },
    input: {
      defaultVariants: {
        size: 'md'
      }
    },
    formField: {
      defaultVariants: {
        size: 'md'
      }
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
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/plutocms/pluto',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: `Pluto • MIT • © ${new Date().getFullYear()}`,
    tagline: 'Made at the edge of the solar system.',
    // The docs are a Nuxt Content site that Pluto edits. The link explains it.
    poweredBy: { label: 'These docs run on Pluto', to: '/getting-started/why-pluto#these-docs-run-on-pluto' },
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/plutocms/pluto',
      'target': '_blank',
      'aria-label': 'Pluto on GitHub'
    }]
  },
  toc: {
    title: 'On this page',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/plutocms/plutocms/edit/main/content',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/plutocms/pluto',
        target: '_blank'
      }]
    }
  }
})
