<script setup lang="ts">
definePlutoBlock({
  label: 'Color palette',
  icon: 'i-lucide-palette',
  group: 'site',
  description: 'The color scales of Pluto. Used on the brand page.',
  insert: '::pluto-palette\n::'
})

// The color scales of the Pluto palette, for the brand page.
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const scales = [
  { name: 'tholin', role: 'Primary. Buttons, links, highlights.' },
  { name: 'haze', role: 'Secondary. Accents, rings, info.' },
  { name: 'heart', role: 'The planet and its heart. Soft surfaces.' },
  { name: 'kuiper', role: 'Neutral. Text, borders, dark mode.' }
]
</script>

<template>
  <div class="my-6 flex flex-col gap-5">
    <div
      v-for="scale in scales"
      :key="scale.name"
      class="flex flex-col gap-2"
    >
      <p class="text-sm">
        <code class="font-semibold text-highlighted">{{ scale.name }}</code>
        <span class="text-muted"> · {{ scale.role }}</span>
      </p>
      <div class="grid grid-cols-11 gap-1">
        <div
          v-for="shade in shades"
          :key="shade"
          class="flex flex-col gap-1"
        >
          <div
            class="h-10 rounded-md ring ring-inset ring-black/5 dark:ring-white/10"
            :style="{ backgroundColor: `var(--color-${scale.name}-${shade})` }"
          />
          <span class="text-center text-[10px] text-dimmed">{{ shade }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
