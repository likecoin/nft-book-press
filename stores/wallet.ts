import { defineStore } from 'pinia'
import stringify from 'fast-json-stable-stringify'
import {
  Window as KeplrWindow,
  AccountData,
  OfflineAminoSigner,
  OfflineDirectSigner
} from '@keplr-wallet/types'
import network from '@/constant/network'

declare global {
  interface Window extends KeplrWindow {}
}

export const useWalletStore = defineStore('wallet', () => {
  const accounts = ref([] as readonly AccountData[])
  const signer = ref(null as (OfflineAminoSigner & OfflineDirectSigner) | null)

  const wallet = computed(() => accounts.value[0]?.address)
  const isConnected = computed(() => !!wallet.value)

  async function connect () {
    if (!window.keplr) { return }
    const { keplr } = window
    await keplr.experimentalSuggestChain(network)
    await keplr.enable(network.chainId)
    if (!window.getOfflineSigner) { throw new Error('CANNOT_FIND_OFFLINE_SIGNER') }
    const offlineSigner = window.getOfflineSigner(network.chainId)
    signer.value = offlineSigner
    const acc = await offlineSigner.getAccounts()
    accounts.value = acc
  }

  async function signMessageMemo (action: string, permissions?: string[]) {
    if (!signer.value || !wallet.value) {
      await connect()
    }
    if (!signer.value || !wallet.value) {
      throw new Error('WALLET_NOT_INITED')
    }
    const ts = Date.now()
    const payload = JSON.stringify({
      action,
      permissions,
      likeWallet: wallet.value,
      ts
    })
    const signingPayload = {
      chain_id: network.chainId,
      memo: payload,
      msgs: [],
      fee: {
        gas: '0',
        amount: [
          {
            denom: network.feeCurrencies[0].coinDenom,
            amount: '0'
          }
        ]
      },
      sequence: '0',
      account_number: '0'
    }
    const { signed, signature } = await signer.value.signAmino(wallet.value, signingPayload)
    return {
      signature: signature.signature,
      publicKey: signature.pub_key.value,
      message: stringify(signed),
      wallet: wallet.value,
      signMethod: 'memo',
      expiresIn: '1d'
    }
  }

  function disconnect () {
    signer.value = null
    accounts.value = []
  }

  return {
    accounts,
    signer,
    wallet,
    isConnected,
    connect,
    disconnect,
    signMessageMemo
  }
})
