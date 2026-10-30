<script setup lang="ts">
// The layer directory: every official layer, with a search and filters. The cards come from
// `content/layers` (the build-time index), and the npm numbers from `/api/npm`.
const { data: layers } = await useAsyncData('layers', () =>
  queryCollection('layers').order('order', 'ASC').all()
)

const search = ref('')
const kind = ref<LayerKind | 'all'>('all')
const backend = ref<string>('all')

const kindItems = computed(() => [
  { value: 'all', label: 'All', icon: 'i-lucide-layers' },
  ...Object.entries(LAYER_KINDS)
    .filter(([value]) => layers.value?.some((layer) => layer.kind === value))
    .map(([value, item]) => ({ value, label: item.label, icon: item.icon }))
])

const backendItems = [
  { value: 'all', label: 'Every backend' },
  ...Object.entries(LAYER_BACKENDS).map(([value, item]) => ({
    value,
    label: item.label,
    icon: item.icon
  }))
]

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return (layers.value ?? []).filter((layer) => {
    if (kind.value !== 'all' && layer.kind !== kind.value) {
      return false
    }
    if (
      backend.value !== 'all' &&
      !(layer.backends ?? []).includes(backend.value)
    ) {
      return false
    }
    if (!term) {
      return true
    }
    return [layer.title, layer.package, layer.description]
      .join(' ')
      .toLowerCase()
      .includes(term)
  })
})

function reset() {
  search.value = ''
  kind.value = 'all'
  backend.value = 'all'
}

const title = 'Layers'
const description =
  'Every Pluto layer in one place. A layer does one job: add a backend, a feature, or an add-on to your admin and your site.'

useSeoMeta({ title, ogTitle: title, description, ogDescription: description })
defineOgImage('Docs', { title, description, headline: 'Pluto' })
</script>

<template>
  <div>
    <UPageHero
      :title="title"
      :description="description"
      :ui="{ container: 'py-16 sm:py-20 lg:py-24' }"
    >
      <template #headline>
        <PlutoChip icon="i-lucide-layers" center>The layer directory</PlutoChip>
      </template>
    </UPageHero>

    <UContainer class="pb-24">
      <div class="mb-8 flex flex-col gap-4">
        <div class="flex flex-col gap-3 sm:flex-row">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search the layers"
            aria-label="Search the layers"
            class="flex-1"
            size="lg"
          />
          <USelect
            v-model="backend"
            :items="backendItems"
            aria-label="Backend"
            size="lg"
            class="sm:w-48"
          />
        </div>
        <div role="group" aria-label="Kind" class="flex flex-wrap gap-2">
          <UButton
            v-for="item in kindItems"
            :key="item.value"
            :label="item.label"
            :icon="item.icon"
            :aria-pressed="kind === item.value"
            :variant="kind === item.value ? 'solid' : 'outline'"
            color="neutral"
            size="sm"
            class="rounded-full"
            @click="kind = item.value as LayerKind | 'all'"
          />
        </div>
      </div>

      <p class="text-muted mb-4 text-sm">
        {{ filtered.length }}
        {{ filtered.length === 1 ? 'layer' : 'layers' }}
      </p>

      <div
        v-if="filtered.length"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <LayerCard v-for="layer in filtered" :key="layer.path" :layer="layer" />
      </div>

      <UEmpty
        v-else
        icon="i-lucide-search-x"
        title="No layer matches"
        description="Try another word, or clear the filters."
        :actions="[{ label: 'Clear the filters', onClick: reset }]"
      />

      <UPageCTA
        class="mt-16"
        title="Build your own layer"
        description="A layer is a Nuxt layer that plugs into the Pluto admin with one function. The guide shows each step."
        :links="[
          {
            label: 'Create a layer',
            to: '/docs/guides/create-a-layer',
            trailingIcon: 'i-lucide-arrow-right'
          }
        ]"
        variant="subtle"
      />
    </UContainer>
  </div>
</template>
