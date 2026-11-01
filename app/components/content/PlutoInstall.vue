<script setup lang="ts">
definePlutoBlock<{ name: string }>({
  label: 'Install command',
  icon: 'i-lucide-package',
  group: 'site',
  description: 'The install command of an npm package, with one tab for each package manager.',
  props: {
    name: { label: 'Package' }
  },
  insert: ':pluto-install{name="@plutocms/core"}'
})

// `:pluto-install{name="@plutocms/supabase-blog"}`. The tabs have the same order as the other
// code groups of the site (npm, pnpm, yarn, bun, deno), and the same `sync` key, so the
// package manager that a reader selects stays selected on every page.
const props = defineProps<{
  /** The npm package, such as `@plutocms/supabase-blog`. */
  name: string
}>()

const commands = computed(() => [
  { label: 'npm', command: `npm install ${props.name}` },
  { label: 'pnpm', command: `pnpm add ${props.name}` },
  { label: 'yarn', command: `yarn add ${props.name}` },
  { label: 'bun', command: `bun add ${props.name}` },
  { label: 'deno', command: `deno add npm:${props.name}` }
])
</script>

<template>
  <ProseCodeGroup sync="package-manager">
    <ProsePre
      v-for="item in commands"
      :key="item.label"
      :filename="item.label"
      :code="item.command"
      language="bash"
    >
      <code>{{ item.command }}</code>
    </ProsePre>
  </ProseCodeGroup>
</template>
