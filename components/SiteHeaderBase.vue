<template>
  <header
    :class="[
      'sticky',
      'z-10',
      'top-0',

      'flex',
      'items-end',
      'gap-4',

      'min-h-[64px]',

      'bg-white dark:bg-gray-900',
    ]"
  >
    <slot />
  </header>
</template>
