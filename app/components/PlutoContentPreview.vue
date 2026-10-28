<script setup lang="ts">
// The preview frame of the visual editor, the same as the site pages. The
// landing (`index`) renders like `pages/index.vue`: no prose components, no
// page header. The other pages render like the docs pages.
const props = defineProps<{
  frontmatter: Record<string, unknown>
}>()

const landing = computed(
  () => props.frontmatter.id === 'index' || props.frontmatter.slug === 'index'
)

usePlutoPreviewRender(() =>
  landing.value ? { prose: false, components: { a: 'prose-a' } } : {}
)
</script>

<template>
  <!-- The slot holds the blocks directly: no wrapper element. -->
  <slot v-if="landing" />

  <UContainer v-else>
    <UPage>
      <UPageHeader
        v-if="typeof frontmatter.title === 'string' && frontmatter.title"
        :title="frontmatter.title"
        :description="
          typeof frontmatter.description === 'string'
            ? frontmatter.description
            : undefined
        "
      />

      <UPageBody>
        <slot />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
