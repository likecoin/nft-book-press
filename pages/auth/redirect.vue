<template>
  <PageBody class="flex flex-col items-center justify-center">
    <h1 class="text-24">
      Redirecting
    </h1>
  </PageBody>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'

definePageMeta({ layout: 'page' })

const store = useWalletStore()
const { handleConnectorRedirect } = store

const { wallet, signer } = storeToRefs(store)
const { signMessageMemo, disconnect } = store
const bookStoreApiStore = useBookStoreApiStore()
const { authenticate } = bookStoreApiStore
const { token, wallet: sessionWallet } = storeToRefs(bookStoreApiStore)

const route = useRoute()
const router = useRouter()
const toast = useToast()

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
      if (!signature) {
        disconnect()
        router.replace('/')
        return
      }
      await authenticate(wallet.value, signature)
      try {
        window.localStorage.setItem('likecoin_nft_book_press_token', JSON.stringify({ wallet: sessionWallet.value, token: token.value }))
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    } else {
      toast.add({
        icon: 'i-heroicons-exclamation-circle',
        title: 'Failed to authenticate: no signer',
        timeout: 0,
        color: 'red',
        ui: {
          title: 'text-red-400 dark:text-red-400'
        }
      })
    }

    const postAuthRoute = '/'
    router.replace(postAuthRoute)
  }
})

</script>
