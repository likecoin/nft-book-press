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
      <span>{{ $t('app.restoring_session') }}</span>
      <UProgress animation="carousel" />
    </UModal>
    <WelcomeModal />

    <NuxtLoadingIndicator />

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useCollectionStore } from '~/stores/collection'
import { useUIStore } from '~/stores/ui'
const { t: $t } = useI18n()

const { SITE_URL } = useRuntimeConfig().public
const bookStoreApiStore = useBookStoreApiStore()
const collectionStore = useCollectionStore()

const { restoreAuthSession, fetchBookListing, clearSession } = bookStoreApiStore
const { listNFTBookCollections } = collectionStore
const { isRestoringSession, isAuthenticated } = storeToRefs(bookStoreApiStore)
const uiStore = useUIStore()
const toast = useToast()

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
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: `${SITE_URL}/favicon.ico`
    }
  ]
})

useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${$t('app.site_title')}` : $t('app.site_title')
  },
  ogTitle: $t('app.site_title'),
  description: $t('app.site_description'),
  ogDescription: $t('app.site_description'),
  ogType: 'website',
  ogSiteName: $t('app.site_title'),
  themeColor: '#28646e'
})

onMounted(async () => {
  try {
    await restoreAuthSession()
  } catch (error) {
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: `${(error as Error).toString()}, please re-login`,
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
    clearSession()
  }

  if (isAuthenticated.value) {
    try {
      await Promise.all([
        fetchBookListing(),
        listNFTBookCollections()
      ])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
})

</script>
