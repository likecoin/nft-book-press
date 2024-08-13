<template>
  <main :key="route.path">
    <h1 class="text-xl font-bold font-mono mb-4">
      NFT Book Store Management Page
    </h1>

    <UContainer
      v-if="!signer"
      class="flex justify-center items-center py-8 text-lg font-medium"
    >
      <h2>Please sign in to continue</h2>
    </UContainer>

    <NuxtPage v-else />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'

const route = useRoute()
const bookStoreApiStore = useBookStoreApiStore()
const store = useWalletStore()
const { signer } = storeToRefs(store)
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
<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
