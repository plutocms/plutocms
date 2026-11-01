<script setup lang="ts">
const { data: page } = await usePlutoContentPage('/', {
  collection: 'landing',
  type: 'page'
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Docs', { title, description, headline: 'Pluto' })

// The landing is the `index` page of the `page` type, so the admin bar shows
// "Edit page" for it.
usePlutoContentEditLink(page, 'page')
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :prose="false"
    :components="{ a: 'prose-a', pre: 'prose-pre' }"
  />
</template>
