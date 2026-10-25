<script setup lang="ts">
// The landing hero. The text comes from the slots of `::pluto-hero` in
// content/index.md, so an editor can change it in the admin.
</script>

<template>
  <section class="relative isolate overflow-hidden">
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
        <span
          v-if="$slots.headline"
          class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring ring-primary/25"
        >
          <UIcon
            name="i-lucide-heart"
            class="size-4"
          />
          <slot
            name="headline"
            mdc-unwrap="p"
          />
        </span>

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
