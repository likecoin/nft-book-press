import { defineStore } from 'pinia'
import stringify from 'fast-json-stable-stringify'
import {
  Window as KeplrWindow,
  AccountData,
  OfflineAminoSigner,
  OfflineDirectSigner
} from '@keplr-wallet/types'
import type {
  LikeCoinWalletConnector,
  LikeCoinWalletConnectorConnectionResult,
  LikeCoinWalletConnectorMethodType
} from '@likecoin/wallet-connector'

import network from '@/constant/network'
import { IS_TESTNET, SITE_URL } from '~/constant'

declare global {
  interface Window extends KeplrWindow {}
}

export const useWalletStore = defineStore('wallet', () => {
  const accounts = ref([] as readonly AccountData[])
  const signer = ref(null as (OfflineAminoSigner & OfflineDirectSigner) | null)

  const wallet = computed(() => accounts.value[0]?.address)
  const isConnected = computed(() => !!wallet.value)
  const connector = ref(null as (LikeCoinWalletConnector | null) | null)

  async function initConnector () {
    const {
      chainId,
      chainName,
      rpc,
      rest
    } = network
    const likecoinWalletLib = await import('@likecoin/wallet-connector')
    const { LikeCoinWalletConnector, LikeCoinWalletConnectorMethodType } = likecoinWalletLib
    const con = new LikeCoinWalletConnector({
      chainId,
      chainName,
      rpcURL: rpc,
      restURL: rest,
      coinType: network.bip44.coinType,
      coinDenom: network.currencies[0].coinDenom,
      coinMinimalDenom: network.currencies[0].coinMinimalDenom,
      coinDecimals: network.currencies[0].coinDecimals,
      coinGeckoId: network.currencies[0]?.coinGeckoId,
      bech32PrefixAccAddr: network.bech32Config.bech32PrefixAccAddr,
      bech32PrefixAccPub: network.bech32Config.bech32PrefixAccPub,
      bech32PrefixValAddr: network.bech32Config.bech32PrefixValAddr,
      bech32PrefixValPub: network.bech32Config.bech32PrefixValPub,
      bech32PrefixConsAddr: network.bech32Config.bech32PrefixConsAddr,
      bech32PrefixConsPub: network.bech32Config.bech32PrefixConsPub,
      availableMethods: [
        LikeCoinWalletConnectorMethodType.LikerId,
        LikeCoinWalletConnectorMethodType.Keplr,
        LikeCoinWalletConnectorMethodType.KeplrMobile,
        LikeCoinWalletConnectorMethodType.Cosmostation,
        LikeCoinWalletConnectorMethodType.LikerLandApp,
        LikeCoinWalletConnectorMethodType.Leap,
        LikeCoinWalletConnectorMethodType.MetaMaskLeap,
        LikeCoinWalletConnectorMethodType.CosmostationMobile
      ],
      keplrSignOptions: {
        disableBalanceCheck: true,
        preferNoSetFee: true,
        preferNoSetMemo: true
      },
      keplrInstallURLOverride: 'https://www.keplr.app/download',
      keplrInstallCTAPreset: 'fancy-banner',
      cosmostationDirectSignEnabled: true,
      connectWalletTitle: 'Login',
      connectWalletMobileWarning: 'Mobile Warning',
      language: 'en',
      authcoreApiHost: IS_TESTNET
        ? 'https://likecoin-integration-test.authcore.io'
        : 'https://authcore.like.co',
      authcoreRedirectUrl: `${SITE_URL}/auth/redirect?method=${LikeCoinWalletConnectorMethodType.LikerId}`
    })
    return con
  }

  async function connect () {
    if (!connector.value) {
      connector.value = await initConnector()
    }
    const session = connector.value.restoreSession()
    let connection: LikeCoinWalletConnectorConnectionResult | null = null
    if (session) {
      try {
        const result = await connector.value.initIfNecessary()
        if (result) { connection = result }
      } catch (e) {
        console.error(e)
      }
    }
    if (!connection) {
      const result = await connector.value.openConnectionMethodSelectionDialog()
      if (result) { connection = result }
    }
    if (connection) { await handleConnection(connection) }
  }

  function handleConnection (connection: LikeCoinWalletConnectorConnectionResult) {
    if (!connection) { return }
    accounts.value = connection.accounts
    signer.value = connection.offlineSigner as (OfflineAminoSigner & OfflineDirectSigner)
  }

  async function handleConnectorRedirect (
    { method, params }: { method: string, params: string }
  ) {
    if (!connector.value) {
      connector.value = await initConnector()
    }
    const connection = await connector.value.handleRedirect(method as LikeCoinWalletConnectorMethodType, params)
    if (connection) { await handleConnection(connection as LikeCoinWalletConnectorConnectionResult) }
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
    if (!signer.value.signAmino) { throw new Error('SIGNER_NOT_SUPPORT_AMINO') }
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
    connector.value?.disconnect()
  }

  return {
    accounts,
    signer,
    wallet,
    isConnected,
    connect,
    disconnect,
    handleConnectorRedirect,
    signMessageMemo
  }
})
