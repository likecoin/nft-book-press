import { defineStore, storeToRefs } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { useWalletStore } from './wallet'

export const useBookStoreApiStore = defineStore('book-api', () => {
  const { LIKE_CO_API } = useRuntimeConfig().public
  const walletStore = useWalletStore()
  const { wallet: storeWallet } = storeToRefs(walletStore)
  const token = ref('')
  const sessionWallet = ref('')
  const isRestoringSession = ref(false)

  const isAuthenticated = computed(() => {
    const isWalletMatch = storeWallet.value === sessionWallet.value
    const tokenExists = !!token.value
    if (!isWalletMatch || !tokenExists) { return false }
    const decoded = jwtDecode(token.value)
    if (!decoded) {
      return false
    }
    const isExpired = decoded.exp && decoded.exp * 1000 < Date.now()
    return !isExpired
  })

  function clearSession () {
    token.value = ''
    sessionWallet.value = ''
    clearAuthSession()
  }

  async function restoreAuthSession () {
    try {
      isRestoringSession.value = true
      const session = loadAuthSession()
      if (session) {
        token.value = session.token
        sessionWallet.value = session.wallet
        if (session.wallet) {
          await walletStore.restoreSession()
        }
      }
    } finally {
      isRestoringSession.value = false
    }
  }

  async function authenticate (inputWallet: string, signature: any) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/wallet/authorize`, {
      method: 'POST',
      body: {
        expiresIn: '7d',
        ...signature
      }
    })
    if (error.value) { throw error.value }
    if ((!data?.value as any)?.token) { throw new Error('INVALID_SIGNATURE') }
    token.value = (data.value as any).token
    sessionWallet.value = inputWallet
    saveAuthSession({ wallet: inputWallet, token: token.value })
  }

  async function newBookListing (classId: string, payload: any) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/book/store/${classId}/new`, {
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

  async function updateBookListingSetting (classId: string, payload: any) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/book/store/${classId}/settings`, {
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

  async function updateEditionPrice (classId: string, priceIndex:any, payload: any) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/book/store/${classId}/price/${priceIndex}`, {
      method: 'PUT',
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

  async function addEditionPrice (classId: string, priceIndex: string, payload: any) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/book/store/${classId}/price/${priceIndex}`, {
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
    wallet: sessionWallet,
    isAuthenticated,
    isRestoringSession,
    clearSession,
    restoreAuthSession,
    authenticate,
    newBookListing,
    updateBookListingSetting,
    updateEditionPrice,
    addEditionPrice
  }
})
