<script setup lang="ts">
// The stage of a demo of the landing: a rounded panel with a soft glow of the brand colors and a
// faint dot grid, so the windows of the demo sit on something rather than on the bare page.
</script>

<template>
  <div
    class="demo-stage border-default/70 relative isolate overflow-hidden rounded-3xl border p-4 sm:p-6 lg:p-8"
  >
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <div class="demo-stage-glow absolute inset-0" />
      <div class="demo-stage-grid absolute inset-0" />
    </div>
    <slot />
  </div>
</template>

<style scoped>
.demo-stage {
  background-color: color-mix(in oklab, var(--ui-bg-elevated) 45%, transparent);
}
.demo-stage-glow {
  background:
    radial-gradient(
      48rem 24rem at 15% 0%,
      color-mix(in oklab, var(--ui-primary) 14%, transparent),
      transparent 70%
    ),
    radial-gradient(
      40rem 22rem at 100% 100%,
      color-mix(in oklab, var(--color-haze-400) 16%, transparent),
      transparent 70%
    );
}
.demo-stage-grid {
  background-image: radial-gradient(
    var(--ui-border-accented) 1px,
    transparent 1.5px
  );
  background-size: 22px 22px;
  mask-image: radial-gradient(60% 60% at 50% 40%, #000 20%, transparent 100%);
  opacity: 0.7;
}
</style>
