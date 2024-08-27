<template>
  <header
    :class="[
      'sticky',
      'z-10',
      'top-0',

      'flex',
      'items-center',
      'gap-4',

      'min-h-[64px]',

      'bg-white dark:bg-gray-900',
      'border-b',
      'border-gray-200 dark:border-gray-800',
    ]"
  >
    <slot />
  </header>
</template>
