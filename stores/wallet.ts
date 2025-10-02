import { defineStore } from 'pinia'
import { useAccount, useConnect, useDisconnect, useSignMessage } from '@wagmi/vue'
import { optimism, optimismSepolia } from '@wagmi/vue/chains'
import { checksumAddress } from 'viem'
import { clearUploadFileData } from '~/utils/uploadFile'

export const useWalletStore = defineStore('wallet', () => {
  const { connectors, connectAsync: wagmiConnect } = useConnect()
  const { disconnectAsync: wagmiDisconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const bookstoreApiStore = useBookstoreApiStore()
  const { wallet: sessionWallet } = storeToRefs(bookstoreApiStore)

  const { t: $t } = useI18n()
  const toast = useToast()

  const wallet = computed(() => address.value ? checksumAddress(address.value) : undefined)

  async function initIfNecessary () {
    if (!isConnected.value) {
      await connect()
    }
  }

  async function validateWalletConsistency () {
    await initIfNecessary()

    if (wallet.value && sessionWallet.value && wallet.value !== sessionWallet.value) {
      toast.add({
        icon: 'i-heroicons-exclamation-triangle',
        title: $t('wallet_changed_warning', {
          current: wallet.value.slice(0, 6) + '...',
          session: sessionWallet.value.slice(0, 6) + '...'
        }),
        timeout: 3000,
        color: 'amber',
        ui: {
          title: 'text-amber-600 dark:text-amber-400'
        }
      })

      bookstoreApiStore.clearSession()
      await disconnect()

      throw new Error('WALLET_NOT_MATCH')
    }

    return true
  }

  async function connect (connectorId = 'magic') {
    const { IS_TESTNET } = useRuntimeConfig().public
    const chainId = IS_TESTNET ? optimismSepolia.id : optimism.id
    const connector = connectors.find(
      (c: { id: string }) => c.id === connectorId
    )
    if (!connector) { return }
    await wagmiConnect({ connector, chainId })
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

  return {
    wallet,
    signer: ref({}),
    isConnected,
    initIfNecessary,
    validateWalletConsistency,
    connect,
    disconnect,
    signMessageMemo
  }
})
