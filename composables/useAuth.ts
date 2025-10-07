import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { SIGN_AUTHORIZATION_PERMISSIONS } from '~/utils/auth'

export function useAuth () {
  const bookstoreApiStore = useBookstoreApiStore()
  const store = useWalletStore()
  const { wallet, isConnected } = storeToRefs(store)
  const { connect, disconnect, signMessageMemo } = store
  const { authenticate, clearSession, fetchBookListing } = bookstoreApiStore
  const { intercomToken } = storeToRefs(bookstoreApiStore)
  const toast = useToast()
  const { t: $t } = useI18n()

  const isAuthenticating = ref(false)
  const loginStatus = ref<string | undefined>('')

  const onAuthenticate = async (connectorId = 'magic') => {
    let connectResult: any
    loginStatus.value = $t('auth_state.connecting')

    try {
      isAuthenticating.value = true
      setupPostAuthRedirect()

      if (!wallet.value) {
        connectResult = await connect(connectorId)
      }
      if (!wallet.value) {
        return
      }

      if (!connectResult) {
        clearSession()
        if (isConnected.value) {
          await disconnect()
        }
        return
      }

      const { walletAddress, email, loginMethod, magicUserId, magicDIDToken } = connectResult
      let isRegistered = await store.checkIsRegistered({ walletAddress, email, magicDIDToken, loginMethod })

      if (!isRegistered) {
        const maxRetries = 2
        let retryCount = 0

        while (retryCount < maxRetries && !isRegistered) {
          try {
            isRegistered = await store.register({ walletAddress, email, loginMethod, magicUserId, magicDIDToken })
            if (isRegistered) {
              break
            }
            return
          } catch (error) {
            retryCount++
            toast.add({
              icon: 'i-heroicons-exclamation-circle',
              title: (error as Error).toString(),
              timeout: 10000,
              color: 'red',
              ui: {
                title: 'text-red-400 dark:text-red-400'
              }
            })

            if (retryCount >= maxRetries) {
              if (window.Intercom) {
                window.Intercom('showNewMessage', $t('intercom.registration_failed_message', {
                  walletAddress
                }))
              }
              break
            }

            continue
          }
        }

        if (!isRegistered) {
          return
        }
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
      loginStatus.value = $t('auth_state.success')
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
      loginStatus.value = ''
      clearPostAuthRedirect()
    }
  }

  return {
    isAuthenticating,
    onAuthenticate,
    loginStatus
  }
}
