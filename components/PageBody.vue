<template>
  <UContainer :ui="ui">
    <slot />
  </UContainer>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

const props = defineProps<{
  ui?: {
    base?: string;
    padding?: string;
    constrained?: string;
  };
}>()

const ui = computed(() => ({
  base: twMerge('w-full space-y-6', props?.ui?.base),
  padding: twMerge('pt-6 pb-20 !pl-14 lg:!pl-8', props?.ui?.padding),
  constrained: props?.ui?.constrained !== undefined ? props?.ui?.constrained : undefined
}))
</script>
