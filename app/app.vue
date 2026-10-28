<script setup lang="ts">
const { seo } = useAppConfig()

// The admin is a single-page app with its own layout. The preview of the visual
// editor shows only the page. The public pages get the header, main, footer and
// search of the docs template.
const route = useRoute()
const isAdmin = computed(
  () => route.path === '/admin' || route.path.startsWith('/admin/')
)
// The preview page of the visual editor (an iframe in the admin) has no header, footer or search.
const isPreview = computed(() => isPlutoPreviewPath(route.path))

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [
    // The Pluto icons come from the Pluto layer (pluto/public/img).
    { rel: 'icon', href: '/img/pluto-icon.svg', type: 'image/svg+xml' },
    {
      rel: 'icon',
      href: '/img/pluto-icon.png',
      type: 'image/png',
      sizes: '96x96'
    },
    { rel: 'apple-touch-icon', href: '/img/pluto-icon.png' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <PlutoRoot>
    <NuxtPage v-if="isAdmin || isPreview" />

    <AppShell v-else>
      <NuxtPage />
    </AppShell>
  </PlutoRoot>
</template>
