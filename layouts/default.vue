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
      icon="i-heroicons-bars-3-16-solid"
      size="xl"
      color="gray"
      variant="link"
      class="fixed top-[12px] left-1 z-50 lg:hidden"
      @click="isSlideoverOpen = true"
    />

    <USlideover
      v-model="isSlideoverOpen"
      side="left"
      :ui="{ width: 'w-full max-w-[180px]'}"
    >
      <SiteNavigation class="h-full" />
    </USlideover>

    <AuthRequiredView>
      <main class="flex-1 overflow-y-scroll">
        <slot />
      </main>
    </AuthRequiredView>

    <UModal
      v-model="bookstoreApiStore.isShowLoginPanel"
      :close="{ onClick: () => bookstoreApiStore.closeLoginPanel() }"
      :ui="{ width: '!max-w-[348px]' }"
    >
      <LoginPanel @connect="onAuthenticate" />
    </UModal>
    <UModal
      v-model="shouldShowBlockingModal"
      prevent-close
      :ui="{ width: '!min-w-[200px]' }"
    >
      <BlockingModal :title="loginStatus" />
    </UModal>
  </div>
</template>

<script setup>
const bookstoreApiStore = useBookstoreApiStore()
const { onAuthenticate, shouldShowBlockingModal, loginStatus } = useAuth()

const colorMode = useColorMode()
if (colorMode.value !== 'light') {
  colorMode.preference = 'light'
}

const isSlideoverOpen = ref(false)

// Auto close modal when authenticated
watch(() => bookstoreApiStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && bookstoreApiStore.isShowLoginPanel) {
    bookstoreApiStore.closeLoginPanel()
  }
})

</script>
