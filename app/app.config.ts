export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
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
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
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
