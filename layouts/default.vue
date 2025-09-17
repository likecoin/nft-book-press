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

    <UModal
      v-model="bookstoreApiStore.showLoginPanel"
      :close="{ onClick: () => bookstoreApiStore.closeLoginPanel() }"
      :ui="{ width: '!max-w-[348px]' }"
    >
      <LoginPanel
        :migration-url="migrationURL"
        @connect="onAuthenticate"
      />
    </UModal>
  </div>
</template>

<script setup>
const { isNavigationCollapsed } = useAppLayout()
const bookstoreApiStore = useBookstoreApiStore()
const { onAuthenticate } = useAuth()

const colorMode = useColorMode()
if (colorMode.value !== 'light') {
  colorMode.preference = 'light'
}

const { LIKECOIN_V3_BOOK_MIGRATION_SITE_URL } = useRuntimeConfig().public
const migrationURL = appendUTMParamsToURL({
  url: LIKECOIN_V3_BOOK_MIGRATION_SITE_URL,
  medium: 'login',
  campaign: 'migration'
})

const isSlideoverOpen = ref(false)

// Auto close modal when authenticated
watch(() => bookstoreApiStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && bookstoreApiStore.showLoginPanel) {
    bookstoreApiStore.closeLoginPanel()
  }
})
</script>
