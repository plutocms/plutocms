// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultAttributes } from 'eslint-plugin-better-tailwindcss/api/defaults'
import prettier from 'eslint-config-prettier'

export default withNuxt(
  betterTailwindcss.configs['correctness-error'],
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
        // px arbitrary values become spacing steps (`h-[27px]` is `h-6.75`).
        rootFontSize: 16,
        // Resolves `#build/pluto.css` (the Pluto layer CSS, with the Pluto UI tokens) in main.css.
        tsconfig: '.nuxt/tsconfig.app.json',
        attributes: [
          ...getDefaultAttributes(),
          ['^v-bind:ui$', [{ match: 'objectValues' }]]
        ]
      }
    },
    rules: {
      // Canonical Tailwind classes (the same suggestion as Tailwind IntelliSense,
      // `suggestCanonicalClasses`), and no double spaces after its fix.
      'better-tailwindcss/enforce-canonical-classes': 'error',
      'better-tailwindcss/no-unnecessary-whitespace': 'error',
      'better-tailwindcss/no-unknown-classes': [
        'error',
        {
          ignore: [
            '^stars$',
            '^star-layer$',
            '^star$',
            '^pluto-header-offset$',
            // Scoped CSS classes of the landing and the 404 page.
            '^hero-sky$',
            // The animations of the landing demos.
            '^demo-(line|pop|slide|json)$',
            '^pluto-orbit$',
            '^orbit-ring$',
            '^orbit-chip$',
            '^charon$',
            '^moon$',
            '^moon-orbit$',
            '^planet$',
            '^lost$'
          ]
        }
      ]
    }
  },
  // Last: turns off every rule that Prettier covers.
  prettier
)
