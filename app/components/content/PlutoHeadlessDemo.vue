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
// in, line by line, while the demo is on screen. The answer window has the height of the whole
// answer, so the page never moves while it streams.
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
type Token = { kind: 'key' | 'string' | 'number' | 'plain'; text: string }
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
  key: 'text-(--demo-key)',
  string: 'text-(--demo-string)',
  number: 'text-(--demo-number)',
  plain: 'text-(--demo-punct)'
}

/**
 * The request as colored tokens: a keyword, a call, a string (a quoted one, or a bare URL in the
 * shell), a number, and the rest. The three snippets are fixed, so a small tokenizer is enough.
 */
type CodeToken = {
  kind: 'storage' | 'keyword' | 'call' | 'string' | 'number' | 'plain'
  text: string
}
/** `const` and friends are storage words; `await` and friends are control words. */
const STORAGE = new Set(['const', 'let', 'export', 'import', 'default'])
const KEYWORDS = new Set(['await', 'async', 'from', 'return'])
function wordKind(word: string, call: boolean): CodeToken['kind'] {
  if (STORAGE.has(word)) {
    return 'storage'
  }
  if (KEYWORDS.has(word)) {
    return 'keyword'
  }
  // A shell command (curl) reads like a call.
  return call || word === 'curl' ? 'call' : 'plain'
}
function tokenizeCode(line: string): CodeToken[] {
  const tokens: CodeToken[] = []
  const pattern = /('(?:[^'\\]|\\.)*')|(https?:\/\/\S+)|(\d+)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g
  let last = 0
  for (const match of line.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > last) {
      tokens.push({ kind: 'plain', text: line.slice(last, index) })
    }
    if (match[1] || match[2]) {
      tokens.push({ kind: 'string', text: match[0] })
    } else if (match[3]) {
      tokens.push({ kind: 'number', text: match[0] })
    } else if (match[4]) {
      tokens.push({ kind: wordKind(match[4], true), text: match[0] })
    } else {
      // A shell command (curl) reads like a call.
      tokens.push({
        kind: wordKind(match[5]!, false),
        text: match[0]
      })
    }
    last = index + match[0].length
  }
  if (last < line.length) {
    tokens.push({ kind: 'plain', text: line.slice(last) })
  }
  return tokens
}
const CODE_CLASS: Record<CodeToken['kind'], string> = {
  storage: 'text-(--demo-storage)',
  keyword: 'text-(--demo-keyword)',
  call: 'text-(--demo-fn)',
  string: 'text-(--demo-string)',
  number: 'text-(--demo-number)',
  plain: 'text-(--demo-fg)'
}
const request = computed(() => current.value.code.split('\n').map(tokenizeCode))

const root = ref<HTMLElement | null>(null)
// One step to send, one for each line of the answer, then a pause.
const { step, reduced } = useDemoTimeline(root, [
  900,
  ...answer.slice(1).map(() => 110),
  3500
])
const shown = computed(() =>
  reduced.value ? answer.length : Math.min(step.value + 1, answer.length)
)
const sending = computed(() => !reduced.value && step.value === 0)
const done = computed(() => shown.value >= answer.length)
</script>

<template>
  <div ref="root" class="flex flex-col gap-6">
    <PlutoDemoStage>
      <div class="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div class="flex flex-col gap-4">
          <PlutoDemoWindow dark>
            <template #bar>
              <div class="flex min-w-0 gap-1" role="tablist">
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
                  class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                  @click="tab = item.value"
                >
                  <UIcon :name="item.icon" class="size-3.5" />
                  {{ item.label }}
                </button>
              </div>
            </template>
            <!-- A long URL wraps on a phone, so the window never scrolls sideways. -->
            <pre
              class="text-(--demo-fg) p-4 font-mono text-[13px]/6 wrap-anywhere whitespace-pre-wrap"
            ><span v-for="(line, index) in request" :key="index" class="block"><span
                  v-for="(part, partIndex) in line"
                  :key="partIndex"
                  :class="CODE_CLASS[part.kind]"
                >{{ part.text }}</span></span></pre>
          </PlutoDemoWindow>

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

        <!-- The request goes from the left window to the right one. -->
        <div
          class="text-dimmed hidden flex-col items-center lg:flex"
          aria-hidden="true"
        >
          <span class="via-kuiper-500/60 h-12 w-px bg-linear-to-b from-transparent to-transparent" />
          <span
            :class="sending ? 'demo-ping ring-primary/40' : 'ring-default'"
            class="bg-default text-primary flex size-9 items-center justify-center rounded-full shadow-md ring"
          >
            <UIcon
              :name="done ? 'i-lucide-check' : 'i-lucide-arrow-right'"
              class="size-4"
            />
          </span>
          <span class="via-kuiper-500/60 h-12 w-px bg-linear-to-b from-transparent to-transparent" />
        </div>

        <PlutoDemoWindow dark class="h-122">
          <template #bar>
            <span class="flex items-center gap-2 font-mono text-xs">
              <Transition name="demo-fade" mode="out-in">
                <span v-if="sending" key="sending" class="text-kuiper-400 flex items-center gap-2">
                  <span class="size-2 animate-pulse rounded-full bg-amber-400" />
                  Sending…
                </span>
                <span v-else key="ok" class="text-kuiper-300 flex items-center gap-2">
                  <span class="size-2 rounded-full bg-emerald-400" />
                  <span class="text-emerald-400">200 OK</span>
                  <span class="text-kuiper-500">·</span>
                  application/json
                </span>
              </Transition>
            </span>
          </template>
          <template #end>
            <Transition name="demo-fade">
              <span v-if="done" class="text-kuiper-500 font-mono text-xs">38 ms</span>
            </Transition>
          </template>
          <pre
            class="text-(--demo-fg) h-full overflow-hidden p-4 font-mono text-[13px]/6"
            aria-label="The JSON answer of the public API"
          ><span
              v-for="(line, index) in colored.slice(0, shown)"
              :key="index"
              class="demo-json block"
            ><span
                v-for="(token, tokenIndex) in line"
                :key="tokenIndex"
                :class="TOKEN_CLASS[token.kind]"
              >{{ token.text }}</span></span><span
              v-if="!done && !reduced"
              class="bg-kuiper-400 ms-px inline-block h-4 w-2 animate-pulse align-middle"
            /></pre>
        </PlutoDemoWindow>
      </div>
    </PlutoDemoStage>
  </div>
</template>

<style scoped>
.demo-json {
  animation: demo-json 0.25s ease-out both;
}
.demo-ping {
  animation: demo-ping 1s ease-out infinite;
}
.demo-fade-enter-active,
.demo-fade-leave-active {
  transition: opacity 0.3s ease;
}
.demo-fade-enter-from,
.demo-fade-leave-to {
  opacity: 0;
}
@keyframes demo-json {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
}
@keyframes demo-ping {
  from {
    box-shadow: 0 0 0 0 color-mix(in oklab, var(--ui-primary) 45%, transparent);
  }
  to {
    box-shadow: 0 0 0 14px transparent;
  }
}
@media (prefers-reduced-motion: reduce) {
  .demo-json,
  .demo-ping {
    animation: none;
  }
}
</style>
