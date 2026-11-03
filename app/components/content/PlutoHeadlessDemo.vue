<script setup lang="ts">
definePlutoBlock({
  label: 'Headless demo',
  icon: 'i-lucide-plug',
  group: 'landing',
  description:
    'A request to the public API in three stacks, and its JSON answer.',
  insert: '::pluto-headless-demo\n::'
})

// The headless demo of the landing: a request in three stacks, and the JSON answer that streams
// in, line by line, while the demo is on screen.
const tabs = [
  {
    value: 'fetch',
    label: 'Any stack',
    icon: 'i-lucide-globe',
    code: `const res = await fetch(
  'https://your-site.dev/api/pluto/v1/content/product?limit=2'
)
const { data } = await res.json()`
  },
  {
    value: 'nuxt',
    label: 'Nuxt',
    icon: 'i-simple-icons-nuxtdotjs',
    code: `const { data } = await usePlutoPublicList('product', {
  limit: 2
})`
  },
  {
    value: 'curl',
    label: 'curl',
    icon: 'i-lucide-terminal',
    code: `curl https://your-site.dev/api/pluto/v1/content/product?limit=2`
  }
]

const answer = `{
  "data": [
    {
      "slug": "moon-mug",
      "name": "Moon mug",
      "price": 4990,
      "category": { "slug": "home", "label": "Home" },
      "media": [{ "url": "/media/moon-mug.webp" }]
    },
    {
      "slug": "orbit-lamp",
      "name": "Orbit lamp",
      "price": 14900,
      "media": [{ "url": "/media/orbit-lamp.webp" }]
    }
  ],
  "meta": { "total": 24, "limit": 2, "offset": 0 }
}`.split('\n')

const tab = ref('fetch')
const current = computed(() => tabs.find((item) => item.value === tab.value)!)

/**
 * A line of JSON as colored tokens: a key, a string, a number, and the rest (punctuation). The
 * answer is a fixed text, so a small tokenizer is enough.
 */
type Token = { kind: 'key' | 'string' | 'number' | 'plain', text: string }
function tokenize(line: string): Token[] {
  const tokens: Token[] = []
  const pattern = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)/g
  let last = 0
  for (const match of line.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > last) {
      tokens.push({ kind: 'plain', text: line.slice(last, index) })
    }
    if (match[1]) {
      tokens.push({ kind: match[2] ? 'key' : 'string', text: match[1] })
      if (match[2]) {
        tokens.push({ kind: 'plain', text: match[2] })
      }
    } else {
      tokens.push({ kind: 'number', text: match[3]! })
    }
    last = index + match[0].length
  }
  if (last < line.length) {
    tokens.push({ kind: 'plain', text: line.slice(last) })
  }
  return tokens
}
const colored = answer.map(tokenize)
const TOKEN_CLASS: Record<Token['kind'], string> = {
  key: 'text-haze-300',
  string: 'text-heart-200',
  number: 'text-tholin-300',
  plain: 'text-kuiper-400'
}

/** The same colors for the request: the strings only. */
const request = computed(() =>
  current.value.code.split('\n').map((line) => {
    const parts = line.split(/('[^']*')/)
    return parts.map((text, index) => ({
      text,
      string: index % 2 === 1
    }))
  })
)

const root = ref<HTMLElement | null>(null)
// One step for each line of the answer, then a pause.
const { step, reduced } = useDemoTimeline(root, [
  900,
  ...answer.slice(1).map(() => 110),
  3500
])
const shown = computed(() =>
  reduced.value ? answer.length : Math.min(step.value + 1, answer.length)
)
</script>

<template>
  <div ref="root" class="grid gap-4 lg:grid-cols-2 lg:items-start">
    <div class="flex flex-col gap-4">
    <div
      class="bg-kuiper-950 ring-kuiper-800 flex flex-col overflow-hidden rounded-xl ring"
    >
      <div class="border-kuiper-800 flex gap-1 border-b p-1.5" role="tablist">
        <button
          v-for="item in tabs"
          :key="item.value"
          :aria-selected="tab === item.value"
          :class="
            tab === item.value
              ? 'bg-kuiper-800 text-kuiper-50'
              : 'text-kuiper-400 hover:text-kuiper-200'
          "
          role="tab"
          type="button"
          class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          @click="tab = item.value"
        >
          <UIcon :name="item.icon" class="size-3.5" />
          {{ item.label }}
        </button>
      </div>
      <!-- A long URL wraps on a phone, so the card never scrolls sideways. -->
      <pre
        class="text-kuiper-200 p-4 font-mono text-[13px]/6 wrap-anywhere whitespace-pre-wrap"
      ><span v-for="(line, index) in request" :key="index" class="block"><span
            v-for="(part, partIndex) in line"
            :key="partIndex"
            :class="part.string ? 'text-heart-200' : ''"
          >{{ part.text }}</span></span></pre>
    </div>

      <!-- What the API gives, in three lines. -->
      <ul class="text-muted flex flex-col gap-2 text-sm">
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-eye" class="text-primary mt-0.5 size-4 shrink-0" />
          Published content only. Drafts never leave the admin.
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-braces" class="text-primary mt-0.5 size-4 shrink-0" />
          The same JSON for every content type: a list with a total, or one item.
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-book-open" class="text-primary mt-0.5 size-4 shrink-0" />
          <span>
            <ULink to="/docs/build/public-api" class="text-primary">
              Read the public API reference
            </ULink>
            for the filters, the sort and the search.
          </span>
        </li>
      </ul>
    </div>

    <div
      class="bg-kuiper-950 ring-kuiper-800 overflow-hidden rounded-xl ring"
      aria-label="The JSON answer of the public API"
    >
      <div
        class="border-kuiper-800 text-kuiper-400 flex items-center gap-2 border-b px-4 py-2.5 text-xs"
      >
        <span class="size-2 rounded-full bg-emerald-400" />
        200 OK · application/json
      </div>
      <pre
        class="text-kuiper-200 min-h-96 overflow-x-auto p-4 font-mono text-[13px]/6"
      ><span
          v-for="(line, index) in colored.slice(0, shown)"
          :key="index"
          class="demo-json block"
        ><span
            v-for="(token, tokenIndex) in line"
            :key="tokenIndex"
            :class="TOKEN_CLASS[token.kind]"
          >{{ token.text }}</span></span><span
          v-if="shown < answer.length && !reduced"
          class="bg-kuiper-400 ms-px inline-block h-4 w-2 animate-pulse align-middle"
        /></pre>
    </div>
  </div>
</template>

<style scoped>
.demo-json {
  animation: demo-json 0.25s ease-out both;
}
@keyframes demo-json {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .demo-json {
    animation: none;
  }
}
</style>
