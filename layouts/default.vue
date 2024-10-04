<template>
  <div class="fixed print:relative print:inset-auto inset-0 flex">
    <SiteNavigation
      v-if="!isNavigationCollapsed"
      :class="[
        'max-lg:hidden',
        'w-full',
        'max-w-[320px]',
        'border-r',
        'border-gray-200 dark:border-gray-800',
      ]"
    />

    <slot />
  </div>
</template>

<script setup>
const colorMode = useColorMode()
if (colorMode.value !== 'light') {
  colorMode.preference = 'light'
}

const { isNavigationCollapsed } = useAppLayout()
</script>
