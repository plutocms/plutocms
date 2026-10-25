<script setup lang="ts">
// The hero illustration: the Pluto planet with its layers in orbit. Each ring
// is a group of layers, from the closest (the building blocks) to the farthest
// (the feature layers). Charon, the big moon, has a red pole: Mordor Macula.
interface Chip {
  label: string
  icon: string
  angle: number
}

const rings: { size: number, duration: number, chips: Chip[] }[] = [
  {
    size: 50,
    duration: 70,
    chips: [
      { label: 'ui', icon: 'i-lucide-component', angle: 20 },
      { label: 'utils', icon: 'i-lucide-wrench', angle: 200 }
    ]
  },
  {
    size: 74,
    duration: 100,
    chips: [
      { label: 'supabase', icon: 'i-simple-icons-supabase', angle: 110 },
      { label: 'nuxt-content', icon: 'i-simple-icons-nuxt', angle: 300 }
    ]
  },
  {
    size: 98,
    duration: 140,
    chips: [
      { label: 'shop', icon: 'i-lucide-shopping-bag', angle: 60 },
      { label: 'blog', icon: 'i-lucide-pen-line', angle: 180 },
      { label: 'storage', icon: 'i-lucide-images', angle: 290 }
    ]
  }
]
</script>

<template>
  <div
    class="pluto-orbit relative mx-auto aspect-square w-full max-w-[32rem]"
    aria-hidden="true"
  >
    <!-- The blue haze of Pluto's atmosphere. -->
    <div class="absolute inset-[22%] rounded-full bg-haze-300/40 blur-3xl dark:bg-haze-500/25" />

    <div
      v-for="(ring, index) in rings"
      :key="index"
      class="orbit-ring absolute left-1/2 top-1/2 rounded-full border border-dashed border-haze-400/50 dark:border-haze-300/20"
      :style="{
        'width': `${ring.size}%`,
        'height': `${ring.size}%`,
        '--orbit-duration': `${ring.duration}s`
      }"
    >
      <div
        v-for="chip in ring.chips"
        :key="chip.label"
        class="absolute left-1/2 top-1/2 size-0"
        :style="{ transform: `rotate(${chip.angle}deg) translateY(calc(${ring.size / 2} * -1cqw)) rotate(${-chip.angle}deg)` }"
      >
        <div class="orbit-chip -translate-x-1/2 -translate-y-1/2 w-max">
          <span class="flex items-center gap-1.5 rounded-full bg-default/90 px-2.5 py-1 text-xs font-medium text-highlighted shadow-sm ring ring-default backdrop-blur">
            <UIcon
              :name="chip.icon"
              class="size-3.5 text-primary"
            />
            {{ chip.label }}
          </span>
        </div>
      </div>

      <!-- Charon rides on the middle ring. -->
      <div
        v-if="index === 1"
        class="absolute left-1/2 top-1/2 size-0"
        style="transform: rotate(215deg) translateY(-37cqw)"
      >
        <div class="charon -translate-x-1/2 -translate-y-1/2 size-[7cqw] rounded-full" />
      </div>
    </div>

    <div class="planet absolute inset-[32%]">
      <PlutoLogo
        mark
        class="size-full drop-shadow-xl"
      />
    </div>
  </div>
</template>

<style scoped>
.pluto-orbit {
  container-type: inline-size;
}

.orbit-ring {
  translate: -50% -50%;
  animation: orbit var(--orbit-duration) linear infinite;
}

/* The chip turns back as fast as its ring turns, so the label stays level. */
.orbit-chip {
  animation: orbit var(--orbit-duration) linear infinite reverse;
}

.charon {
  background: radial-gradient(circle at 50% 18%, #9a4a3a 0 22%, transparent 34%),
    radial-gradient(circle at 35% 35%, #c9c9cf, #8d8f99);
  box-shadow: 0 0 0 2px rgb(0 0 0 / 0.65);
}

.planet {
  animation: float 7s ease-in-out infinite;
}

@keyframes orbit {
  to {
    rotate: 360deg;
  }
}

@keyframes float {
  50% {
    transform: translateY(-3%) rotate(-2deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-ring,
  .orbit-chip,
  .planet {
    animation: none;
  }
}
</style>
