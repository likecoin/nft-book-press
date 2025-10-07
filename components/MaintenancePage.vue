<template>
  <div class="flex items-center justify-center grow min-h-svh p-5 laptop:p-12 bg-[#f9f9f9]">
    <UCard
      class="overflow-hidden ring-[#131313] ring-2"
      :ui="{ header: { base: 'bg-[#131313]' } }"
    >
      <template #header>
        <img
          src="~/assets/images/3ook-no-padding.png"
          alt="3ook.com"
          class="max-w-xs mx-auto object-contain"
        >
      </template>
      <h1
        class="text-2xl font-bold text-center animate-pulse"
        v-text="$t('maintenance_page_title')"
      />
      <p
        class="mt-4"
        v-text="$t('maintenance_page_description')"
      />
    </UCard>
  </div>
</template>
