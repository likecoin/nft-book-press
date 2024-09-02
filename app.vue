<template>
  <div>
    <NuxtLayout>
      <NuxtPage class="grow overflow-y-auto" />
    </NuxtLayout>

    <USlideover
      v-model="isMobileMenuOpen"
      side="left"
    >
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        class="absolute top-4 right-4 z-20"
        square
        padded
        @click="isMobileMenuOpen = false"
      />
      <SiteNavigation />
    </USlideover>

    <UModal
      :model-value="isRestoringSession"
      :prevent-close="true"
      :ui="{ base: 'p-4 items-center gap-2' }"
    >
      <span>Restoring session ...</span>
      <UProgress animation="carousel" />
    </UModal>

    <NuxtLoadingIndicator />

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useUIStore } from '~/stores/ui'

const bookStoreApiStore = useBookStoreApiStore()
const { restoreSession } = bookStoreApiStore
const { isRestoringSession } = storeToRefs(bookStoreApiStore)
const uiStore = useUIStore()

const isMobileMenuOpen = computed({
  get: () => uiStore.isSiteMenuOpen,
  set: value => uiStore.setSiteMenuOpen(value)
})

const route = useRoute()

// NOTE: Close mobile menu on route change
watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
  }
)

useHead({
  htmlAttrs: {
    class: 'h-dvh'
  },
  bodyAttrs: {
    class: 'h-dvh text-gray-700 dark:text-gray-200 dark:bg-gray-900'
  }
})

onMounted(async () => {
  await restoreSession()
})

</script>
