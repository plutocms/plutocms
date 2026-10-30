<script setup lang="ts">
import type { LayersCollectionItem } from '@nuxt/content'

// One layer in the directory: icon, name, package, description, kind and backends, and the npm
// version and weekly downloads. The whole card links to the page of the layer.
const props = defineProps<{ layer: LayersCollectionItem }>()

const { data: npm } = useNpmPackage(() => props.layer.package)
const kind = computed(() => LAYER_KINDS[props.layer.kind as LayerKind])
</script>

<template>
  <ULink
    :to="layer.path"
    raw
    class="group border-default bg-default hover:border-primary/50 hover:bg-elevated/40 relative flex flex-col gap-4 rounded-xl border p-5 transition-colors"
  >
    <div class="flex items-start gap-3">
      <span
        class="bg-elevated ring-default group-hover:ring-primary/40 flex size-11 shrink-0 items-center justify-center rounded-lg ring transition-shadow"
      >
        <UIcon :name="layer.icon" class="text-highlighted size-6" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-highlighted font-semibold">{{ layer.title }}</p>
        <p class="text-muted truncate font-mono text-xs">
          {{ layer.package }}
        </p>
      </div>
      <UBadge
        v-if="kind"
        :label="kind.label"
        :icon="kind.icon"
        color="neutral"
        variant="subtle"
        size="sm"
      />
    </div>

    <p class="text-toned line-clamp-3 flex-1 text-sm">
      {{ layer.description }}
    </p>

    <div class="text-muted flex items-center gap-3 text-xs">
      <span
        v-for="backend in layer.backends"
        :key="backend"
        :title="LAYER_BACKENDS[backend]?.label"
        class="flex items-center gap-1"
      >
        <UIcon
          :name="LAYER_BACKENDS[backend]?.icon ?? 'i-lucide-server'"
          class="size-3.5"
        />
        {{ LAYER_BACKENDS[backend]?.label ?? backend }}
      </span>
      <span class="ms-auto flex items-center gap-3 font-mono">
        <span v-if="npm?.version" class="flex items-center gap-1">
          <UIcon name="i-lucide-tag" class="size-3.5" />
          {{ npm.version }}
        </span>
        <span
          v-if="npm?.downloads !== null && npm?.downloads !== undefined"
          class="flex items-center gap-1"
        >
          <UIcon name="i-lucide-download" class="size-3.5" />
          {{ formatDownloads(npm.downloads) }}
        </span>
      </span>
    </div>
  </ULink>
</template>
