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
      if (error.value.statusCode !== 404) {
        throw new Error(error.value?.data.toString())
      }
      // eslint-disable-next-line no-console
      console.error('STRIPE_CONNECT_INFO_NOT_FOUND')
    }
  }

  return {
    fetchStripeConnectStatus,
    stripeConnectStatusWalletMap
  }
})
