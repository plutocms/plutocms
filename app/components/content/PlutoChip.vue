<script setup lang="ts">
definePlutoBlock<{ icon?: string, center?: boolean }>({
  label: 'Chip',
  icon: 'i-lucide-tag',
  group: 'landing',
  description: 'A short label above a section title.',
  props: {
    center: { label: 'Center the label' }
  },
  slots: { default: { label: 'Text', content: 'inline' } },
  insert: '::pluto-chip{icon="i-lucide-heart"}\nA short label\n::'
})

// A small rounded label above a title: `::pluto-chip{icon="i-lucide-heart"}`.
withDefaults(defineProps<{
  /** The icon before the text, such as `i-lucide-heart`. */
  icon?: string
  /** Put the label in the middle of the line. */
  center?: boolean
}>(), {
  icon: undefined,
  center: false
})
</script>

<template>
  <div
    class="flex"
    :class="{ 'justify-center': center }"
  >
    <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring ring-primary/25">
      <UIcon
        v-if="icon"
        :name="icon"
        class="size-4"
      />
      <slot mdc-unwrap="p" />
    </span>
  </div>
</template>
