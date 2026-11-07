<script setup lang="ts">
// The templates store: each official template with a preview, its live demo, its deploy buttons
// and its CLI command, then "Start from scratch". The list comes from the registry of the
// templates repo (`/api/templates`), so a new template shows with no deploy of this site.
const { data, error } = await useStoreTemplates()

const templates = computed(() => data.value?.templates ?? [])

const steps = [
  {
    icon: 'i-lucide-eye',
    title: 'Open the live demo',
    description:
      'Each demo is a static copy of the template, with sample content. Click around before you choose.'
  },
  {
    icon: 'i-lucide-rocket',
    title: 'Deploy it',
    description:
      'A deploy button copies the template to a new repository in your GitHub account, and puts the site online.'
  },
  {
    icon: 'i-lucide-pen-line',
    title: 'Open the admin',
    description:
      'Open /admin on your new site. With the Git CMS, Pluto creates the GitHub App for you. With Supabase, the host asks for the values of your project.'
  }
]

const title = 'Templates'
const description =
  'Start a site from a template. Open the live demo, then deploy it with one button, or start it on your computer with one command.'

useSeoMeta({ title, ogTitle: title, description, ogDescription: description })
defineOgImage('Docs', { title, description, headline: 'Pluto' })
</script>

<template>
  <div>
    <UPageHero
      :title="title"
      :description="description"
      :ui="{ container: 'py-16 sm:py-20 lg:py-24' }"
    >
      <template #headline>
        <PlutoChip icon="i-lucide-layout-template" center>
          The templates store
        </PlutoChip>
      </template>
    </UPageHero>

    <UContainer class="pb-24">
      <UAlert
        v-if="error"
        class="mb-8"
        color="warning"
        variant="subtle"
        icon="i-lucide-cloud-off"
        title="The templates did not load"
        description="GitHub did not answer. Try again later, or see the templates on GitHub."
        :actions="[
          {
            label: 'Open plutocms/templates',
            to: 'https://github.com/plutocms/templates',
            target: '_blank',
            color: 'neutral',
            variant: 'outline'
          }
        ]"
      />

      <div class="grid gap-6 md:grid-cols-2">
        <TemplateCard
          v-for="template in templates"
          :key="template.id"
          :template="template"
        />
        <TemplateCard :template="SCRATCH_TEMPLATE" />
      </div>

      <section class="mt-20" aria-labelledby="templates-how">
        <h2
          id="templates-how"
          class="text-highlighted mb-8 text-2xl font-semibold"
        >
          From a template to a live site
        </h2>
        <ol class="grid gap-6 md:grid-cols-3">
          <li
            v-for="(step, index) in steps"
            :key="step.title"
            class="flex flex-col gap-3"
          >
            <span
              class="bg-elevated ring-default flex size-11 items-center justify-center rounded-lg ring"
            >
              <UIcon :name="step.icon" class="text-highlighted size-5" />
            </span>
            <p class="text-highlighted font-semibold">
              {{ index + 1 }}. {{ step.title }}
            </p>
            <p class="text-muted text-sm text-pretty">
              {{ step.description }}
            </p>
          </li>
        </ol>
      </section>

      <UPageCTA
        class="mt-16"
        title="Start on your computer"
        description="The CLI downloads a template, asks for the backend, and installs it. Your site and its admin run on your computer, with no account."
        :links="[
          {
            label: 'Quickstart',
            to: '/docs/start-here/quickstart',
            trailingIcon: 'i-lucide-arrow-right'
          },
          {
            label: 'Deploy',
            to: '/docs/start-here/deploy',
            color: 'neutral',
            variant: 'outline'
          }
        ]"
        variant="subtle"
      />
    </UContainer>
  </div>
</template>
