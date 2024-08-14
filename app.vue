<template>
  <div class="flex flex-col min-h-screen">
    <SiteHeader />
    <NuxtLayout class="w-full flex-grow">
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { useBookStoreApiStore } from '~/stores/book-store-api'

const bookStoreApiStore = useBookStoreApiStore()
const { restoreSession } = bookStoreApiStore

onMounted(() => {
  try {
    const payload = window.localStorage.getItem('likecoin_nft_book_press_token')
    if (payload) {
      const { wallet: storedWallet, token } = JSON.parse(payload)
      restoreSession(storedWallet, token)
    }
  } catch {}
})

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
