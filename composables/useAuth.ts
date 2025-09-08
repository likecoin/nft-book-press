import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { SIGN_AUTHORIZATION_PERMISSIONS } from '~/utils/auth'

export function useAuth () {
  const bookstoreApiStore = useBookstoreApiStore()
  const store = useWalletStore()
  const { wallet, signer, isConnected } = storeToRefs(store)
  const { connect, disconnect, signMessageMemo } = store
  const { authenticate, clearSession, fetchBookListing } = bookstoreApiStore
  const { intercomToken } = storeToRefs(bookstoreApiStore)
  const toast = useToast()

  const isAuthenticating = ref(false)

  const onAuthenticate = async (method = 0) => {
    try {
      isAuthenticating.value = true
      setupPostAuthRedirect()

      if (!wallet.value || !signer.value) {
        await connect(method)
      }
      if (!wallet.value || !signer.value) {
        return
      }

      const signature = await signMessageMemo(
        'authorize',
        SIGN_AUTHORIZATION_PERMISSIONS
      )

      if (!signature) {
        return
      }

      await authenticate(wallet.value, signature)
      if (window.Intercom && intercomToken.value) {
        window.Intercom('update', {
          intercom_user_jwt: intercomToken.value,
          session_duration: 2592000000, // 30d
          evm_wallet: wallet.value
        })
      }
      try {
        await fetchBookListing()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    } catch (err) {
      clearSession()
      if (isConnected.value) {
        await disconnect()
      }
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
