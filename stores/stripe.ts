import { defineStore, storeToRefs } from 'pinia'

import { useBookStoreApiStore } from '~/stores/book-store-api'

interface StripeConnectStatus {
  hasAccount: boolean
  isReady: boolean
  email?: string
  stripeConnectAccountId?: string
}

function getStripeConnectStatusDefault (): StripeConnectStatus {
  return {
    isReady: false,
    hasAccount: false,
    email: '',
    stripeConnectAccountId: ''
  }
}

export const useStripeStore = defineStore('stripe-connect', () => {
  const { LIKE_CO_API } = useRuntimeConfig().public

  const bookStoreApiStore = useBookStoreApiStore()
  const { token } = storeToRefs(bookStoreApiStore)

  const stripeConnectStatusWalletMap = ref({} as Record<string, StripeConnectStatus>)

  const getStripeConnectStatusByWallet = computed(() => (wallet: string) => {
    return stripeConnectStatusWalletMap.value[wallet] || getStripeConnectStatusDefault()
  })

  async function fetchStripeConnectStatusByWallet (wallet: string) {
    if (!stripeConnectStatusWalletMap.value[wallet]) {
      stripeConnectStatusWalletMap.value[wallet] = getStripeConnectStatusDefault()
    }
    const data = await $fetch<StripeConnectStatus>(`${LIKE_CO_API}/likernft/book/user/connect/status`, {
      headers: {
        authorization: `Bearer ${token.value}`
      },
      query: {
        wallet
      }
    })
    if (!data) {
      return stripeConnectStatusWalletMap.value[wallet]
    }
    stripeConnectStatusWalletMap.value[wallet] = data
    return data
  }

  return {
    stripeConnectStatusWalletMap,
    getStripeConnectStatusByWallet,
    fetchStripeConnectStatusByWallet
  }
})
