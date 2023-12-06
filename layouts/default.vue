<template>
  <UContainer class="lg:grid grid-cols-10 gap-4 print:gap-0 print:p-0">
    <SiteMenu class="col-span-2 py-4 hidden lg:block print:hidden" />
    <UContainer class="col-span-8 py-4 print:p-0" :ui="{ base: '' }">
      <slot />
    </UContainer>
  </UContainer>
</template>
