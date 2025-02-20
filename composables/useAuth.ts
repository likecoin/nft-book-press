import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useCollectionStore } from '~/stores/collection'

export function useAuth () {
  const bookStoreApiStore = useBookStoreApiStore()
  const collectionStore = useCollectionStore()
  const store = useWalletStore()
  const { wallet, signer } = storeToRefs(store)
  const { connect, signMessageMemo } = store
  const { authenticate, clearSession, fetchBookListing } = bookStoreApiStore
  const { listNFTBookCollections } = collectionStore
  const toast = useToast()

  const isAuthenticating = ref(false)

  const onAuthenticate = async () => {
    try {
      isAuthenticating.value = true
      setupPostAuthRedirect()

      if (!wallet.value || !signer.value) {
        connect()
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
      await Promise.all([
        fetchBookListing(),
        listNFTBookCollections()
      ])
    } catch (err) {
      // disconnect()
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
      isAuthenticating.value = false
      clearPostAuthRedirect()
    }
  }

  return {
    isAuthenticating,
    onAuthenticate
  }
}
