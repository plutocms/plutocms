<script setup lang="ts">
definePlutoBlock<{ name: string, alt: string, hint?: string }>({
  label: 'Screenshot',
  icon: 'i-lucide-image',
  group: 'site',
  description: 'A screenshot from app/assets/screenshots, or a placeholder until the file exists.',
  props: {
    name: { label: 'File name (no extension)' },
    alt: { label: 'Text alternative' },
    hint: { label: 'What to capture' }
  },
  insert: '::pluto-screenshot{name="admin-home" alt="The admin dashboard" hint="The dashboard after the first sign-in"}\n::'
})

// A screenshot of the docs: `::pluto-screenshot{name="admin-home" alt="..." hint="..."}`.
//
// The image is `app/assets/screenshots/<name>.png` (or `.webp`, `.jpg`). An optional
// `<name>.dark.png` shows in dark mode. Vite finds the files at build time, so a new file needs
// no change in the Markdown. Until the file exists, a dashed placeholder shows the hint and the
// path to add. Capture at 1440 × 900 (16:10) in the light mode, and the dark mode if it differs.
const props = defineProps<{
  /** The file name in app/assets/screenshots, with no extension. */
  name: string
  /** The text alternative of the image. */
  alt: string
  /** What the screenshot shows. The placeholder shows it, and it is the caption. */
  hint?: string
}>()

const files = import.meta.glob<string>('~/assets/screenshots/*.{png,webp,jpg}', {
  eager: true,
  import: 'default'
})

function find(name: string): string | undefined {
  for (const [path, url] of Object.entries(files)) {
    const base = path.slice(path.lastIndexOf('/') + 1)
    if (base.slice(0, base.lastIndexOf('.')) === name) {
      return url
    }
  }
}

const light = computed(() => find(props.name))
const dark = computed(() => find(`${props.name}.dark`))
</script>

<template>
  <figure class="my-6">
    <template v-if="light">
      <img
        :src="light"
        :alt="alt"
        loading="lazy"
        class="w-full rounded-lg ring ring-default"
        :class="{ 'dark:hidden': dark }"
      >
      <img
        v-if="dark"
        :src="dark"
        :alt="alt"
        loading="lazy"
        class="hidden w-full rounded-lg ring ring-default dark:block"
      >
    </template>
    <div
      v-else
      class="flex aspect-16/10 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-accented bg-elevated/50 p-6 text-center"
    >
      <UIcon
        name="i-lucide-image-plus"
        class="size-8 text-dimmed"
      />
      <p class="font-medium text-highlighted">
        Screenshot: {{ hint || alt }}
      </p>
      <code class="text-xs text-muted">app/assets/screenshots/{{ name }}.png</code>
    </div>
    <figcaption
      v-if="hint && light"
      class="mt-2 text-center text-sm text-muted"
    >
      {{ hint }}
    </figcaption>
  </figure>
</template>
