import { defineStore } from 'pinia'
import { LIKE_CO_API } from '~/constant'

export const useStripeStore = defineStore('stripe-connect', () => {
  const stripeConnectStatusWalletMap = ref({} as Record<string, any>)

  async function fetchStripeConnectStatus (wallet: string) {
    stripeConnectStatusWalletMap.value[wallet] = { isReady: false }
    const connectStatusData = await useFetch(
        `${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${wallet}`
    )
    stripeConnectStatusWalletMap.value[wallet] = (connectStatusData?.data?.value as any) || {}
  }

  return {
    fetchStripeConnectStatus,
    stripeConnectStatusWalletMap
  }
})
