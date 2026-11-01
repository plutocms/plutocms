<script setup lang="ts">
definePlutoBlock({
  label: 'Setup demo',
  icon: 'i-lucide-terminal',
  group: 'landing',
  description:
    'A terminal runs create-pluto, and a browser shows the store, then the admin. It plays while it is on screen.',
  insert: '::pluto-setup-demo\n::'
})

// The setup demo of the landing: a terminal runs `create-pluto`, and a browser next to it shows
// the store, then the admin. It loops while it is on screen (see useDemoTimeline).
const root = ref<HTMLElement | null>(null)

// 0 type the command · 1-3 the questions · 4-5 download and install · 6 the dev server ·
// 7 the store · 8 the admin.
const { step, reduced } = useDemoTimeline(
  root,
  [1700, 900, 900, 900, 1000, 1300, 1300, 2200, 4200]
)

// The command types itself at step 0, in the browser only. The server renders it whole.
const command = 'npm create pluto@latest my-shop'
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
onMounted(() => {
  watch(step, type)
})
onBeforeUnmount(() => typing && clearInterval(typing))

const questions = [
  { label: 'Pick a backend', answer: 'Supabase' },
  { label: 'Pick a template', answer: 'Shop' },
  { label: 'Pick a package manager', answer: 'bun' }
]

const url = computed(() =>
  step.value >= 8 ? 'localhost:3000/admin' : 'localhost:3000'
)

const products = [
  { name: 'Moon mug', price: '$12.00', tone: 'from-tholin-200 to-heart-100' },
  { name: 'Haze print', price: '$24.00', tone: 'from-haze-200 to-haze-50' },
  { name: 'Orbit lamp', price: '$48.00', tone: 'from-kuiper-200 to-heart-50' }
]

const menu = [
  { label: 'Home', icon: 'i-lucide-house' },
  { label: 'Products', icon: 'i-lucide-package' },
  { label: 'Media', icon: 'i-lucide-images' },
  { label: 'Users', icon: 'i-lucide-users' },
  { label: 'Settings', icon: 'i-lucide-settings' }
]
</script>

<template>
  <div
    ref="root"
    class="grid items-stretch gap-6 lg:grid-cols-2"
    aria-label="A terminal creates a Pluto shop project, then a browser shows the store and its admin."
    role="img"
  >
    <!-- The terminal -->
    <div
      class="bg-kuiper-950 ring-kuiper-800 flex min-h-80 flex-col overflow-hidden rounded-xl font-mono text-[13px]/6 shadow-xl ring"
    >
      <div class="border-kuiper-800 flex items-center gap-2 border-b px-4 py-2.5">
        <span class="bg-kuiper-700 size-2.5 rounded-full" />
        <span class="bg-kuiper-700 size-2.5 rounded-full" />
        <span class="bg-kuiper-700 size-2.5 rounded-full" />
        <span class="text-kuiper-400 ms-2 text-xs">Terminal</span>
      </div>
      <div class="text-kuiper-200 flex flex-col p-4">
        <p>
          <span class="text-tholin-400">$</span> {{ typed
          }}<span
            v-if="step === 0 && !reduced"
            class="bg-kuiper-300 ms-px inline-block h-4 w-2 animate-pulse align-middle"
          />
        </p>
        <template v-for="(question, index) in questions" :key="question.label">
          <p v-if="step > index" class="demo-line">
            <span class="text-haze-400">◆</span> {{ question.label }}
            <span class="text-kuiper-500">·</span>
            <span class="text-heart-200">{{ question.answer }}</span>
          </p>
        </template>
        <p v-if="step > 3" class="demo-line">
          <span class="text-emerald-400">✔</span> Template downloaded
        </p>
        <p v-if="step > 4" class="demo-line">
          <span class="text-emerald-400">✔</span> Dependencies installed
        </p>
        <template v-if="step > 5">
          <p class="demo-line mt-2">
            <span class="text-tholin-400">$</span> bun run dev
          </p>
          <p class="demo-line text-kuiper-400">
            <span class="text-emerald-400">➜</span> Local:
            <span class="text-haze-300 underline">http://localhost:3000</span>
          </p>
        </template>
      </div>
    </div>

    <!-- The browser -->
    <div
      class="bg-default ring-default flex min-h-80 flex-col overflow-hidden rounded-xl shadow-xl ring"
    >
      <div class="border-default bg-elevated/60 flex items-center gap-3 border-b px-4 py-2.5">
        <div class="flex gap-1.5">
          <span class="bg-accented size-2.5 rounded-full" />
          <span class="bg-accented size-2.5 rounded-full" />
          <span class="bg-accented size-2.5 rounded-full" />
        </div>
        <div
          class="bg-default text-muted ring-default flex flex-1 items-center gap-1.5 rounded-md px-3 py-1 text-xs ring"
        >
          <UIcon name="i-lucide-lock" class="size-3" />
          <Transition name="demo-fade" mode="out-in">
            <span :key="url">{{ url }}</span>
          </Transition>
        </div>
      </div>

      <div class="relative flex-1">
        <Transition name="demo-fade" mode="out-in">
          <!-- Waiting for the dev server -->
          <div
            v-if="step < 7"
            key="wait"
            class="text-dimmed absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm"
          >
            <UIcon
              :name="step > 5 ? 'i-lucide-loader-circle' : 'i-lucide-globe'"
              :class="step > 5 ? 'animate-spin' : ''"
              class="size-7"
            />
            {{ step > 5 ? 'Starting…' : 'Your site shows here' }}
          </div>

          <!-- The store -->
          <div v-else-if="step === 7" key="store" class="flex flex-col gap-4 p-5">
            <div class="flex items-center justify-between">
              <span class="text-highlighted font-semibold">My Shop</span>
              <UIcon name="i-lucide-shopping-bag" class="text-muted size-4" />
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="(product, index) in products"
                :key="product.name"
                :style="{ animationDelay: `${index * 120}ms` }"
                class="demo-pop flex flex-col gap-1.5"
              >
                <div
                  :class="product.tone"
                  class="aspect-square rounded-lg bg-linear-to-br"
                />
                <span class="text-highlighted text-xs font-medium">{{
                  product.name
                }}</span>
                <span class="text-muted text-xs">{{ product.price }}</span>
              </div>
            </div>
          </div>

          <!-- The admin -->
          <div v-else key="admin" class="flex h-full flex-col">
            <div
              class="bg-kuiper-950 text-kuiper-200 flex items-center gap-2 px-3 py-1.5 text-[11px]"
            >
              <PlutoLogo class="h-3.5 w-auto" />
              <span class="text-kuiper-400">+ New Product</span>
              <span class="ms-auto">Admin</span>
            </div>
            <div class="flex flex-1">
              <ul class="border-default flex w-36 flex-col gap-0.5 border-e p-2">
                <li
                  v-for="(item, index) in menu"
                  :key="item.label"
                  :style="{ animationDelay: `${index * 90}ms` }"
                  :class="
                    index === 1
                      ? 'bg-primary/10 text-primary'
                      : 'text-toned'
                  "
                  class="demo-slide flex items-center gap-2 rounded-md px-2 py-1.5 text-xs"
                >
                  <UIcon :name="item.icon" class="size-3.5" />
                  {{ item.label }}
                </li>
              </ul>
              <div class="flex flex-1 flex-col gap-3 p-4">
                <span class="text-highlighted text-sm font-semibold">Products</span>
                <div
                  v-for="(product, index) in products"
                  :key="product.name"
                  :style="{ animationDelay: `${300 + index * 120}ms` }"
                  class="demo-pop border-default flex items-center gap-2 rounded-md border p-2"
                >
                  <span
                    :class="product.tone"
                    class="size-6 rounded bg-linear-to-br"
                  />
                  <span class="text-highlighted text-xs">{{ product.name }}</span>
                  <span class="text-muted ms-auto text-xs">{{
                    product.price
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-line {
  animation: demo-in 0.35s ease-out both;
}
.demo-pop {
  animation: demo-pop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1.2) both;
}
.demo-slide {
  animation: demo-slide 0.4s ease-out both;
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
@keyframes demo-slide {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .demo-line,
  .demo-pop,
  .demo-slide {
    animation: none;
  }
}
</style>
