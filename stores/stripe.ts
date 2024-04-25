import { defineStore } from 'pinia'
import { LIKE_CO_API } from '~/constant'

export const useStripeStore = defineStore('stripe-connect', () => {
  const stripeConnectStatusWalletMap = ref({} as Record<string, any>)

  async function fetchStripeConnectStatus (wallet: string) {
    stripeConnectStatusWalletMap.value[wallet] = { isReady: false }
    const { data, error } = await useFetch(
        `${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${wallet}`
    )
    stripeConnectStatusWalletMap.value[wallet] = (data?.value as any) || {}
    if (error.value) {
      throw new Error(error.value?.data.toString())
    }
  }

  return {
    fetchStripeConnectStatus,
    stripeConnectStatusWalletMap
  }
})
