<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { withoutTrailingSlash } from 'ufo'

// The docs sidebar is the DocsLayout component, so the app shell stays outside it.
definePageMeta({
  layout: false
})

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const routePath = computed(() => withoutTrailingSlash(route.path))

// The page and the surround come from the nuxt-content layer, which reads them at build
// time or at run time (plutoNuxtContent.render), so this page does not know the mode.
const { data: page } = await usePlutoContentPage(routePath, {
  collection: 'docs'
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: surround } = await usePlutoContentSurround(routePath, {
  collection: 'docs'
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const headline = computed(() =>
  findPageHeadline(navigation?.value, page.value?.path)
)

defineOgImage('Docs', { title, description, headline: headline.value })

// A signed-in editor gets a link to this page in the admin. The link is client only.
const adminLink = usePlutoContentEditLink(page)

const links = computed(() => {
  const links = []
  if (toc?.bottom?.edit) {
    links.push({
      icon: 'i-lucide-external-link',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${page?.value?.stem}.${page?.value?.extension}`,
      target: '_blank'
    })
  }

  if (adminLink.value) {
    links.push({
      icon: 'i-lucide-pencil',
      label: 'Edit in admin',
      to: adminLink.value
    })
  }

  return [...links, ...(toc?.bottom?.links || [])].filter(Boolean)
})
</script>

<template>
  <DocsLayout>
    <UPage v-if="page">
      <UPageHeader
        :title="page.title"
        :description="page.description"
        :headline="headline"
      >
        <template #links>
          <UButton
            v-for="(link, index) in page.links"
            :key="index"
            v-bind="link"
          />

          <PageHeaderLinks />
        </template>
      </UPageHeader>

      <UPageBody>
        <ContentRenderer v-if="page" :value="page" />

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template v-if="page?.body?.toc?.links?.length" #right>
        <UContentToc :title="toc?.title" :links="page.body?.toc?.links">
          <template v-if="toc?.bottom" #bottom>
            <div
              class="hidden space-y-6 lg:block"
              :class="{ 'mt-6!': page.body?.toc?.links?.length }"
            >
              <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />

              <UPageLinks :title="toc.bottom.title" :links="links" />

              <PlutoFact :seed="page.path" />
            </div>
          </template>
        </UContentToc>
      </template>
    </UPage>
  </DocsLayout>
</template>
