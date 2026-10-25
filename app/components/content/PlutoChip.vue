<script setup lang="ts">
// A small rounded label above a title: `::pluto-chip{icon="i-lucide-heart"}`.
withDefaults(defineProps<{
  icon?: string
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
