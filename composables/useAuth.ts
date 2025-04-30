import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useCollectionStore } from '~/stores/collection'
import { SIGN_AUTHORIZATION_PERMISSIONS } from '~/utils/auth'

export function useAuth () {
  const bookStoreApiStore = useBookStoreApiStore()
  const collectionStore = useCollectionStore()
  const store = useWalletStore()
  const { wallet, signer } = storeToRefs(store)
  const { disconnect, signMessageMemo, openConnectWalletModal, initWallet } = store
  const { authenticate, clearSession, fetchBookListing } = bookStoreApiStore
  const { listNFTBookCollections } = collectionStore
  const toast = useToast()

  const isAuthenticating = ref(false)

  async function onAuthenticate () {
    try {
      isAuthenticating.value = true
      setupPostAuthRedirect()

      if (!wallet.value || !signer.value) {
        const connection = await openConnectWalletModal()
        if (!connection) {
          throw new Error('WALLET_NOT_INITED')
        }
        await initWallet(connection)
      }

      const signature = await signMessageMemo(
        'authorize',
        SIGN_AUTHORIZATION_PERMISSIONS
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
      isAuthenticating.value = false
      clearPostAuthRedirect()
    }
  }

  return {
    isAuthenticating,
    onAuthenticate
  }
}
