<script setup lang="ts">
definePlutoBlock({
  label: 'Layer cards',
  icon: 'i-lucide-blocks',
  group: 'landing',
  description:
    'The first layers of the directory, with a link to all of them.',
  props: {
    limit: { label: 'Number of layers' }
  },
  insert: '::pluto-layer-showcase\n::'
})

// A few layers of the directory on the landing, with a link to all of them.
const props = withDefaults(defineProps<{
  /** How many layers to show. */
  limit?: number
}>(), { limit: 6 })

const { data: layers } = await useAsyncData('layers', () =>
  queryCollection('layers').order('order', 'ASC').all()
)
const shown = computed(() => (layers.value ?? []).slice(0, props.limit))
</script>

<template>
  <div class="flex flex-col items-center gap-8">
    <div class="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <LayerCard v-for="layer in shown" :key="layer.path" :layer="layer" />
    </div>
    <UButton
      to="/layers"
      label="Browse all layers"
      trailing-icon="i-lucide-arrow-right"
      color="neutral"
      variant="outline"
      size="lg"
    />
  </div>
</template>
