<template>
  <div class="fixed print:relative print:inset-auto inset-0 flex">
    <SiteNavigation
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

</script>
