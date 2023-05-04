import { defineStore, storeToRefs } from 'pinia'
import { useWalletStore } from './wallet'
import { LIKE_CO_API } from '~/constant'

export const useBookStoreApiStore = defineStore('book-api', () => {
  const walletStore = useWalletStore()
  const { wallet: storeWallet } = storeToRefs(walletStore)
  const token = ref('')
  const wallet = ref('')

  const isAuthenticated = computed(() => storeWallet.value === wallet.value && !!token.value)

  async function authenticate (inputWallet: string, signature: any) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/wallet/authorize`, {
      method: 'POST',
      body: signature
    })
    if (error.value) { throw error.value }
    if ((!data?.value as any)?.token) { throw new Error('INVALID_SIGNATURE') }
    token.value = (data.value as any).token
    wallet.value = inputWallet
  }

  function newBookListing (classId: string, payload: any) {
    const { error, data } = useFetch(`${LIKE_CO_API}/likernft/book/store/${classId}/new`, {
      method: 'POST',
      body: payload,
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    if (error.value) {
      throw error.value
    }
    return data
  }

  return {
    token,
    wallet,
    isAuthenticated,
    authenticate,
    newBookListing
  }
})
