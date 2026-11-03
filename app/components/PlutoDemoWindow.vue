<script setup lang="ts">
// A window frame for the demos of the landing: a title bar with three lights, a title or an
// address, and a body. `dark` gives the terminal and code look (the kuiper palette); the default
// is a light browser. The body keeps the height of its parent, so a demo that grows inside never
// moves the page. The address is a `data-demo-target="url"`, so a demo pointer can click it, and
// `caret` shows a text cursor after it while a demo types.
withDefaults(
  defineProps<{
    /** The text in the title bar, with an optional icon. */
    title?: string
    icon?: string
    /** An address instead of a title: the bar shows a lock and the URL. */
    url?: string
    /** A blinking text cursor after the address. */
    caret?: boolean
    /** The terminal and code look. */
    dark?: boolean
  }>(),
  { title: '', icon: '', url: '', caret: false, dark: false }
)
</script>

<template>
  <div
    :class="
      dark
        ? 'bg-kuiper-950 text-kuiper-200 ring-kuiper-800 shadow-black/30'
        : 'bg-default ring-default shadow-kuiper-950/10 dark:shadow-black/40'
    "
    class="relative flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-2xl ring"
  >
    <div
      :class="
        dark
          ? 'border-kuiper-800/80 bg-kuiper-900/40'
          : 'border-default bg-elevated/60'
      "
      class="flex h-11 shrink-0 items-center gap-3 border-b px-4"
    >
      <div class="flex shrink-0 gap-1.5" aria-hidden="true">
        <span class="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <span class="size-2.5 rounded-full bg-[#febc2e]/80" />
        <span class="size-2.5 rounded-full bg-[#28c840]/80" />
      </div>
      <slot name="bar">
        <div
          v-if="url"
          :class="
            dark
              ? 'bg-kuiper-950 text-kuiper-400 ring-kuiper-800'
              : 'bg-default text-muted ring-default'
          "
          class="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-3 py-1 text-xs ring"
        >
          <UIcon name="i-lucide-lock" class="size-3 shrink-0" />
          <span data-demo-target="url" class="truncate">{{ url }}</span>
          <span
            v-if="caret"
            class="demo-caret bg-(--ui-text-highlighted) -ml-1 inline-block h-3.5 w-px shrink-0 align-middle"
          />
        </div>
        <span
          v-else
          :class="dark ? 'text-kuiper-400' : 'text-muted'"
          class="flex min-w-0 items-center gap-1.5 font-mono text-xs"
        >
          <UIcon v-if="icon" :name="icon" class="size-3.5 shrink-0" />
          <span class="truncate">{{ title }}</span>
        </span>
      </slot>
      <div v-if="$slots.end" class="ms-auto flex shrink-0 items-center">
        <slot name="end" />
      </div>
    </div>
    <div class="relative min-h-0 flex-1">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.demo-caret {
  animation: demo-caret 1s steps(2) infinite;
}
@keyframes demo-caret {
  50% {
    opacity: 0;
  }
}
</style>
