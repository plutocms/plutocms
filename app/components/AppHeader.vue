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

// The sections of the site.
const sections = computed(() => [
  {
    label: 'Docs',
    icon: 'i-lucide-book-open',
    to: '/docs/getting-started',
    active: route.path.startsWith('/docs')
  },
  {
    label: 'Layers',
    icon: 'i-lucide-layers',
    to: '/layers',
    active: route.path.startsWith('/layers')
  }
])
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
    <!-- The logo, then the sections, on the left. -->
    <template #left>
      <ULink
        :to="header?.to || '/'"
        title="Pluto CMS"
        aria-label="Pluto CMS"
        class="flex shrink-0"
      >
        <PlutoLogo class="text-highlighted h-8 w-auto shrink-0" />
      </ULink>
      <UNavigationMenu
        :items="sections"
        variant="link"
        class="ms-6 hidden lg:flex"
      />
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
      <UNavigationMenu
        :items="sections"
        orientation="vertical"
        class="-mx-2.5 mb-4"
      />
      <USeparator class="mb-4" />
      <UContentNavigation highlight :navigation="navigation" />
    </template>
  </UHeader>
</template>
