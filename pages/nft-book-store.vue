<template>
  <main :key="route.path">
    <h1 class="text-xl font-bold font-mono mb-4">
      NFT Book Store Management Page
    </h1>

    <UContainer
      v-if="!bookStoreApiStore.isAuthenticated"
      class="flex justify-center items-center py-8"
    >
      <UCard :ui="{ body: { base: 'flex justify-center items-center' } }">
        <template #header>
          <h2 class="font-bold font-mono">
            Verify your wallet address
          </h2>
        </template>

        <UButton
          label="Sign in"
          :loading="isLoading"
          :disabled="isLoading"
          @click="onClickAuth"
        />
      </UCard>
    </UContainer>

    <NuxtPage v-else />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'

const route = useRoute()

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const { wallet, signer } = storeToRefs(walletStore)
const { connect, signMessageMemo } = walletStore
const { authenticate, restoreSession } = bookStoreApiStore
const { token, wallet: sessionWallet } = storeToRefs(bookStoreApiStore)
const toast = useToast()

const error = ref('')
const isLoading = ref(false)

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

onMounted(() => {
  try {
    const payload = window.localStorage.getItem('likecoin_nft_book_press_token')
    if (payload) {
      const { wallet: storedWallet, token } = JSON.parse(payload)
      restoreSession(storedWallet, token)
    }
  } catch {}
})

async function onClickAuth () {
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await connect()
    }
    if (!wallet.value || !signer.value) { return }
    const signature = await signMessageMemo(
      'authorize',
      ['read:nftbook', 'write:nftbook', 'read:nftcollection', 'write:nftcollection']
    )
    await authenticate(wallet.value, signature)
    try {
      window.localStorage.setItem('likecoin_nft_book_press_token', JSON.stringify({ wallet: sessionWallet.value, token: token.value }))
    } catch (err) {}
  } catch (err) {
    console.error(err)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: (err as Error).toString(),
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  } finally {
    isLoading.value = false
  }
}

</script>
<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
