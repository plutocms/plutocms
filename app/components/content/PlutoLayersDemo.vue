<script setup lang="ts">
definePlutoBlock({
  label: 'Layers demo',
  icon: 'i-lucide-layers',
  group: 'landing',
  description:
    'Pick layers, and the stack, the admin menu and the nuxt.config.ts change with them.',
  insert: '::pluto-layers-demo\n::'
})

// The layers demo of the landing: pick layers, and the stack, the admin menu and the
// `nuxt.config.ts` of the app change with them. It plays by itself while it is on screen, until
// the visitor picks a layer.
interface DemoLayer {
  id: string
  label: string
  package: string
  icon: string
  /** The layer that it needs (it is added with it). */
  needs?: string
  /** The menu items that it adds to the admin. */
  menu: { label: string; icon: string }[]
}

const LAYERS: DemoLayer[] = [
  {
    id: 'supabase',
    label: 'Supabase',
    package: '@plutocms/supabase',
    icon: 'i-simple-icons-supabase',
    menu: [{ label: 'Users', icon: 'i-lucide-users' }]
  },
  {
    id: 'shop',
    label: 'Shop (Supabase)',
    package: '@plutocms/supabase-shop',
    icon: 'i-lucide-store',
    needs: 'supabase',
    menu: [{ label: 'Products', icon: 'i-lucide-package' }]
  },
  {
    id: 'blog',
    label: 'Blog (Supabase)',
    package: '@plutocms/supabase-blog',
    icon: 'i-lucide-newspaper',
    needs: 'supabase',
    menu: [{ label: 'Posts', icon: 'i-lucide-file-text' }]
  },
  {
    id: '3d',
    label: '3D',
    package: '@plutocms/3d',
    icon: 'i-lucide-box',
    menu: []
  }
]

// The autoplay: one more layer at each step.
const SCRIPT: string[][] = [
  [],
  ['supabase'],
  ['supabase', 'shop'],
  ['supabase', 'shop', '3d'],
  ['supabase', 'shop', 'blog', '3d']
]

const root = ref<HTMLElement | null>(null)
const { step, pause } = useDemoTimeline(root, [1800, 1800, 1800, 1800, 3600])
const picked = ref<string[] | null>(null)
const active = computed(() => new Set(picked.value ?? SCRIPT[step.value]))

function toggle(layer: DemoLayer) {
  pause()
  const next = new Set(active.value)
  if (next.has(layer.id)) {
    next.delete(layer.id)
    // A layer that needs this one goes too.
    for (const other of LAYERS) {
      if (other.needs === layer.id) {
        next.delete(other.id)
      }
    }
  } else {
    next.add(layer.id)
    if (layer.needs) {
      next.add(layer.needs)
    }
  }
  picked.value = [...next]
}

const stack = computed(() => LAYERS.filter((layer) => active.value.has(layer.id)).reverse())

const hasBackend = computed(() => active.value.has('supabase'))

const menu = computed(() => {
  const items = [{ label: 'Home', icon: 'i-lucide-house', key: 'dashboard' }]
  // Without a backend, core is the Git CMS: posts are Markdown files.
  if (!hasBackend.value) {
    items.push({ label: 'Posts', icon: 'i-lucide-file-text', key: 'github-posts' })
  }
  for (const layer of LAYERS) {
    if (active.value.has(layer.id)) {
      items.push(
        ...layer.menu.map((item) => ({ ...item, key: `${layer.id}-${item.label}` }))
      )
    }
  }
  items.push(
    { label: 'Media', icon: 'i-lucide-images', key: 'media' },
    { label: 'Settings', icon: 'i-lucide-settings', key: 'settings' }
  )
  return items
})

// The app extends only the top layers: a layer brings the layers it builds on.
const extendsList = computed(() => {
  const top = LAYERS.filter(
    (layer) =>
      active.value.has(layer.id) &&
      !LAYERS.some((other) => other.needs === layer.id && active.value.has(other.id))
  )
  const backendOrCore = top.filter((layer) => layer.id !== '3d')
  const names = backendOrCore.length
    ? backendOrCore.map((layer) => layer.package)
    : ['@plutocms/core']
  if (active.value.has('3d')) {
    names.push('@plutocms/3d')
  }
  return names
})
</script>

<template>
  <div ref="root" class="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
    <!-- The picker and the stack -->
    <div class="flex flex-col gap-6">
      <div role="group" aria-label="Layers" class="flex flex-wrap gap-2">
        <UButton
          v-for="layer in LAYERS"
          :key="layer.id"
          :label="layer.label"
          :icon="layer.icon"
          :aria-pressed="active.has(layer.id)"
          :variant="active.has(layer.id) ? 'solid' : 'outline'"
          :color="active.has(layer.id) ? 'primary' : 'neutral'"
          class="rounded-full"
          @click="toggle(layer)"
        />
      </div>

      <div class="flex flex-col gap-2" aria-live="polite">
        <TransitionGroup name="demo-stack">
          <div
            v-for="layer in stack"
            :key="layer.id"
            class="border-primary/30 bg-primary/5 flex items-center gap-3 rounded-xl border px-4 py-3"
          >
            <UIcon :name="layer.icon" class="text-primary size-5" />
            <span class="text-highlighted font-medium">{{ layer.label }}</span>
            <span class="text-muted ms-auto font-mono text-xs">{{ layer.package }}</span>
          </div>
        </TransitionGroup>
        <div
          class="border-default bg-elevated flex items-center gap-3 rounded-xl border px-4 py-3"
        >
          <UIcon name="i-lucide-orbit" class="text-highlighted size-5" />
          <span class="text-highlighted font-medium">Core</span>
          <span class="text-muted ms-auto font-mono text-xs">@plutocms/core</span>
        </div>
      </div>
    </div>

    <!-- The admin and the config -->
    <div class="flex flex-col gap-4">
      <div class="bg-default ring-default overflow-hidden rounded-xl shadow-lg ring">
        <div class="bg-kuiper-950 text-kuiper-200 flex items-center gap-2 px-3 py-2 text-xs">
          <PlutoLogo class="h-4 w-auto" />
          <span class="text-kuiper-400">Admin</span>
          <UBadge
            :label="hasBackend ? 'Supabase' : 'Git CMS'"
            :icon="hasBackend ? 'i-simple-icons-supabase' : 'i-simple-icons-git'"
            color="neutral"
            variant="subtle"
            size="sm"
            class="ms-auto"
          />
        </div>
        <div class="flex min-h-64">
          <ul class="border-default flex w-44 flex-col gap-0.5 border-e p-2">
            <TransitionGroup name="demo-menu">
              <li
                v-for="item in menu"
                :key="item.key"
                class="text-toned flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
              >
                <UIcon :name="item.icon" class="size-4" />
                {{ item.label }}
                <UBadge
                  v-if="item.key === 'media' && active.has('3d')"
                  label="3D"
                  color="primary"
                  variant="subtle"
                  size="sm"
                  class="ms-auto"
                />
              </li>
            </TransitionGroup>
          </ul>
          <div class="flex flex-1 flex-col gap-2 p-4">
            <div class="bg-elevated h-3 w-1/3 rounded" />
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-elevated/70 h-14 rounded-lg" />
              <div class="bg-elevated/70 h-14 rounded-lg" />
            </div>
            <div class="bg-elevated/50 h-3 w-full rounded" />
            <div class="bg-elevated/50 h-3 w-4/5 rounded" />
            <div class="bg-elevated/50 h-3 w-2/3 rounded" />
          </div>
        </div>
      </div>

      <div
        class="bg-kuiper-950 ring-kuiper-800 overflow-hidden rounded-xl font-mono text-[13px]/6 ring"
      >
        <div class="border-kuiper-800 text-kuiper-400 border-b px-4 py-2 text-xs">
          nuxt.config.ts
        </div>
        <pre class="text-kuiper-200 overflow-x-auto p-4"><span class="text-haze-300">export default</span> defineNuxtConfig({
  extends: [
<template v-for="name in extendsList" :key="name">    <span class="text-heart-200">'{{ name }}'</span>,
</template>  ]
})</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-stack-enter-active,
.demo-stack-leave-active,
.demo-menu-enter-active,
.demo-menu-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.demo-stack-move,
.demo-menu-move {
  transition: transform 0.35s ease;
}
.demo-stack-enter-from,
.demo-stack-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.97);
}
.demo-menu-enter-from,
.demo-menu-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
@media (prefers-reduced-motion: reduce) {
  .demo-stack-enter-active,
  .demo-stack-leave-active,
  .demo-menu-enter-active,
  .demo-menu-leave-active,
  .demo-stack-move,
  .demo-menu-move {
    transition: none;
  }
}
</style>
