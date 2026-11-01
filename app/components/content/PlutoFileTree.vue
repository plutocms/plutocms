<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'

definePlutoBlock<{ tree: string }>({
  label: 'File tree',
  icon: 'i-lucide-folder-tree',
  group: 'site',
  description: 'The folders and files of a project, with an icon for each type and a note.',
  props: {
    tree: { label: 'Tree', type: 'text' }
  },
  insert: '::pluto-file-tree\n---\ntree: |\n  app/\n    app.vue  # The root component\n  nuxt.config.ts\n---\n::'
})

// A folder tree on `UTree`. The author writes one path for each line, with two spaces of indent
// for each level. A folder ends with `/`. Text after `#` is a note:
//
//   app/
//     pages/  # The public pages
//       index.vue
//   nuxt.config.ts
const props = defineProps<{
  /** One path for each line. Two spaces of indent for each level. A folder ends with `/`. Text after `#` is a note. */
  tree: string
}>()

interface FileTreeItem extends TreeItem {
  value: string
  note?: string
  folder: boolean
  children?: FileTreeItem[]
}

const items = computed(() => parseTree(props.tree ?? ''))

function parseTree(source: string): FileTreeItem[] {
  const root: FileTreeItem[] = []
  // The open parent at each depth.
  const parents: FileTreeItem[] = []
  for (const line of source.split('\n')) {
    if (!line.trim()) {
      continue
    }
    const depth = Math.floor((line.length - line.trimStart().length) / 2)
    const [path = '', ...note] = line.trim().split(/\s+#\s*/)
    const folder = path.endsWith('/')
    const parent = parents[depth - 1]
    const item: FileTreeItem = {
      label: folder ? path.slice(0, -1) : path,
      value: `${parent?.value ?? ''}/${path}`,
      note: note.join(' # ') || undefined,
      folder,
      defaultExpanded: folder
    }
    const siblings = parent ? (parent.children ??= []) : root
    siblings.push(item)
    parents[depth] = item
    parents.length = depth + 1
  }
  return root
}

const FOLDER_ICONS: Record<string, string> = {
  'app': 'folder-type-app',
  'assets': 'folder-type-asset',
  'components': 'folder-type-component',
  'css': 'folder-type-css',
  'docs': 'folder-type-docs',
  '.github': 'folder-type-github',
  'i18n': 'folder-type-locale',
  'locales': 'folder-type-locale',
  'migrations': 'folder-type-db',
  'packages': 'folder-type-package',
  'pages': 'folder-type-view',
  'plugins': 'folder-type-plugin',
  'public': 'folder-type-public',
  'scripts': 'folder-type-script',
  'server': 'folder-type-server',
  'test': 'folder-type-test'
}

const FILE_ICONS: Record<string, string> = {
  'nuxt.config.ts': 'file-type-nuxt',
  'package.json': 'file-type-npm',
  'tsconfig.json': 'file-type-tsconfig',
  '.gitignore': 'file-type-git',
  '.env': 'file-type-dotenv',
  'favicon.ico': 'file-type-favicon',
  'robots.txt': 'file-type-robots'
}

const EXTENSION_ICONS: Record<string, string> = {
  vue: 'file-type-vue',
  ts: 'file-type-typescript',
  js: 'file-type-js',
  mjs: 'file-type-js',
  css: 'file-type-css',
  md: 'file-type-markdown',
  json: 'file-type-json',
  yml: 'file-type-yaml',
  yaml: 'file-type-yaml',
  sql: 'file-type-sql',
  sh: 'file-type-shell',
  svg: 'file-type-svg',
  png: 'file-type-image',
  jpg: 'file-type-image',
  webp: 'file-type-image',
  txt: 'file-type-text'
}

/** The icon of an item. A path such as `layouts/default.vue` takes the icon of its last part. */
function iconOf(item: FileTreeItem, expanded: boolean): string {
  const name = item.label?.split('/').pop() ?? ''
  if (item.folder) {
    const icon = FOLDER_ICONS[name] ?? 'default-folder'
    return `i-vscode-icons-${icon}${expanded ? '-opened' : ''}`
  }
  const icon = FILE_ICONS[name] ?? EXTENSION_ICONS[name.split('.').pop() ?? ''] ?? 'default-file'
  return `i-vscode-icons-${icon}`
}
</script>

<template>
  <div class="my-5 rounded-md border border-muted bg-muted/40 p-2">
    <UTree
      :items="items"
      :get-key="(item) => item.value"
      color="neutral"
      size="sm"
      :ui="{ link: 'gap-2', linkLabel: 'flex min-w-0 flex-wrap items-baseline gap-x-3' }"
    >
      <template #item-leading="{ item, expanded }">
        <UIcon
          :name="iconOf(item, expanded)"
          class="size-4 shrink-0"
        />
      </template>
      <template #item-label="{ item }">
        <span class="font-mono text-default">{{ item.label }}</span>
        <span
          v-if="item.note"
          class="text-xs text-muted"
        >{{ item.note }}</span>
      </template>
    </UTree>
  </div>
</template>
