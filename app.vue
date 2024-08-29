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

    <NuxtLoadingIndicator />

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useUIStore } from '~/stores/ui'
import { useWalletStore } from '~/stores/wallet'

const bookStoreApiStore = useBookStoreApiStore()
const walletStore = useWalletStore()
const { connect } = walletStore
const { restoreSession } = bookStoreApiStore
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
  try {
    const payload = window.localStorage.getItem('likecoin_nft_book_press_token')
    if (payload) {
      const { wallet: storedWallet, token } = JSON.parse(payload)
      restoreSession(storedWallet, token)
      if (storedWallet) { await connect() }
    }
  } catch {}
})

</script>
