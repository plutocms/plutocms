<script setup lang="ts">
const { seo } = useAppConfig()

// The admin is a single-page app with its own layout. The public pages get the
// header, main, footer and search of the docs template.
const route = useRoute()
const isAdmin = computed(() => route.path === '/admin' || route.path.startsWith('/admin/'))

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
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
    <NuxtPage v-if="isAdmin" />

    <AppShell v-else>
      <NuxtPage />
    </AppShell>
  </PlutoRoot>
</template>
