import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'

export function useAuth () {
  const bookStoreApiStore = useBookStoreApiStore()
  const store = useWalletStore()
  const { wallet, signer } = storeToRefs(store)
  const { disconnect, signMessageMemo, openConnectWalletModal, initWallet } = store
  const { authenticate, clearSession } = bookStoreApiStore
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
      isAuthenticating.value = false
      clearPostAuthRedirect()
    }
  }

  return {
    isAuthenticating,
    onAuthenticate
  }
}
