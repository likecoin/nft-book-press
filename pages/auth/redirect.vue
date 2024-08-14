<template>
  <div class="redirect-page">
    <div class="flex flex-col items-center my-48">
      <h1 class="text-24">
        Redirecting
      </h1>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'

const store = useWalletStore()
const { handleConnectorRedirect } = store

const { wallet, signer } = storeToRefs(store)
const { signMessageMemo } = store
const bookStoreApiStore = useBookStoreApiStore()
const { authenticate } = bookStoreApiStore
const { token, wallet: sessionWallet } = storeToRefs(bookStoreApiStore)

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const { method, code } = route.query
  if (method && code) {
    await handleConnectorRedirect({
      method: method as string,
      params: { code }
    })

    if (signer.value) {
      const signature = await signMessageMemo(
        'authorize',
        ['read:nftbook', 'write:nftbook', 'read:nftcollection', 'write:nftcollection']
      )
      if (!signature) { return }
      await authenticate(wallet.value, signature)
      try {
        window.localStorage.setItem('likecoin_nft_book_press_token', JSON.stringify({ wallet: sessionWallet.value, token: token.value }))
      } catch (err) {}
    }

    const postAuthRoute = '/'
    router.replace(postAuthRoute)
  }
})

</script>
