<script setup lang="ts">
definePlutoBlock({
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
})

// The landing hero. The text comes from the slots of `::pluto-hero` in
// content/index.md, so an editor can change it in the admin.
</script>

<template>
  <!-- The hero starts under the site header, so its sky shows behind the clear header (AppHeader). -->
  <section class="relative isolate -mt-(--pluto-site-header-height) overflow-hidden pt-(--pluto-site-header-height)">
    <!-- Light mode: a warm sky with the cream of the heart. Dark mode: space. -->
    <div class="hero-sky absolute inset-0 -z-10" />
    <StarsBg
      class="hidden dark:block"
      color="var(--color-heart-200)"
      :star-count="160"
      speed="slow"
    />

    <UContainer class="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:py-28">
      <div class="flex flex-col items-start gap-6">
        <PlutoChip
          v-if="$slots.headline"
          icon="i-lucide-heart"
        >
          <slot
            name="headline"
            mdc-unwrap="p"
          />
        </PlutoChip>

        <h1 class="text-5xl font-semibold tracking-tight text-highlighted text-balance sm:text-6xl lg:text-7xl">
          <slot
            name="title"
            mdc-unwrap="p"
          />
        </h1>

        <div class="max-w-xl text-lg text-muted text-pretty sm:text-xl">
          <slot
            name="description"
            mdc-unwrap="p"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <slot name="links" />
        </div>

        <div class="w-full max-w-md">
          <slot />
        </div>

        <p
          v-if="$slots.notice"
          class="flex items-center gap-2 text-sm text-muted"
        >
          <UIcon
            name="i-lucide-flask-conical"
            class="size-4 shrink-0 text-primary"
          />
          <span>
            <slot
              name="notice"
              mdc-unwrap="p"
            />
          </span>
        </p>
      </div>

      <PlutoOrbit class="max-w-sm sm:max-w-md lg:max-w-none" />
    </UContainer>
  </section>
</template>

<style scoped>
.hero-sky {
  background:
    radial-gradient(60rem 40rem at 85% -10%, var(--color-heart-100), transparent 70%),
    radial-gradient(40rem 30rem at 0% 100%, var(--color-haze-50), transparent 70%);
}

.dark .hero-sky {
  background:
    radial-gradient(60rem 40rem at 85% -10%, color-mix(in oklab, var(--color-haze-900) 45%, transparent), transparent 70%),
    radial-gradient(40rem 30rem at 0% 100%, color-mix(in oklab, var(--color-tholin-950) 60%, transparent), transparent 70%);
}
</style>
