<script setup lang="ts">
// A short fact about Pluto under the table of contents. The page path picks
// the fact, so the server and the client show the same one.
const props = defineProps<{
  seed: string
}>()

const facts = [
  'A day on Pluto is about 153 hours long.',
  'One year on Pluto is 248 Earth years.',
  'Sunlight takes about 5.5 hours to reach Pluto.',
  'Pluto is smaller than our Moon.',
  'Pluto has five moons. The biggest is Charon.',
  'Charon has a red pole. Its name is Mordor Macula.',
  'An 11-year-old girl, Venetia Burney, named Pluto in 1930.',
  'Clyde Tombaugh found Pluto in 1930. Some of his ashes flew past it on New Horizons.',
  'The left half of the heart of Pluto, Sputnik Planitia, is a plain of nitrogen ice.',
  'The air of Pluto has more than 20 layers of haze.',
  'The haze of Pluto is blue, like the sky of Earth.',
  'The red-brown color of Pluto comes from tholins.'
]

const fact = computed(() => {
  let hash = 0
  for (const char of props.seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return facts[hash % facts.length]
})
</script>

<template>
  <div class="bg-elevated/60 ring-default flex gap-3 rounded-lg p-3 ring">
    <PlutoLogo mark class="size-7 shrink-0" />
    <p class="text-muted text-xs/5">
      <span class="text-highlighted font-semibold">Pluto fact.</span>
      {{ fact }}
    </p>
  </div>
</template>
