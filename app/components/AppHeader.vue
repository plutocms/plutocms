<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { header } = useAppConfig()

// On the home page, at the top, the header has no tint and no border: it sits
// over the hero, so the sky shows behind it. After a short scroll it gets them
// back. The server renders the top state (no scroll yet).
const route = useRoute()
const { y } = useWindowScroll()
const overHero = computed(() => route.path === '/' && y.value < 24)
</script>

<template>
  <UHeader
    :class="
      overHero
        ? 'border-transparent bg-transparent backdrop-blur-none'
        : undefined
    "
    :to="header?.to || '/'"
    class="transition-[background-color,border-color,backdrop-filter] duration-200"
  >
    <template #title>
      <span title="Pluto CMS" class="flex">
        <PlutoLogo class="text-highlighted h-8 w-auto shrink-0" />
      </span>
    </template>

    <template #right>
      <!-- The search is an icon button, like the color mode and the GitHub link. -->
      <UContentSearchButton
        v-if="header?.search"
        color="neutral"
        variant="ghost"
      />

      <UColorModeButton
        v-if="header?.colorMode"
        color="neutral"
        variant="ghost"
      />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <UContentNavigation highlight :navigation="navigation" />
    </template>
  </UHeader>
</template>
