<script setup lang="ts">
definePlutoBlock({
  label: 'Setup demo',
  icon: 'i-lucide-terminal',
  group: 'landing',
  description:
    'A terminal runs create-pluto, and a browser shows the blog, then the admin. It plays while it is on screen.',
  insert: '::pluto-setup-demo\n::'
})

// The setup demo of the landing: a terminal runs `create-pluto` with the real questions and
// messages of the CLI (the Git CMS backend and the blog template), and a browser next to it shows
// the blog. Then a pointer clicks the address bar, types `/admin`, and clicks Posts in the admin.
// It loops while it is on screen (see useDemoTimeline). Both windows have a fixed height, and the
// terminal scrolls like a real one, so the page never moves.
const root = ref<HTMLElement | null>(null)

// 0 type the command · 1-4 the questions · 5 download · 6 install · 7 the Git repo and the next
// steps · 8 the dev server · 9 the blog · 10 the address bar gets `/admin` · 11 the admin.
const { step, reduced } = useDemoTimeline(
  root,
  [1700, 900, 900, 900, 900, 1100, 1400, 1800, 1300, 3000, 1600, 5600]
)

// The command types itself at step 0, in the browser only. The server renders it whole.
const command = 'npm create pluto@latest my-blog'
const typed = ref(command)
let typing: ReturnType<typeof setInterval> | undefined
function type(value: number) {
  if (typing) {
    clearInterval(typing)
  }
  if (value !== 0 || reduced.value) {
    typed.value = command
    return
  }
  typed.value = ''
  typing = setInterval(() => {
    typed.value = command.slice(0, typed.value.length + 1)
    if (typed.value.length >= command.length && typing) {
      clearInterval(typing)
    }
  }, 38)
}

// The address bar: `/admin` types itself at step 10.
const path = ref('')
let typingPath: ReturnType<typeof setInterval> | undefined
function typePath(value: number) {
  if (typingPath) {
    clearInterval(typingPath)
  }
  if (value < 10) {
    path.value = ''
    return
  }
  if (value > 10 || reduced.value) {
    path.value = '/admin'
    return
  }
  path.value = '/'
  typingPath = setInterval(() => {
    path.value = '/admin'.slice(0, path.value.length + 1)
    if (path.value.length >= 6 && typingPath) {
      clearInterval(typingPath)
    }
  }, 110)
}
const url = computed(() => `localhost:3000${path.value}`)

// The pointer over the browser: it clicks the address bar at the end of the blog step, and Posts
// in the sidebar of the admin.
const browser = ref<HTMLElement | null>(null)
const pointer = useDemoCursor(browser)
const adminPage = ref<'home' | 'posts'>('home')
function plan(value: number) {
  pointer.clear()
  if (value === 9) {
    pointer.click('url', { delay: 1900, at: 'end' })
  } else if (value === 10) {
    pointer.hide(200)
  } else if (value === 11) {
    pointer.click('menu-posts', {
      delay: 1600,
      onPress: () => {
        adminPage.value = 'posts'
      }
    })
    pointer.hide(3600)
  } else {
    pointer.hide()
    adminPage.value = 'home'
  }
}

// The terminal keeps its height and shows its last lines, like a real one.
const terminal = ref<HTMLElement | null>(null)
async function follow() {
  await nextTick()
  if (terminal.value) {
    terminal.value.scrollTop = terminal.value.scrollHeight
  }
}
onMounted(() => {
  watch(step, (value) => {
    type(value)
    typePath(value)
    plan(value)
    follow()
  })
  typePath(step.value)
  follow()
})
onBeforeUnmount(() => {
  if (typing) {
    clearInterval(typing)
  }
  if (typingPath) {
    clearInterval(typingPath)
  }
})

// The questions of create-pluto, in its order, with the answers of the demo.
const questions = [
  { label: 'Website title:', answer: 'My Blog' },
  { label: 'Pick a backend.', answer: 'Git CMS (Markdown files in Git)' },
  {
    label: 'Select a template to use. You can add more layers as needed.',
    answer: 'Blog'
  },
  { label: 'Which package manager do you want to use?', answer: 'bun' }
]

const posts = [
  {
    title: 'Hello from the edge of the solar system',
    date: 'Nov 2',
    tone: 'from-tholin-200 to-heart-100'
  },
  { title: 'Five moons and a heart', date: 'Oct 28', tone: 'from-haze-200 to-haze-50' },
  { title: 'Why small is a feature', date: 'Oct 21', tone: 'from-kuiper-200 to-heart-50' }
]

const menu = [
  { key: 'home', label: 'Home', icon: 'i-lucide-house' },
  { key: 'posts', label: 'Posts', icon: 'i-lucide-file-text', group: true },
  { key: 'media', label: 'Media', icon: 'i-lucide-images' },
  { key: 'users', label: 'Users', icon: 'i-lucide-users' },
  { key: 'settings', label: 'Settings', icon: 'i-lucide-settings', group: true }
]

const tiles = [
  {
    key: 'posts',
    label: 'Posts',
    icon: 'i-lucide-file-text',
    count: 3,
    note: '3 new this week',
    published: 3,
    drafts: 0
  }
]

const rows = posts.map((post) => ({
  title: post.title,
  status: 'published' as const,
  date: post.date
}))

// The stages of the loop, under the demo. `from` is the first step of a stage.
const stages = [
  { label: 'One command', icon: 'i-lucide-terminal', from: 0 },
  { label: 'Four questions', icon: 'i-lucide-message-circle-question-mark', from: 1 },
  { label: 'Installed', icon: 'i-lucide-package-check', from: 5 },
  { label: 'Your site', icon: 'i-lucide-globe', from: 9 },
  { label: 'Your admin', icon: 'i-lucide-layout-dashboard', from: 10 }
]
const stage = computed(() => {
  let current = 0
  stages.forEach((item, index) => {
    if (step.value >= item.from) {
      current = index
    }
  })
  return current
})
</script>

<template>
  <div ref="root" class="flex flex-col gap-6">
    <PlutoDemoStage>
      <div
        class="grid gap-5 lg:grid-cols-2"
        aria-label="A terminal creates a Pluto blog project, then a browser shows the blog and its admin."
        role="img"
      >
        <!-- The terminal -->
        <PlutoDemoWindow dark title="Terminal" icon="i-lucide-terminal" class="h-80">
          <div
            ref="terminal"
            class="text-kuiper-300 absolute inset-0 overflow-hidden p-4 font-mono text-xs/5"
          >
            <p>
              <span class="text-tholin-400 me-2">❯</span><span class="text-kuiper-50">{{ typed }}</span><span
                v-if="step === 0 && !reduced"
                class="bg-kuiper-300 ms-px inline-block h-3.5 w-1.5 animate-pulse align-middle"
              />
            </p>

            <!-- The questions, as @clack/prompts prints the ones that are done. -->
            <template v-for="(question, index) in questions" :key="question.label">
              <template v-if="step > index">
                <p class="demo-line">
                  <span class="text-emerald-400 me-2">◇</span>{{ question.label }}
                </p>
                <p class="demo-line">
                  <span class="text-kuiper-600 me-2">│</span><span class="text-heart-200">{{ question.answer }}</span>
                </p>
              </template>
            </template>

            <!-- The two spinners. -->
            <p v-if="step > 4" class="demo-line flex items-center">
              <UIcon
                v-if="step < 6"
                name="i-lucide-loader-circle"
                class="text-haze-300 me-2 size-3 animate-spin"
              />
              <span v-else class="text-emerald-400 me-2">◇</span>
              <span v-if="step < 6">Downloading Pluto template...</span>
              <span v-else>
                Template downloaded from
                <span class="text-emerald-400">gh:plutocms/pluto-blog-template</span>
              </span>
            </p>
            <p v-if="step > 5" class="demo-line flex items-center">
              <UIcon
                v-if="step < 7"
                name="i-lucide-loader-circle"
                class="text-haze-300 me-2 size-3 animate-spin"
              />
              <span v-else class="text-emerald-400 me-2">◇</span>
              {{ step < 7 ? 'Installing dependencies with bun...' : 'Dependencies installed.' }}
            </p>

            <!-- The Git repo, the next steps and the outro. -->
            <template v-if="step > 6">
              <p class="demo-line">
                <span class="text-haze-400 me-2">●</span>Created a Git repository. In development, each
                save in the admin is a commit in it.
              </p>
              <p class="demo-line mt-1">
                <span class="text-emerald-400 me-2">◇</span><span class="text-kuiper-100">Next steps</span>
                <span class="text-kuiper-700">──────────────────</span>
              </p>
              <p class="demo-line">
                <span class="text-kuiper-600 me-2">│</span><span class="text-haze-300">cd my-blog</span>
              </p>
              <p class="demo-line">
                <span class="text-kuiper-600 me-2">│</span><span class="text-haze-300">bun run dev</span>
              </p>
              <p class="demo-line">
                <span class="text-kuiper-600 me-2">│</span><span class="text-kuiper-500">Then open /admin on the dev server.</span>
              </p>
              <p class="demo-line">
                <span class="text-kuiper-600 me-2">└</span>Docs:
                <span class="text-haze-300 underline">pluto.vulmix.dev/docs/start-here/quickstart</span>
              </p>
            </template>

            <!-- The dev server. -->
            <template v-if="step > 7">
              <p class="demo-line mt-3">
                <span class="text-tholin-400 me-2">❯</span><span class="text-kuiper-50">cd my-blog && bun run dev</span>
              </p>
              <p class="demo-line">
                <span class="text-emerald-400 me-2">➜</span>Local:
                <span class="text-haze-300 underline">http://localhost:3000/</span>
              </p>
              <p class="demo-line">
                <span class="text-emerald-400 me-2">➜</span>Admin:
                <span class="text-haze-300 underline">http://localhost:3000/admin</span>
              </p>
            </template>
          </div>
        </PlutoDemoWindow>

        <!-- The browser, with the pointer over it -->
        <div ref="browser" class="relative">
          <PlutoDemoWindow :url="url" :caret="step === 10 && !reduced" class="h-80">
            <template #end>
              <Transition name="demo-fade">
                <span
                  v-if="step >= 9"
                  class="flex items-center gap-1.5 text-xs font-medium text-emerald-500"
                >
                  <span class="size-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </Transition>
            </template>

            <Transition name="demo-fade" mode="out-in">
              <!-- Waiting for the dev server -->
              <div
                v-if="step < 9"
                key="wait"
                class="text-dimmed absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm"
              >
                <span
                  class="bg-elevated ring-default flex size-12 items-center justify-center rounded-full ring"
                >
                  <UIcon
                    :name="step > 7 ? 'i-lucide-loader-circle' : 'i-lucide-globe'"
                    :class="step > 7 ? 'animate-spin' : ''"
                    class="size-5"
                  />
                </span>
                {{ step > 7 ? 'Starting the dev server…' : 'Your site shows here' }}
              </div>

              <!-- The blog, while the address bar gets `/admin` too -->
              <div v-else-if="step < 11" key="blog" class="absolute inset-0 flex flex-col">
                <div class="border-default flex items-center gap-4 border-b px-5 py-3 text-xs">
                  <span class="text-highlighted font-[Fredoka] text-sm font-semibold">My Blog</span>
                  <span class="text-muted ms-auto flex gap-3">
                    <span>Posts</span><span>About</span>
                    <UIcon name="i-lucide-search" class="size-4" />
                  </span>
                </div>
                <div class="flex flex-1 flex-col gap-3 p-5">
                  <div class="demo-pop flex gap-3">
                    <span
                      :class="posts[0]!.tone"
                      class="h-16 w-24 shrink-0 rounded-lg bg-linear-to-br"
                    />
                    <span class="flex min-w-0 flex-col gap-1">
                      <span class="text-highlighted font-[Fredoka] text-sm/tight font-semibold">
                        {{ posts[0]!.title }}
                      </span>
                      <span class="text-muted text-[11px]">{{ posts[0]!.date }} · 4 min read</span>
                      <span class="text-toned hidden text-[11px] sm:block">
                        Pluto is small, far away, and full of surprises. So is this blog.
                      </span>
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div
                      v-for="(post, index) in posts.slice(1)"
                      :key="post.title"
                      :style="{ animationDelay: `${150 + index * 120}ms` }"
                      class="demo-pop flex flex-col gap-1.5"
                    >
                      <span :class="post.tone" class="h-12 rounded-lg bg-linear-to-br" />
                      <span class="text-highlighted text-xs/tight font-medium">
                        {{ post.title }}
                      </span>
                      <span class="text-muted text-[11px]">{{ post.date }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- The admin -->
              <div v-else key="admin" class="absolute inset-0">
                <PlutoDemoAdmin
                  :backend="{ label: 'Git · Local', icon: 'i-lucide-git-branch' }"
                  :menu="menu"
                  :tiles="tiles"
                  :rows="rows"
                  :active="adminPage"
                  create="Post"
                />
              </div>
            </Transition>
          </PlutoDemoWindow>
          <PlutoDemoCursor v-bind="pointer.cursor" />
        </div>
      </div>
    </PlutoDemoStage>

    <!-- The stages of the loop. The one that plays is lit; the ones before it are done. -->
    <ol
      class="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-sm"
      aria-label="The stages of the setup"
    >
      <li v-for="(item, index) in stages" :key="item.label" class="flex items-center gap-2">
        <span
          :class="
            index === stage
              ? 'bg-primary/10 text-primary ring-primary/30'
              : index < stage
                ? 'text-highlighted ring-default'
                : 'text-dimmed ring-default/60'
          "
          :aria-current="index === stage ? 'step' : undefined"
          class="flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ring transition-colors duration-300"
        >
          <UIcon :name="index < stage ? 'i-lucide-check' : item.icon" class="size-4" />
          {{ item.label }}
        </span>
        <UIcon
          v-if="index < stages.length - 1"
          name="i-lucide-chevron-right"
          class="text-dimmed hidden size-3.5 sm:block"
        />
      </li>
    </ol>
  </div>
</template>

<style scoped>
.demo-line {
  animation: demo-in 0.35s ease-out both;
}
.demo-pop {
  animation: demo-pop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1.2) both;
}
.demo-fade-enter-active,
.demo-fade-leave-active {
  transition: opacity 0.3s ease;
}
.demo-fade-enter-from,
.demo-fade-leave-to {
  opacity: 0;
}
@keyframes demo-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
}
@keyframes demo-pop {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(6px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .demo-line,
  .demo-pop {
    animation: none;
  }
}
</style>
