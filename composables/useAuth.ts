import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'

export function useAuth () {
  const bookStoreApiStore = useBookStoreApiStore()
  const store = useWalletStore()
  const { wallet, signer } = storeToRefs(store)
  const { connect, disconnect, signMessageMemo } = store
  const { authenticate, clearSession } = bookStoreApiStore
  const toast = useToast()

  const isLoading = ref(false)

  async function onClickAuth () {
    try {
      isLoading.value = true
      setupPostAuthRedirect()

      if (!wallet.value || !signer.value) {
        await connect()
      }
      if (!wallet.value || !signer.value) {
        return
      }

      const signature = await signMessageMemo(
        'authorize',
        ['read:nftbook', 'write:nftbook', 'read:nftcollection', 'write:nftcollection']
      )

      if (!signature) {
        return
      }

      await authenticate(wallet.value, signature)
    } catch (err) {
      disconnect()
      clearSession()
      // eslint-disable-next-line no-console
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
      clearPostAuthRedirect()
    }
  }

  return {
    isLoading,
    onClickAuth
  }
}
