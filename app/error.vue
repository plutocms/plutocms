<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const notFound = computed(() => props.error.statusCode === 404)

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: notFound.value ? 'Page not found' : 'Error',
  description: 'We are sorry but this page could not be found.'
})
</script>

<template>
  <PlutoRoot>
    <AppShell>
      <UContainer
        class="flex min-h-[70dvh] flex-col items-center justify-center gap-6 py-16 text-center"
      >
        <PlutoLogo mark class="lost size-32 sm:size-40" />

        <p class="text-primary text-6xl font-bold">
          {{ error.statusCode }}
        </p>

        <h1 class="text-highlighted text-3xl font-semibold sm:text-4xl">
          {{
            notFound
              ? 'This page is not a planet anymore.'
              : 'Something went wrong.'
          }}
        </h1>

        <p class="text-muted max-w-md text-lg">
          {{
            notFound
              ? 'Like Pluto in 2006, this page lost its place on the map. It may be out there, at the edge of the solar system.'
              : error.statusMessage || error.message
          }}
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <UButton
            size="lg"
            icon="i-lucide-house"
            @click="clearError({ redirect: '/' })"
          >
            Back home
          </UButton>
          <UButton
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-lucide-book-open"
            @click="clearError({ redirect: '/getting-started' })"
          >
            Read the docs
          </UButton>
        </div>
      </UContainer>
    </AppShell>
  </PlutoRoot>
</template>

<style scoped>
.lost {
  animation: drift 9s ease-in-out infinite;
}

@keyframes drift {
  50% {
    transform: translate(6%, -4%) rotate(8deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lost {
    animation: none;
  }
}
</style>
