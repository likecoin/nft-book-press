<template>
  <div>
    <h1>NFT Book Store management page</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="!bookStoreApiStore.isAuthenticated">
      <h2>Verify your wallet address</h2>
      <div>
        <button :disabled="isLoading" @click="onClickAuth">
          Sign
        </button>
      </div>
    </section>
    <NuxtPage v-else />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const { wallet, signer } = storeToRefs(walletStore)
const { connect, signMessageMemo } = walletStore
const { authenticate, restoreSession } = bookStoreApiStore
const { token, wallet: sessionWallet } = storeToRefs(bookStoreApiStore)

const error = ref('')
const isLoading = ref(false)

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
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

</script>
<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
