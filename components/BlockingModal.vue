<template>
  <div class="flex flex-col justify-center items-center w-full min-h-[200px] px-6 py-4 divide-y-0 rounded-2xl">
    <img
      class="animate-pulse w-[64px]"
      src="/favicon.ico"
    >
    <div
      class="mt-6 font-bold"
      v-text="props.title"
    />
    <div
      v-if="props.description"
      class="mt-4 text-(--ui-text-muted) text-sm"
      v-text="props.description"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  description?: string
}>()
</script>
