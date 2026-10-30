<script setup lang="ts">
// The page of one layer: its header (icon, name, package, kind, backends), the install command,
// the npm numbers, the links, the layers it builds on and the layers that build on it, and the
// body of `content/layers/<name>.md`.
const route = useRoute()
const path = computed(() => `/layers/${route.params.slug}`)

const { data: page } = await usePlutoContentPage(path, {
  collection: 'layers',
  type: 'layer'
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Layer not found',
    fatal: true
  })
}

const { data: layers } = await useAsyncData('layers', () =>
  queryCollection('layers').order('order', 'ASC').all()
)

const { data: npm } = useNpmPackage(() => page.value!.package)
const kind = computed(() => LAYER_KINDS[page.value!.kind as LayerKind])

const byPackage = computed(
  () => new Map((layers.value ?? []).map((layer) => [layer.package, layer]))
)
const builtOn = computed(() =>
  ((page.value?.extends ?? []) as string[]).map((name) => ({
    name,
    layer: byPackage.value.get(name)
  }))
)
const usedBy = computed(() =>
  (layers.value ?? []).filter((layer) =>
    (layer.extends ?? []).includes(page.value!.package)
  )
)

const managers = ['npm', 'pnpm', 'bun'] as const
const manager = ref<(typeof managers)[number]>('npm')
const install = computed(() => {
  const name = page.value!.package
  return manager.value === 'npm'
    ? `npm install ${name}`
    : `${manager.value} add ${name}`
})
const { copy, copied } = useClipboard()

const published = computed(() =>
  npm.value?.published
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
        new Date(npm.value.published)
      )
    : null
)

const links = computed(
  () =>
    [
      page.value?.docs && {
        label: 'Documentation',
        icon: 'i-lucide-book-open',
        to: page.value.docs
      },
      {
        label: 'Source code',
        icon: 'i-simple-icons-github',
        to: page.value!.repo,
        target: '_blank'
      },
      {
        label: 'npm',
        icon: 'i-simple-icons-npm',
        to: `https://www.npmjs.com/package/${page.value!.package}`,
        target: '_blank'
      }
    ].filter(Boolean) as {
      label: string
      icon: string
      to: string
      target?: string
    }[]
)

// The id of a layer page is its path under `content/layers`.
usePlutoContentEditLink(
  () => page.value && { stem: page.value.stem?.replace(/^layers\//, '') },
  'layer'
)

const title = `${page.value.title} layer`
useSeoMeta({
  title,
  ogTitle: title,
  description: page.value.description,
  ogDescription: page.value.description
})
defineOgImage('Docs', {
  title: page.value.title,
  description: page.value.description,
  headline: 'Pluto layer'
})
</script>

<template>
  <UContainer v-if="page" class="py-10 sm:py-14">
    <ULink
      to="/layers"
      class="text-muted hover:text-primary mb-8 inline-flex items-center gap-1.5 text-sm"
    >
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      All layers
    </ULink>

    <header class="border-default mb-10 flex flex-col gap-6 border-b pb-10">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          class="bg-elevated ring-default flex size-16 shrink-0 items-center justify-center rounded-2xl ring"
        >
          <UIcon :name="page.icon" class="text-highlighted size-9" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-highlighted text-3xl font-bold sm:text-4xl">
              {{ page.title }}
            </h1>
            <UBadge
              v-if="kind"
              :label="kind.label"
              :icon="kind.icon"
              color="neutral"
              variant="subtle"
            />
            <UBadge
              v-if="page.official"
              label="Official"
              icon="i-lucide-badge-check"
              color="primary"
              variant="subtle"
            />
          </div>
          <p class="text-muted mt-1 font-mono text-sm">{{ page.package }}</p>
        </div>
      </div>

      <p class="text-toned max-w-3xl text-lg text-pretty">
        {{ page.description }}
      </p>

      <div class="flex flex-wrap items-center gap-3">
        <div
          class="border-default bg-elevated/50 flex max-w-full items-center gap-1 rounded-lg border p-1 ps-3"
        >
          <span class="text-dimmed font-mono text-sm select-none">$</span>
          <code class="text-highlighted truncate px-2 font-mono text-sm">{{
            install
          }}</code>
          <UButton
            :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            :aria-label="copied ? 'Copied' : 'Copy the command'"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="copy(install)"
          />
        </div>
        <UFieldGroup size="sm">
          <UButton
            v-for="item in managers"
            :key="item"
            :label="item"
            :aria-pressed="manager === item"
            :variant="manager === item ? 'soft' : 'ghost'"
            color="neutral"
            @click="manager = item"
          />
        </UFieldGroup>
      </div>
    </header>

    <div class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <article class="min-w-0">
        <ContentRenderer :value="page" />
      </article>

      <aside class="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
        <section aria-labelledby="layer-npm" class="flex flex-col gap-3">
          <h2 id="layer-npm" class="text-highlighted text-sm font-semibold">
            Package
          </h2>
          <dl class="grid grid-cols-2 gap-3">
            <div class="border-default rounded-lg border p-3">
              <dt class="text-muted text-xs">Version</dt>
              <dd class="text-highlighted font-mono font-semibold">
                {{ npm?.version ?? '–' }}
              </dd>
            </div>
            <div class="border-default rounded-lg border p-3">
              <dt class="text-muted text-xs">Weekly downloads</dt>
              <dd class="text-highlighted font-mono font-semibold">
                {{ formatDownloads(npm?.downloads) }}
              </dd>
            </div>
            <div class="border-default col-span-2 rounded-lg border p-3">
              <dt class="text-muted text-xs">Last release</dt>
              <dd class="text-highlighted text-sm font-medium">
                {{ published ?? '–' }}
                <span v-if="npm?.license" class="text-muted">
                  · {{ npm.license }}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="layer-backends" class="flex flex-col gap-3">
          <h2
            id="layer-backends"
            class="text-highlighted text-sm font-semibold"
          >
            Works with
          </h2>
          <ul class="flex flex-col gap-2">
            <li
              v-for="backend in page.backends"
              :key="backend"
              class="text-toned flex items-center gap-2 text-sm"
            >
              <UIcon
                :name="LAYER_BACKENDS[backend]?.icon ?? 'i-lucide-server'"
                class="size-4"
              />
              {{ LAYER_BACKENDS[backend]?.label ?? backend }}
            </li>
          </ul>
        </section>

        <section
          v-if="builtOn.length"
          aria-labelledby="layer-built-on"
          class="flex flex-col gap-3"
        >
          <h2
            id="layer-built-on"
            class="text-highlighted text-sm font-semibold"
          >
            Builds on
          </h2>
          <ul class="flex flex-col gap-1">
            <li v-for="item in builtOn" :key="item.name">
              <ULink
                v-if="item.layer"
                :to="item.layer.path"
                class="text-toned hover:text-primary flex items-center gap-2 text-sm"
              >
                <UIcon :name="item.layer.icon" class="size-4" />
                {{ item.layer.title }}
              </ULink>
              <span v-else class="text-toned font-mono text-sm">{{
                item.name
              }}</span>
            </li>
          </ul>
        </section>

        <section
          v-if="usedBy.length"
          aria-labelledby="layer-used-by"
          class="flex flex-col gap-3"
        >
          <h2 id="layer-used-by" class="text-highlighted text-sm font-semibold">
            Layers on top of it
          </h2>
          <ul class="flex flex-col gap-1">
            <li v-for="layer in usedBy" :key="layer.path">
              <ULink
                :to="layer.path"
                class="text-toned hover:text-primary flex items-center gap-2 text-sm"
              >
                <UIcon :name="layer.icon" class="size-4" />
                {{ layer.title }}
              </ULink>
            </li>
          </ul>
        </section>

        <UPageLinks title="Links" :links="links" />
      </aside>
    </div>
  </UContainer>
</template>
