<script setup lang="ts">
definePlutoBlock({
  label: 'Headless demo',
  icon: 'i-lucide-plug',
  group: 'landing',
  description:
    'A request to the public API in three stacks, and its JSON answer.',
  insert: '::pluto-headless-demo\n::'
})

// The headless demo of the landing: a request in three stacks, and the JSON answer that streams
// in, line by line, while the demo is on screen.
const tabs = [
  {
    value: 'fetch',
    label: 'Any stack',
    icon: 'i-lucide-globe',
    code: `const res = await fetch(
  'https://your-site.dev/api/pluto/v1/content/product?limit=2'
)
const { data } = await res.json()`
  },
  {
    value: 'nuxt',
    label: 'Nuxt',
    icon: 'i-simple-icons-nuxtdotjs',
    code: `const { data } = await usePlutoPublicList('product', {
  limit: 2
})`
  },
  {
    value: 'curl',
    label: 'curl',
    icon: 'i-lucide-terminal',
    code: `curl https://your-site.dev/api/pluto/v1/content/product?limit=2`
  }
]

const answer = `{
  "data": [
    {
      "slug": "moon-mug",
      "name": "Moon mug",
      "price": 4990,
      "category": { "slug": "home", "label": "Home" },
      "media": [{ "url": "/media/moon-mug.webp" }]
    },
    {
      "slug": "orbit-lamp",
      "name": "Orbit lamp",
      "price": 14900,
      "media": [{ "url": "/media/orbit-lamp.webp" }]
    }
  ],
  "meta": { "total": 24, "limit": 2, "offset": 0 }
}`.split('\n')

const tab = ref('fetch')
const current = computed(() => tabs.find((item) => item.value === tab.value)!)

const root = ref<HTMLElement | null>(null)
// One step for each line of the answer, then a pause.
const { step, reduced } = useDemoTimeline(root, [
  900,
  ...answer.slice(1).map(() => 110),
  3500
])
const shown = computed(() =>
  reduced.value ? answer.length : Math.min(step.value + 1, answer.length)
)
</script>

<template>
  <div ref="root" class="grid gap-4 lg:grid-cols-2">
    <div
      class="bg-kuiper-950 ring-kuiper-800 flex flex-col overflow-hidden rounded-xl ring"
    >
      <div class="border-kuiper-800 flex gap-1 border-b p-1.5" role="tablist">
        <button
          v-for="item in tabs"
          :key="item.value"
          :aria-selected="tab === item.value"
          :class="
            tab === item.value
              ? 'bg-kuiper-800 text-kuiper-50'
              : 'text-kuiper-400 hover:text-kuiper-200'
          "
          role="tab"
          type="button"
          class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          @click="tab = item.value"
        >
          <UIcon :name="item.icon" class="size-3.5" />
          {{ item.label }}
        </button>
      </div>
      <pre
        class="text-kuiper-200 flex-1 overflow-x-auto p-4 font-mono text-[13px]/6"
      >{{ current.code }}</pre>
    </div>

    <div
      class="bg-kuiper-950 ring-kuiper-800 overflow-hidden rounded-xl ring"
      aria-label="The JSON answer of the public API"
    >
      <div
        class="border-kuiper-800 text-kuiper-400 flex items-center gap-2 border-b px-4 py-2.5 text-xs"
      >
        <span class="size-2 rounded-full bg-emerald-400" />
        200 OK · application/json
      </div>
      <pre
        class="text-heart-100 min-h-96 overflow-x-auto p-4 font-mono text-[13px]/6"
      ><span
          v-for="(line, index) in answer.slice(0, shown)"
          :key="index"
          class="demo-json block"
        >{{ line }}</span></pre>
    </div>
  </div>
</template>

<style scoped>
.demo-json {
  animation: demo-json 0.25s ease-out both;
}
@keyframes demo-json {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .demo-json {
    animation: none;
  }
}
</style>
