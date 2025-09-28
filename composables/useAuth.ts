import { storeToRefs } from 'pinia'
import { FetchError } from 'ofetch'

import { useWalletStore } from '~/stores/wallet'
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { SIGN_AUTHORIZATION_PERMISSIONS } from '~/utils/auth'

export function useAuth () {
  const bookstoreApiStore = useBookstoreApiStore()
  const store = useWalletStore()
  const { wallet, signer, isConnected } = storeToRefs(store)
  const { connect, disconnect, signMessageMemo } = store
  const { fetch: refreshSession } = useUserSession()

  const { authenticate, fetchBookListing } = bookstoreApiStore
  const toast = useToast()

  const isAuthenticating = ref(false)
  const email = ref<string | undefined>('')
  const loginMethod = ref<string | undefined>('')

  const onAuthenticate = async (connectorId = 'magic') => {
    try {
      isAuthenticating.value = true

      if (!wallet.value || !signer.value) {
        const data = await connect(connectorId)
        email.value = data?.email
        loginMethod.value = data?.loginMethod
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

      if (!wallet.value) {
        throw new Error('Wallet not available')
      }

      const { jwtid, intercomToken, token } = await authenticate(signature)
      if (window.Intercom && intercomToken) {
        window.Intercom('update', {
          intercom_user_jwt: intercomToken,
          session_duration: 2592000000, // 30d
          evm_wallet: wallet.value
        })
      }

      await $fetch('/api/login', {
        method: 'POST',
        body: {
          walletAddress: signature.wallet,
          signature,
          message: signature.message,
          loginMethod: loginMethod.value,
          email: email.value,
          intercomToken,
          token,
          jwtid,
          expiresIn: '30d'
        }
      })

      await refreshSession()

      try {
        await fetchBookListing()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    } catch (err) {
      if (isConnected.value) {
        await disconnect()
      }
      if (err instanceof FetchError) {
        // eslint-disable-next-line no-console
        console.error(err)
        toast.add({
          icon: 'i-heroicons-exclamation-circle',
          title: err.data?.message || err.data,
          timeout: 0,
          color: 'red',
          ui: {
            title: 'text-red-400 dark:text-red-400'
          }
        })
      }
    } finally {
      isAuthenticating.value = false
    }
  }

  return {
    isAuthenticating,
    onAuthenticate
  }
}
