<template>
  <main :key="route.path">
    <h1
      :class="[
        'text-xl',
        'font-bold',
        'font-mono',
        'mb-4',
        'print:hidden',
        { hidden: isHeaderHidden },
      ]"
    >
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
          label="Sign"
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

const isHeaderHidden = computed(() => route.query.print === '1')

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

onMounted(async () => {
  try {
    const payload = window.sessionStorage.getItem('likecoin_nft_book_press_token')
    if (payload) {
      const { wallet: storedWallet, token } = JSON.parse(payload)
      restoreSession(storedWallet, token)
      await connect()
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
    const signature = await signMessageMemo('authorize', ['read:nftbook', 'write:nftbook'])
    await authenticate(wallet.value, signature)
    try {
      window.sessionStorage.setItem('likecoin_nft_book_press_token', JSON.stringify({ wallet: sessionWallet.value, token: token.value }))
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
