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
const { authenticate, clearSession } = bookStoreApiStore

const route = useRoute()
const toast = useToast()

onMounted(async () => {
  const { method, code } = route.query
  if (method && code) {
    try {
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
          clearSession()
        } else {
          await authenticate(wallet.value, signature)
        }
      } else {
        throw new Error('Failed to authenticate: no signer')
      }
    } catch (error) {
      toast.add({
        icon: 'i-heroicons-exclamation-circle',
        title: (error as Error).toString(),
        timeout: 0,
        color: 'red',
        ui: {
          title: 'text-red-400 dark:text-red-400'
        }
      })
    }
  }

  executePostAuthRedirect()
})

</script>
