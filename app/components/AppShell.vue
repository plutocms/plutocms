<script setup lang="ts">
// The chrome of the public pages: header, main, footer and search. The admin
// pages do not use it, so they never load the content navigation or the search
// data. `provide('navigation')` serves the header and the docs layout.
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

provide('navigation', navigation)
</script>

<template>
  <!-- `pluto-header-offset` is from the nuxt-content layer: it moves the header
       under the Pluto admin bar when the bar shows. -->
  <AppHeader class="pluto-header-offset" />

  <UMain>
    <slot />
  </UMain>

  <AppFooter />

  <ClientOnly>
    <LazyUContentSearch
      :files="files"
      :navigation="navigation"
    />
  </ClientOnly>
</template>
