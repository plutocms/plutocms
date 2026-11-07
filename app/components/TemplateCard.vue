<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import type { StoreTemplate } from '~~/server/api/templates.get'

// One template of the store: the preview (a link to the live demo), the name, the category, the
// description, the backends, the CLI command, and the demo and deploy buttons.
const props = defineProps<{ template: StoreTemplate }>()

const category = computed(() => TEMPLATE_CATEGORIES[props.template.category])
const { copy, copied } = useClipboard()
</script>

<template>
  <article
    class="border-default bg-default flex flex-col overflow-hidden rounded-xl border"
  >
    <component
      :is="template.demo ? 'a' : 'div'"
      :href="template.demo ?? undefined"
      :target="template.demo ? '_blank' : undefined"
      :rel="template.demo ? 'noopener' : undefined"
      :aria-label="
        template.demo ? `${template.name}: open the live demo` : undefined
      "
      class="group border-default bg-elevated relative block aspect-16/10 overflow-hidden border-b"
    >
      <img
        v-if="template.image"
        :src="template.image"
        :alt="`A page of the ${template.name} template`"
        width="1440"
        height="900"
        loading="lazy"
        decoding="async"
        class="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <!-- No image: the template is the CLI command only. -->
      <div
        v-else
        class="text-muted flex size-full flex-col items-center justify-center gap-3"
      >
        <span
          class="bg-default ring-default flex size-14 items-center justify-center rounded-2xl ring"
        >
          <UIcon name="i-lucide-terminal" class="text-highlighted size-7" />
        </span>
        <p class="text-sm">The CLI only</p>
      </div>
      <span
        v-if="template.demo"
        class="bg-default/90 text-highlighted ring-default absolute inset-e-3 bottom-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium opacity-0 ring backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <UIcon name="i-lucide-external-link" class="size-3.5" />
        Live demo
      </span>
    </component>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <div class="flex items-start justify-between gap-3">
        <h2 class="text-highlighted text-lg font-semibold">
          {{ template.name }}
        </h2>
        <UBadge
          v-if="category"
          :label="category.label"
          :icon="category.icon"
          color="neutral"
          variant="subtle"
          size="sm"
          class="shrink-0"
        />
      </div>

      <p class="text-toned flex-1 text-sm text-pretty">
        {{ template.description }}
      </p>

      <div class="text-muted flex flex-wrap items-center gap-3 text-xs">
        <span
          v-for="backend in template.backends"
          :key="backend"
          class="flex items-center gap-1"
        >
          <UIcon
            :name="LAYER_BACKENDS[backend]?.icon ?? 'i-lucide-server'"
            class="size-3.5"
          />
          {{ LAYER_BACKENDS[backend]?.label ?? backend }}
        </span>
      </div>

      <div
        class="border-default bg-elevated/50 flex max-w-full items-center gap-1 rounded-lg border p-1 ps-3"
      >
        <span class="text-dimmed font-mono text-sm select-none">$</span>
        <code
          class="text-highlighted min-w-0 flex-1 overflow-x-auto px-2 font-mono text-xs whitespace-nowrap"
          >{{ template.command }}</code
        >
        <UButton
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          :aria-label="copied ? 'Copied' : 'Copy the command'"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="copy(template.command)"
        />
      </div>

      <div v-if="template.demo || template.deploy" class="flex flex-wrap gap-2">
        <UButton
          v-if="template.demo"
          :to="template.demo"
          target="_blank"
          label="Live demo"
          icon="i-lucide-eye"
          color="neutral"
          variant="outline"
          size="sm"
        />
        <template v-if="template.deploy">
          <UButton
            :to="template.deploy.vercel"
            target="_blank"
            label="Deploy to Vercel"
            icon="i-simple-icons-vercel"
            color="neutral"
            size="sm"
          />
          <UButton
            :to="template.deploy.netlify"
            target="_blank"
            label="Deploy to Netlify"
            icon="i-simple-icons-netlify"
            color="neutral"
            variant="subtle"
            size="sm"
          />
        </template>
      </div>
    </div>
  </article>
</template>
