<script setup lang="ts">
import type { DemoAdminMenuItem, DemoAdminTile } from '~/components/PlutoDemoAdmin.vue'

definePlutoBlock({
  label: 'Layers demo',
  icon: 'i-lucide-layers',
  group: 'landing',
  description:
    'Pick layers, and the stack, the admin menu and the nuxt.config.ts change with them.',
  insert: '::pluto-layers-demo\n::'
})

// The layers demo of the landing: pick layers, and the stack, the admin and the `nuxt.config.ts`
// of the app change with them. It plays by itself while it is on screen: a pointer clicks one
// layer after the other, until the visitor picks one. The stack keeps its slots and the windows
// keep their height, so the page never moves while the loop plays.
interface DemoLayer {
  id: string
  label: string
  package: string
  icon: string
  /** What the layer gives, in a few words. */
  gives: string
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
    gives: 'Database, sign-in, roles',
    menu: [{ label: 'Users', icon: 'i-lucide-users' }]
  },
  {
    id: 'shop',
    label: 'Shop',
    package: '@plutocms/supabase-shop',
    icon: 'i-lucide-store',
    gives: 'Products, prices, stock',
    needs: 'supabase',
    menu: [{ label: 'Products', icon: 'i-lucide-package' }]
  },
  {
    id: 'blog',
    label: 'Blog',
    package: '@plutocms/supabase-blog',
    icon: 'i-lucide-newspaper',
    gives: 'Posts with a rich editor',
    needs: 'supabase',
    menu: [{ label: 'Posts', icon: 'i-lucide-file-text' }]
  },
  {
    id: '3d',
    label: '3D',
    package: '@plutocms/3d',
    icon: 'i-lucide-box',
    gives: '3D models in the media library',
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
const DURATIONS = [2200, 2200, 2200, 2200, 4000]

const root = ref<HTMLElement | null>(null)
const { step, pause } = useDemoTimeline(root, DURATIONS)
const picked = ref<string[] | null>(null)
const active = computed(() => new Set(picked.value ?? SCRIPT[step.value]))

// The pointer over the picker: before each step, it clicks the layer that the step adds.
const picker = ref<HTMLElement | null>(null)
const pointer = useDemoCursor(picker)
function plan(value: number) {
  pointer.clear()
  if (picked.value) {
    pointer.hide()
    return
  }
  const next = SCRIPT[value + 1]?.find((id) => !SCRIPT[value]!.includes(id))
  if (next) {
    pointer.click(`layer-${next}`, { delay: DURATIONS[value]! - 1000 })
  } else {
    pointer.hide(900)
  }
}
onMounted(() => {
  watch(step, plan, { immediate: true })
})

function toggle(layer: DemoLayer) {
  pause()
  pointer.clear()
  pointer.hide()
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

const stack = computed(() =>
  LAYERS.filter((layer) => active.value.has(layer.id)).reverse()
)

const hasBackend = computed(() => active.value.has('supabase'))

const menu = computed(() => {
  const items: DemoAdminMenuItem[] = [{ label: 'Home', icon: 'i-lucide-house', key: 'home' }]
  // Without a backend, core is the Git CMS: posts are Markdown files.
  if (!hasBackend.value) {
    items.push({ label: 'Posts', icon: 'i-lucide-file-text', key: 'github-posts', group: true })
  }
  for (const layer of LAYERS) {
    if (active.value.has(layer.id)) {
      items.push(
        ...layer.menu.map((item) => ({
          ...item,
          key: `${layer.id}-${item.label}`,
          group: item.label !== 'Users'
        }))
      )
    }
  }
  items.push(
    { label: 'Media', icon: 'i-lucide-images', key: 'media' },
    { label: 'Settings', icon: 'i-lucide-settings', key: 'settings', group: true }
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

/** The stat cards of the dashboard: one per content type, so they follow the layers. */
const tiles = computed(() => {
  const list: DemoAdminTile[] = []
  if (hasBackend.value) {
    list.push({
      key: 'users',
      label: 'Users',
      icon: 'i-lucide-users',
      count: 12,
      note: '2 new this week'
    })
  } else {
    list.push({
      key: 'posts',
      label: 'Posts',
      icon: 'i-lucide-file-text',
      count: 8,
      note: '1 new this week',
      published: 7,
      drafts: 1
    })
  }
  if (active.value.has('shop')) {
    list.push({
      key: 'products',
      label: 'Products',
      icon: 'i-lucide-package',
      count: 24,
      note: '3 new this week',
      published: 22,
      drafts: 2
    })
  }
  if (active.value.has('blog')) {
    list.push({
      key: 'blog',
      label: 'Posts',
      icon: 'i-lucide-newspaper',
      count: 31,
      note: '4 new this week',
      published: 29,
      drafts: 2
    })
  }
  list.push({
    key: 'media',
    label: 'Media',
    icon: 'i-lucide-images',
    count: active.value.has('3d') ? 57 : 40,
    note: active.value.has('3d') ? '3D models too' : '5 new this week'
  })
  return list.slice(0, 4)
})
</script>

<template>
  <div ref="root" class="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
    <!-- The picker and the stack, with the pointer over them -->
    <div ref="picker" class="relative flex flex-col gap-6">
      <div role="group" aria-label="Layers" class="flex flex-wrap gap-2">
        <UButton
          v-for="layer in LAYERS"
          :key="layer.id"
          :label="layer.label"
          :icon="layer.icon"
          :aria-pressed="active.has(layer.id)"
          :variant="active.has(layer.id) ? 'solid' : 'outline'"
          :color="active.has(layer.id) ? 'primary' : 'neutral'"
          :data-demo-target="`layer-${layer.id}`"
          class="rounded-full"
          @click="toggle(layer)"
        />
      </div>

      <!-- The stack. Its empty slots keep its height, so the page stays still. -->
      <div class="flex flex-col gap-2" aria-live="polite">
        <div
          v-for="slot in Math.max(0, LAYERS.length - stack.length)"
          :key="`slot-${slot}`"
          class="border-default/70 flex h-14 items-center justify-center rounded-xl border border-dashed"
          aria-hidden="true"
        >
          <UIcon name="i-lucide-plus" class="text-dimmed size-4" />
        </div>
        <TransitionGroup name="demo-stack">
          <div
            v-for="layer in stack"
            :key="layer.id"
            class="border-primary/30 bg-primary/5 flex h-14 items-center gap-3 rounded-xl border px-3 shadow-sm"
          >
            <span
              class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
            >
              <UIcon :name="layer.icon" class="size-5" />
            </span>
            <span class="flex min-w-0 flex-col">
              <span class="text-highlighted font-medium">{{ layer.label }}</span>
              <span class="text-muted truncate text-xs">{{ layer.gives }}</span>
            </span>
            <span class="text-muted ms-auto hidden shrink-0 font-mono text-xs sm:block">
              {{ layer.package }}
            </span>
          </div>
        </TransitionGroup>
        <div
          class="border-default bg-elevated flex h-14 items-center gap-3 rounded-xl border px-3"
        >
          <span
            class="bg-default ring-default text-highlighted flex size-9 shrink-0 items-center justify-center rounded-lg ring"
          >
            <UIcon name="i-lucide-orbit" class="size-5" />
          </span>
          <span class="flex min-w-0 flex-col">
            <span class="text-highlighted font-medium">Core</span>
            <span class="text-muted truncate text-xs">
              {{
                hasBackend
                  ? 'The admin, the media library'
                  : 'The admin, the Git CMS, the media library'
              }}
            </span>
          </span>
          <span class="text-muted ms-auto hidden shrink-0 font-mono text-xs sm:block">
            @plutocms/core
          </span>
        </div>
      </div>

      <p class="text-muted flex items-start gap-2 text-sm">
        <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0" />
        <span>
          A layer brings the layers it needs: the shop brings Supabase. Your app extends only the
          top ones, and the admin grows with them.
        </span>
      </p>

      <PlutoDemoCursor v-bind="pointer.cursor" />
    </div>

    <!-- The admin and the config -->
    <PlutoDemoStage class="flex flex-col gap-4">
      <PlutoDemoWindow url="localhost:3000/admin" class="h-88">
        <PlutoDemoAdmin
          :backend="
            hasBackend
              ? { label: 'Database · Supabase', icon: 'i-simple-icons-supabase' }
              : { label: 'Git · Local', icon: 'i-lucide-git-branch' }
          "
          :menu="menu"
          :tiles="tiles"
          :create="active.has('shop') ? 'Product' : 'Post'"
        />
      </PlutoDemoWindow>

      <PlutoDemoWindow dark title="nuxt.config.ts" icon="i-simple-icons-nuxt" class="h-56">
        <pre
          class="text-(--demo-fg) relative overflow-hidden p-4 font-mono text-[13px]/6"
        ><span class="text-(--demo-storage)">export default</span> <span class="text-(--demo-fn)">defineNuxtConfig</span><span class="text-(--demo-punct)">({</span>
  <span class="text-(--demo-key)">extends</span><span class="text-(--demo-punct)">: [</span>
<TransitionGroup name="demo-config"><span v-for="name in extendsList" :key="name" class="block">    <span class="text-(--demo-string)">'{{ name }}'</span><span class="text-(--demo-punct)">,</span></span></TransitionGroup><span class="text-(--demo-punct)">  ]
})</span></pre>
      </PlutoDemoWindow>
    </PlutoDemoStage>
  </div>
</template>

<style scoped>
.demo-stack-enter-active,
.demo-stack-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.demo-stack-move {
  transition: transform 0.35s ease;
}
.demo-stack-enter-from,
.demo-stack-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.97);
}
/* A line of the config fades in or out in place. A line that leaves stays out of the flow. */
.demo-config-enter-active,
.demo-config-leave-active {
  transition: opacity 0.3s ease;
}
.demo-config-leave-active {
  position: absolute;
}
.demo-config-enter-from,
.demo-config-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .demo-stack-enter-active,
  .demo-stack-leave-active,
  .demo-stack-move,
  .demo-config-enter-active,
  .demo-config-leave-active {
    transition: none;
  }
}
</style>
