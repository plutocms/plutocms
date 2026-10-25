<script setup lang="ts">
// The OG image renderer does not know the site theme, so the colors are the
// hex values of the Pluto palette (app/assets/css/main.css).
//
// WhatsApp crops the 1200x600 image to 498:341 (about 1.46:1) from the center,
// so it cuts 162px on each side. The content keeps 200px on the left and on
// the right, so it stays inside the crop with a margin.
defineOptions({
  inheritAttrs: false
})

defineProps<{
  headline?: string
  title?: string
  description?: string
}>()
</script>

<template>
  <div
    class="w-full h-full flex relative overflow-hidden"
    :style="{ backgroundColor: '#0C0F1F', backgroundImage: 'radial-gradient(circle at 90% 0%, #1B4773 0%, #0C0F1F 55%)' }"
  >
    <div
      class="absolute top-0 left-0 w-full h-2"
      :style="{ backgroundColor: '#FB7E4F' }"
    />

    <div class="flex flex-col justify-between flex-1 px-[200px] py-16">
      <div />

      <div class="flex flex-col gap-5">
        <span
          v-if="headline"
          class="text-2xl font-medium"
          :style="{ color: '#FB7E4F' }"
        >
          {{ headline }}
        </span>

        <h1
          v-if="title"
          class="text-6xl/tight font-bold"
          :style="{ color: '#FFFFFF', lineClamp: 2, textOverflow: 'ellipsis' }"
        >
          {{ title }}
        </h1>

        <p
          v-if="description"
          class="text-3xl/11"
          :style="{ color: '#C2C8D9', lineClamp: 2, textOverflow: 'ellipsis' }"
        >
          {{ description }}
        </p>
      </div>

      <div class="flex items-center gap-4">
        <svg
          class="size-14"
          viewBox="0 0 472 472"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M460 236C460 359.712 359.712 460 236 460C112.288 460 12 359.712 12 236C12 112.288 112.288 12 236 12C359.712 12 460 112.288 460 236Z"
            fill="#E3C49F"
            stroke-width="24"
            stroke="black"
          />
          <path
            d="M363.567 279.28C327.754 257.28 296.036 279.28 286.533 299.805C282.425 279.28 259.672 247.731 219.814 263.188C162.605 285.373 177.755 367.557 267.803 414.564C383.202 395.571 407.756 306.426 363.567 279.28Z"
            fill="#FFE6C9"
          />
          <path
            d="M87.8737 346.179C109.701 377.165 140.755 399.658 166.202 407.64"
            stroke-width="18"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="black"
          />
          <path
            d="M64.0001 304.994C67.5156 313.111 68.8427 317.526 73.1145 322.697"
            stroke-width="18"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="black"
          />
          <circle
            cx="204.107"
            cy="98.8929"
            r="33.107"
            fill="black"
          />
          <circle
            cx="222.739"
            cy="106"
            r="8"
            fill="white"
          />
          <circle
            cx="208.107"
            cy="118"
            r="4"
            fill="white"
          />
          <circle
            cx="325.536"
            cy="98"
            r="33.107"
            fill="black"
          />
          <circle
            cx="341"
            cy="106"
            r="8"
            fill="white"
          />
          <circle
            cx="325.536"
            cy="118"
            r="4"
            fill="white"
          />
          <path
            d="M212.107 158.775C254.216 151.134 281.939 150.553 318.904 158.775C318.904 187.914 295.282 211.536 266.143 211.536H264.868C235.729 211.536 212.107 187.914 212.107 158.775Z"
            fill="black"
          />
        </svg>
        <div
          class="h-px flex-1"
          :style="{ backgroundColor: '#3E4562' }"
        />
        <span
          class="text-2xl font-semibold"
          :style="{ color: '#FFFFFF' }"
        >pluto</span>
      </div>
    </div>
  </div>
</template>
