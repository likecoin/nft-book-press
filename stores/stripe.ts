import { defineStore, storeToRefs } from 'pinia'
import { LIKE_CO_API } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'

export const useStripeStore = defineStore('stripe-connect', () => {
  const bookStoreApiStore = useBookStoreApiStore()
  const { token } = storeToRefs(bookStoreApiStore)

  const stripeConnectStatusWalletMap = ref({} as Record<string, any>)

  async function fetchStripeConnectStatus (wallet: string) {
    stripeConnectStatusWalletMap.value[wallet] = { isReady: false }
    const { data, error } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${wallet}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
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
