<script setup lang="ts">
import type { DemoCursorKind } from '~/composables/demo-cursor'

// The fake mouse pointer of a demo (useDemoCursor). It sits over a `relative` container, moves
// with a transition, and shows a ring when it presses. `text` is the I-beam over a text field.
defineProps<{
  x: number
  y: number
  visible: boolean
  pressed: boolean
  kind: DemoCursorKind
}>()
</script>

<template>
  <div
    :class="visible ? 'opacity-100' : 'opacity-0'"
    :style="{ transform: `translate(${x}px, ${y}px)` }"
    class="demo-cursor pointer-events-none absolute top-0 left-0 z-20"
    aria-hidden="true"
  >
    <span
      v-if="pressed"
      class="demo-cursor-ring border-primary absolute -top-3 -left-3 size-6 rounded-full border-2"
    />
    <svg
      v-if="kind === 'pointer'"
      :class="pressed ? 'scale-90' : ''"
      class="-mt-0.5 -ml-1 size-5 drop-shadow-md transition-transform duration-150"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 3l14 8.5-6.3 1.6L9.4 19z"
        fill="#fff"
        stroke="#0f1322"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </svg>
    <span
      v-else
      class="demo-cursor-beam block h-4 w-0.5 -translate-y-1/2 bg-(--ui-text-highlighted)"
    />
  </div>
</template>

<style scoped>
.demo-cursor {
  transition:
    transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.3s ease;
}
.demo-cursor-ring {
  animation: demo-cursor-ring 0.4s ease-out both;
}
.demo-cursor-beam {
  animation: demo-caret 1s steps(2) infinite;
}
@keyframes demo-cursor-ring {
  from {
    transform: scale(0.4);
    opacity: 0.9;
  }
  to {
    transform: scale(1.6);
    opacity: 0;
  }
}
@keyframes demo-caret {
  50% {
    opacity: 0;
  }
}
</style>
