<script setup lang="ts">
// A small copy of the Pluto admin for the demos of the landing: the dark bar with the backend
// badge, "View site" and the New button; the sidebar with the search box and the navigation; the
// dashboard with its date, title and one stat card per content type, or the list of a content
// type. It follows the color mode of the page, as the real admin does, and the bar stays dark in
// both modes. Each menu item is a `data-demo-target="menu-<key>"`, so a demo pointer can click it.
export interface DemoAdminMenuItem {
  key: string
  label: string
  icon: string
  /** A group in the sidebar (Posts, Settings…): it shows a chevron. */
  group?: boolean
}

export interface DemoAdminTile {
  key: string
  label: string
  icon: string
  count: number
  /** The line next to the count, such as "3 new this week". */
  note: string
  published?: number
  drafts?: number
}

export interface DemoAdminRow {
  title: string
  status: 'published' | 'draft'
  date: string
}

const props = withDefaults(
  defineProps<{
    /** The backend badge of the bar, such as "Git · Local". */
    backend: { label: string; icon: string }
    menu: DemoAdminMenuItem[]
    /** The key of the active menu item. `home` shows the dashboard, another key its list. */
    active?: string
    /** The label of the New button, such as "Post". */
    create: string
    title?: string
    tiles: DemoAdminTile[]
    /** The rows of the list of the active content type. */
    rows?: DemoAdminRow[]
  }>(),
  { active: 'home', title: 'Dashboard', rows: () => [] }
)

// The date of the dashboard, like the real one. It comes after the mount: the server and the
// browser may not share a day.
const date = ref('')
onMounted(() => {
  date.value = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
})

const ratio = (tile: DemoAdminTile) =>
  tile.count > 0 ? ((tile.published ?? tile.count) / tile.count) * 100 : 0

const activeItem = computed(() =>
  props.menu.find((item) => item.key === props.active)
)
const list = computed(() =>
  Boolean(activeItem.value && activeItem.value.key !== 'home')
)
</script>

<template>
  <div class="bg-default flex h-full flex-col text-xs">
    <!-- The bar: dark in both modes, with its border. -->
    <div
      class="border-default text-kuiper-100 flex h-8 shrink-0 items-center gap-3 border-b bg-(--pluto-admin-navbar) px-3 text-[11px]"
    >
      <PlutoLogo mark class="size-4 shrink-0" />
      <span class="flex items-center gap-1 font-medium">
        <UIcon :name="backend.icon" class="size-3" />
        {{ backend.label }}
      </span>
      <span class="hidden items-center gap-1 sm:flex">
        <UIcon name="i-lucide-external-link" class="size-3" />
        View site
      </span>
      <span class="hidden items-center gap-1 sm:flex">
        <UIcon name="i-lucide-plus" class="size-3" />
        New {{ create }}
      </span>
      <span class="ms-auto flex items-center gap-2">
        <UIcon name="i-lucide-moon" class="size-3.5" />
        <span
          class="bg-primary text-inverted flex size-5 items-center justify-center rounded-full"
        >
          <UIcon name="i-lucide-user-round" class="size-3" />
        </span>
        <span class="font-medium">Local</span>
      </span>
    </div>

    <div class="flex min-h-0 flex-1">
      <!-- The sidebar -->
      <aside
        class="border-default bg-elevated/50 flex w-32 shrink-0 flex-col gap-2 border-e p-2 sm:w-40"
      >
        <div
          class="bg-default text-muted ring-default flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] ring"
        >
          <UIcon name="i-lucide-search" class="size-3" />
          <span class="flex-1">Search…</span>
          <kbd
            class="bg-elevated hidden rounded px-1 text-[9px] font-medium sm:inline"
            >⌘K</kbd
          >
        </div>
        <ul class="flex flex-col gap-0.5">
          <TransitionGroup name="demo-menu">
            <li
              v-for="item in menu"
              :key="item.key"
              :data-demo-target="`menu-${item.key}`"
              :class="
                item.key === active
                  ? 'bg-primary/10 text-primary'
                  : 'text-toned'
              "
              class="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200"
            >
              <UIcon :name="item.icon" class="size-3.5 shrink-0" />
              <span class="truncate">{{ item.label }}</span>
              <UIcon
                v-if="item.group"
                name="i-lucide-chevron-down"
                class="text-muted ms-auto size-3 shrink-0"
              />
            </li>
          </TransitionGroup>
        </ul>
      </aside>

      <!-- The dashboard, or the list of a content type -->
      <div
        class="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden p-3 sm:p-4"
      >
        <div class="flex items-end justify-between gap-2">
          <div class="flex flex-col">
            <span class="text-muted h-3.5 text-[10px]">{{
              list ? '' : date
            }}</span>
            <span
              class="text-highlighted font-[Fredoka] text-lg font-semibold tracking-tight"
            >
              {{ list ? activeItem?.label : title }}
            </span>
          </div>
          <span
            class="bg-primary text-inverted flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold"
          >
            <UIcon name="i-lucide-plus" class="size-3" />
            New {{ create }}
          </span>
        </div>

        <Transition name="demo-view" mode="out-in">
          <div
            v-if="list"
            key="list"
            class="border-default flex flex-col rounded-lg border"
          >
            <div
              v-for="(row, index) in rows"
              :key="row.title"
              :class="index > 0 ? 'border-default border-t' : ''"
              class="flex items-center gap-2 px-2.5 py-2"
            >
              <span
                class="text-highlighted min-w-0 flex-1 truncate font-medium"
                >{{ row.title }}</span
              >
              <span
                :class="
                  row.status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-elevated text-muted'
                "
                class="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize"
              >
                {{ row.status }}
              </span>
              <span class="text-muted hidden shrink-0 text-[10px] sm:block">{{
                row.date
              }}</span>
            </div>
          </div>

          <div v-else key="tiles" class="grid grid-cols-2 gap-2">
            <TransitionGroup name="demo-tile">
              <div
                v-for="tile in tiles"
                :key="tile.key"
                class="border-default bg-elevated/30 flex flex-col gap-1.5 rounded-lg border p-2.5"
              >
                <div class="flex items-center justify-between">
                  <span class="text-toned">{{ tile.label }}</span>
                  <span
                    class="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-md"
                  >
                    <UIcon :name="tile.icon" class="size-3" />
                  </span>
                </div>
                <div class="flex items-baseline gap-1.5">
                  <span
                    class="text-highlighted text-lg leading-none font-semibold"
                  >
                    {{ tile.count }}
                  </span>
                  <span class="text-muted truncate text-[10px]">{{
                    tile.note
                  }}</span>
                </div>
                <div class="bg-elevated h-1 overflow-hidden rounded-full">
                  <div
                    :style="{ width: `${ratio(tile)}%` }"
                    class="bg-primary h-full rounded-full transition-[width] duration-500"
                  />
                </div>
                <span
                  v-if="tile.published !== undefined"
                  class="text-muted text-[10px]"
                >
                  <span class="text-highlighted font-medium">{{
                    tile.published
                  }}</span>
                  published ·
                  <span class="text-highlighted font-medium">{{
                    tile.drafts ?? 0
                  }}</span>
                  drafts
                </span>
              </div>
            </TransitionGroup>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-menu-enter-active,
.demo-menu-leave-active,
.demo-tile-enter-active,
.demo-tile-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.demo-menu-move,
.demo-tile-move {
  transition: transform 0.35s ease;
}
.demo-menu-enter-from,
.demo-menu-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.demo-tile-enter-from,
.demo-tile-leave-to {
  opacity: 0;
  transform: scale(0.94);
}
.demo-menu-leave-active,
.demo-tile-leave-active {
  position: absolute;
}
.demo-view-enter-active,
.demo-view-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.demo-view-enter-from,
.demo-view-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
@media (prefers-reduced-motion: reduce) {
  .demo-menu-enter-active,
  .demo-menu-leave-active,
  .demo-tile-enter-active,
  .demo-tile-leave-active,
  .demo-menu-move,
  .demo-tile-move,
  .demo-view-enter-active,
  .demo-view-leave-active {
    transition: none;
  }
}
</style>
