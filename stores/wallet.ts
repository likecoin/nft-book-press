import { defineStore } from 'pinia'
import { FetchError } from 'ofetch'
import { useAccount, useConnect, useDisconnect, useSignMessage } from '@wagmi/vue'
import { optimism, optimismSepolia } from '@wagmi/vue/chains'
import { checksumAddress, UserRejectedRequestError } from 'viem'
import type { Magic } from 'magic-sdk'
import { clearUploadFileData } from '~/utils/uploadFile'
import { RegistrationModal, ErrorModal } from '#components'

export const useWalletStore = defineStore('wallet', () => {
  const { connectors, connectAsync: wagmiConnect, status } = useConnect()
  const { disconnectAsync: wagmiDisconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { LIKECOIN_V3_BOOK_MIGRATION_SITE_URL } = useRuntimeConfig().public
  const modal = useModal()

  const REGISTER_TIME_LIMIT_IN_TS = 15 * 60 * 1000 // 15 minutes

  const isLoginLoading = ref(false)

  const wallet = computed(() => address.value ? checksumAddress(address.value) : undefined)

  const getLikeCoinV3BookMigrationSiteURL = computed(() => ({ utmSource }: { utmSource?: string } = {}) => {
    const { locale } = useI18n()

    let baseUrl = LIKECOIN_V3_BOOK_MIGRATION_SITE_URL
    if (locale.value === 'en') {
      baseUrl = `${LIKECOIN_V3_BOOK_MIGRATION_SITE_URL}/en`
    }

    const migrationURL = appendUTMParamsToURL({
      url: baseUrl,
      source: `publish_${utmSource}`,
      medium: 'publish'
    })

    return migrationURL.toString()
  })

  async function initIfNecessary () {
    if (!isConnected.value) {
      await connect()
    }
  }

  async function connect (connectorId = 'magic') {
    try {
      // Disconnect any existing connection
      await wagmiDisconnect()

      const { IS_TESTNET } = useRuntimeConfig().public
      const chainId = IS_TESTNET ? optimismSepolia.id : optimism.id
      const connector = connectors.find(
        (c: { id: string }) => c.id === connectorId
      )
      if (!connector) { return }
      await wagmiConnect({ connector, chainId })

      isLoginLoading.value = true

      const walletAddress = address.value
      if (status.value !== 'success' || !walletAddress) {
        throw createError({
          statusCode: 400,
          message: $t('error_connect_wallet_failed'),
          fatal: true
        })
      }

      // Get email from Magic SDK if using Magic Link
      let email: string | undefined
      let magicUserId: string | undefined
      let magicDIDToken: string | undefined
      const loginMethod = connector.id
      if (loginMethod === 'magic' && 'magic' in connector) {
        const magic = connector.magic as Magic
        try {
          const userInfo = await magic.user.getInfo()
          if (userInfo.email) {
            email = userInfo.email
          }
          if (userInfo.issuer) {
            magicUserId = userInfo.issuer
          }
          magicDIDToken = await magic.user.getIdToken()
        } catch (error) {
          console.warn('Failed to fetch user info from Magic SDK', error)
        }
      }

      let isRegistered = await checkIsRegistered({ walletAddress, email, magicDIDToken, loginMethod })
      if (!isRegistered) {
        isRegistered = await register({ walletAddress, email, loginMethod, magicUserId, magicDIDToken })
        if (!isRegistered) {
        // User canceled the registration
        }
      }

      // To proceed with the authenticated flow
      return { email, loginMethod }
    } catch (error) {
      await wagmiDisconnect().catch(() => {
      })

      if (error instanceof UserRejectedRequestError) {
        return
      }
      if (error instanceof FetchError && error.data?.message === 'EMAIL_ALREADY_USED') {
        return
      }
      console.error('Failed to connect wallet', error)
      return connect()
    }
  }

  async function signMessageMemo (action: string, permissions?: readonly string[]) {
    if (!wallet.value) {
      await connect()
    }
    if (!wallet.value) {
      throw new Error('WALLET_NOT_INITED')
    }
    const ts = Date.now()
    const payload = JSON.stringify({
      action,
      permissions,
      evmWallet: wallet.value,
      ts
    })
    const signed = await signMessageAsync({ message: payload })
    return {
      signature: signed,
      message: payload,
      wallet: wallet.value,
      signMethod: 'personal_sign',
      expiresIn: '7d'
    }
  }

  function disconnect () {
    clearUploadFileData()
    return wagmiDisconnect()
  }

  async function checkIsRegistered ({
    walletAddress,
    email,
    magicDIDToken,
    loginMethod
  }: {
    walletAddress: string
    email?: string
    magicDIDToken?: string
    loginMethod: string
  }) {
    try {
      const userInfoRes = await useFetchLikerInfoByWallet(walletAddress, { nocache: true })
      if (userInfoRes?.user) {
        // If user info is fetched successfully, it means the wallet address is registered
        return true
      }
    } catch (error) {
      if (!(error instanceof FetchError && error.statusCode === 404)) {
        console.warn(`Failed to fetch user info for wallet ${walletAddress} in account refresh`, error)
      }
    }
    try {
      await fetchUserRegisterCheck({ walletAddress, email, magicDIDToken })
      // If the request succeeds, it means there is no account associated with the wallet address and email
      return false
    } catch (error) {
      if (error instanceof FetchError) {
        switch (error.data?.error) {
          case 'EMAIL_ALREADY_USED':
            if (!error.data?.evmWallet && error.data?.likeWallet) {
              try {
                const message = JSON.stringify({
                  action: 'migrate',
                  evmWallet: walletAddress,
                  email,
                  magicDIDToken,
                  ts: Date.now()
                }, null, 2)
                const signature = await signMessageAsync({ message })
                const res = await migrateMagicEmailUser({
                  wallet: walletAddress,
                  signature,
                  message
                })
                if (res.isMigratedLikerId) {
                  return true
                }
              } catch (e) {

              }
            }
            modal.open(ErrorModal, getEmailAlreadyUsedErrorData({
              email: email as string,
              walletAddress,
              boundEVMWallet: error.data?.evmWallet,
              boundLikeWallet: error.data?.likeWallet,
              loginMethod
            }))
            break

          case 'EVM_WALLET_ALREADY_EXIST':
            // Already registered
            return true

          default:
        }
      }
      throw error
    }
  }

  function getEmailAlreadyUsedErrorData ({
    email,
    walletAddress,
    boundEVMWallet,
    boundLikeWallet,
    loginMethod
  }: {
    email: string
    walletAddress: string
    boundEVMWallet?: string
    boundLikeWallet?: string
    loginMethod: string
  }) {
    const shouldMigrate = !boundEVMWallet && !!boundLikeWallet
    return {
      statusCode: 401,
      data: {
        level: 'warning',
        title: shouldMigrate
          ? $t('account_register_error_email_already_used_migrate_title')
          : $t('account_register_error_email_already_used_by_wallet_title'),
        description: getEmailAlreadyUsedErrorMessage({
          email,
          evmWallet: boundEVMWallet,
          likeWallet: boundLikeWallet
        }),
        tags: [
          { label: loginMethod, icon: 'i-material-symbols-login-rounded', class: 'font-mono' },
          { label: walletAddress, icon: 'i-material-symbols-key-outline-rounded', class: 'font-mono' }
        ],
        actions: shouldMigrate
          ? [{
              label: $t('account_register_error_contact_support'),
              color: 'secondary',
              variant: 'subtle',
              onClick: async () => {
                await navigateTo(getLikeCoinV3BookMigrationSiteURL.value({ utmSource: 'login_email_already_used' }), {
                  external: true,
                  open: { target: '_blank' }
                })
              }
            }]
          : []
      }
    }
  }

  async function register ({
    walletAddress,
    email: prefilledEmail,
    loginMethod,
    magicUserId,
    magicDIDToken
  }: {
    walletAddress: string
    email?: string
    loginMethod: string
    magicUserId?: string
    magicDIDToken?: string
  }) {
    let tempAccountId = generateAccountIdFromWalletAddress(walletAddress)
    try {
      await fetchUserRegisterCheck({ accountId: tempAccountId })
    } catch (error) {
      if (error instanceof FetchError && error.data?.error === 'USER_ALREADY_EXIST') {
        tempAccountId = error.data.alternative as string
      } else {
        throw error
      }
    }

    const startTime = Date.now()
    let hasError = false
    const payload = {
      accountId: tempAccountId,
      email: prefilledEmail
    }

    // Loop until registration is successful, user cancels or timeout
    do {
      // Check if registration time exceeds the limit
      if (Date.now() - startTime > REGISTER_TIME_LIMIT_IN_TS) {
        throw createError({
          statusCode: 408,
          data: { description: $t('account_register_timeout') }
        })
      }

      try {
        // Skip registration modal if email is provided
        if (!payload.email || hasError) {
          type ModalResult = { accountId: string; email: string; displayName?: string }
          let modalResult: ModalResult | null = null
          let userCanceled = false

          await new Promise<void>((resolve) => {
            modal.open(RegistrationModal, {
              email: payload?.email,
              accountId: payload?.accountId,
              isAccountIdHidden: true,
              isDisplayNameHidden: true,
              onSubmit: (data: ModalResult) => {
                modalResult = data
                modal.close()
                resolve()
              },
              onClose: () => {
                userCanceled = true
                modal.close()
                resolve()
              }
            })
          })

          if (userCanceled || !modalResult) {
            // User canceled the registration, return false immediately
            return false
          }
          const result = modalResult as ModalResult
          payload.accountId = result.accountId
          payload.email = result.email
        }
        hasError = false

        // Prepare signature for registration
        const message = JSON.stringify(
          {
            action: 'register',
            evmWallet: walletAddress,
            email: payload.email,
            ts: Date.now()
          },
          null,
          2
        )

        const signature = await signMessageAsync({ message })

        await $fetch('/api/register', {
          method: 'POST',
          body: {
            walletAddress,
            signature,
            message,
            email: payload.email,
            accountId: payload.accountId,
            loginMethod,
            magicUserId,
            magicDIDToken
          }
        })

        return true
      } catch (error) {
        hasError = true
        if (error instanceof FetchError) {
          switch (error.data?.message) {
            case 'INVALID_USER_ID': {
              await modal.open(ErrorModal, { description: $t('account_register_error_invalid_account_id', { id: payload?.accountId }) })
              continue
            }
            case 'EMAIL_ALREADY_USED': {
              await modal.open(ErrorModal, getEmailAlreadyUsedErrorData({
                email: payload?.email as string,
                walletAddress,
                boundEVMWallet: error.data?.evmWallet,
                boundLikeWallet: error.data?.likeWallet,
                loginMethod
              }))
              continue
            }
            default:
          }
        }
        throw error
      }
    } while (hasError)
    return false
  }

  return {
    wallet,
    signer: ref({}),
    isConnected,
    isLoginLoading,
    initIfNecessary,
    connect,
    disconnect,
    signMessageMemo,
    checkIsRegistered,
    register
  }
})
