<template>
  <div class="fixed print:relative print:inset-auto inset-0 flex">
    <SiteNavigation
      v-if="!isNavigationCollapsed"
      :class="[
        'max-lg:hidden',
        'w-full',
        'max-w-[180px]',
        'border-r',
        'border-gray-200 dark:border-gray-800',
      ]"
    />

    <UButton
      icon="i-heroicons-chevron-double-right"
      size="lg"
      color="gray"
      variant="soft"
      :class="[
        'fixed bottom-[76px] left-3 z-50',
        'lg:hidden',
        'shadow-sm',
      ]"
      @click="isSlideoverOpen = true"
    />

    <USlideover
      v-model="isSlideoverOpen"
      side="left"
      :ui="{ width: 'w-full max-w-[180px]'}"
    >
      <SiteNavigation class="h-full" />
    </USlideover>

    <slot />
  </div>
</template>

<script setup>
const { isNavigationCollapsed } = useAppLayout()

const colorMode = useColorMode()
if (colorMode.value !== 'light') {
  colorMode.preference = 'light'
}

const isSlideoverOpen = ref(false)

</script>
