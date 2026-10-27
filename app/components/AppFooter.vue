<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <UFooter>
    <template #left>
      <div class="flex items-center gap-2">
        <PlutoLogo
          mark
          class="size-5"
        />
        {{ footer.credits }}
      </div>
    </template>

    <p class="text-sm text-dimmed">
      {{ footer.tagline }}
      <template v-if="footer.poweredBy">
        ·
        <ULink
          :to="footer.poweredBy.to"
          class="text-muted hover:text-highlighted"
        >
          {{ footer.poweredBy.label }}
        </ULink>
      </template>
    </p>

    <template #right>
      <UColorModeButton
        v-if="footer?.colorMode"
        color="neutral"
        variant="ghost"
      />

      <template v-if="footer?.links">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
