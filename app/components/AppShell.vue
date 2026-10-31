<script setup lang="ts">
// The chrome of the public pages: header, main, footer and search. The admin
// pages do not use it, so they never load the content navigation or the search
// data. `provide('navigation')` serves the header and the docs layout. The page data
// comes from the docs layer composables, which hide the render mode. The
// search stays build time: it reads the Nuxt Content index.
const { data: tree } = await usePlutoContentNavigation({
  collection: 'docs',
  type: 'doc'
})
// The docs are under `/docs`, so the tree has one root item. The sidebar shows its children.
const navigation = computed(() => {
  const items = tree.value ?? []
  return items.length === 1 && items[0]?.path === '/docs'
    ? (items[0].children ?? [])
    : items
})
const { data: files } = useLazyAsyncData(
  'search',
  () => queryCollectionSearchSections('docs'),
  {
    server: false
  }
)

provide('navigation', navigation)
</script>

<template>
  <!-- `pluto-header-offset` is from the docs layer: it moves the header
       under the Pluto admin bar when the bar shows. -->
  <AppHeader class="pluto-header-offset" />

  <UMain>
    <slot />
  </UMain>

  <AppFooter />

  <ClientOnly>
    <!-- `site-search` gets the darker, blurred overlay (main.css). -->
    <LazyUContentSearch
      :files="files"
      :navigation="navigation"
      :ui="{ modal: 'site-search' }"
    />
  </ClientOnly>
</template>
