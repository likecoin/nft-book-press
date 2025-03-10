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

  const listingList = ref([] as any[])
  const moderatedBookList = ref([] as any[])
  const getTotalPendingNFTCount = computed(() => listingList.value.reduce((acc, item) => acc + (item.pendingNFTCount || 0), 0))

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
      if (!session) { return }

      const { token: sessionToken, wallet } = session

      if (!checkJwtTokenValidity(sessionToken)) {
        throw new Error('INVALID_TOKEN')
      }

      token.value = sessionToken
      sessionWallet.value = wallet

      if (wallet) {
        await walletStore.restoreSession()
      }
    } finally {
      isRestoringSession.value = false
    }
  }

  async function authenticate (inputWallet: string, signature: any) {
    const data = await $fetch(`${LIKE_CO_API}/wallet/authorize`, {
      method: 'POST',
      body: {
        expiresIn: '7d',
        ...signature
      }
    })
    if ((!data as any)?.token) { throw new Error('INVALID_SIGNATURE') }
    token.value = (data as any).token
    sessionWallet.value = inputWallet
    saveAuthSession({ wallet: inputWallet, token: token.value })
  }

  async function fetchBookListing (params: { key?: number, limit?: number } = {}) {
    const qsPayload: any = {
      wallet: sessionWallet.value,
      limit: params.limit || 100
    }
    if (params.key) {
      qsPayload.key = params.key
    }
    const data = await $fetch(`${LIKE_CO_API}/likernft/book/store/list?${Object.entries(qsPayload).map(([key, value]) => `${key}=${value}`).join('&')}`,
      {
        headers: {
          authorization: token.value ? `Bearer ${token.value}` : ''
        }
      })

    const { nextKey, list = [] } = (data as any) || {}
    if (params.key) {
      listingList.value.push(...list)
    } else {
      listingList.value = list
    }

    if (nextKey) {
      return fetchBookListing({ key: nextKey })
    }
  }

  async function fetchModeratedBookList () {
    const data = await $fetch(`${LIKE_CO_API}/likernft/book/store/list/moderated?wallet=${sessionWallet.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    moderatedBookList.value = (data as any)?.list || []
  }

  function reduceListingPendingNFTCountById (classId: string, count: number) {
    const targetIndex = listingList.value.findIndex(item => item.classId === classId)
    if (targetIndex === -1) {
      return
    }
    const targetItem = listingList.value[targetIndex]
    targetItem.pendingNFTCount -= count
  }

  async function newBookListing (classId: string, payload: any) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/book/store/${classId}/new`, {
      method: 'POST',
      body: payload,
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    return data
  }

  async function updateBookListingSetting (classId: string, payload: any) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/book/store/${classId}/settings`, {
      method: 'POST',
      body: payload,
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    return data
  }

  async function updateEditionPrice (classId: string, priceIndex:any, payload: any) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/book/store/${classId}/price/${priceIndex}`, {
      method: 'PUT',
      body: payload,
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    return data
  }

  async function addEditionPrice (classId: string, priceIndex: string, payload: any) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/book/store/${classId}/price/${priceIndex}`, {
      method: 'POST',
      body: payload,
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    return data
  }

  return {
    token,
    wallet: sessionWallet,
    listingList,
    moderatedBookList,
    getTotalPendingNFTCount,
    isAuthenticated,
    isRestoringSession,
    clearSession,
    restoreAuthSession,
    authenticate,
    fetchBookListing,
    fetchModeratedBookList,
    reduceListingPendingNFTCountById,
    newBookListing,
    updateBookListingSetting,
    updateEditionPrice,
    addEditionPrice
  }
})
