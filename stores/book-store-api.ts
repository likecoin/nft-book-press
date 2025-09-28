import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useBookstoreApiStore = defineStore('book-api', () => {
  const { LIKE_CO_API } = useRuntimeConfig().public
  const { fetch: refreshSession, loggedIn: hasLoggedIn, user } = useUserSession()

  const token = computed(() => user.value?.token)
  const sessionWallet = computed(() => user.value?.evmWallet || user.value?.likeWallet)
  const intercomToken = computed(() => user.value?.intercomToken)

  const isRestoringSession = ref(false)

  const isShowLoginPanel = ref(false)

  const listingList = ref([] as any[])
  const moderatedBookList = ref([] as any[])
  const getTotalPendingNFTCount = computed(() => listingList.value.reduce((acc, item) => acc + (item.pendingNFTCount || 0), 0))

  const isAuthenticated = computed(() => {
    if (!hasLoggedIn.value) { return false }
    const tokenExists = !!token.value
    if (!tokenExists) { return false }
    const decoded = jwtDecode(token.value)
    if (!decoded) {
      return false
    }
    const isExpired = decoded.exp && decoded.exp * 1000 < Date.now()
    return !isExpired
  })

  function openLoginPanel () {
    isShowLoginPanel.value = true
  }

  function closeLoginPanel () {
    isShowLoginPanel.value = false
  }

  async function restoreAuthSession () {
    await refreshSession()
  }

  async function authenticate (signature: any) {
    const data = await $fetch(`${LIKE_CO_API}/wallet/authorize`, {
      method: 'POST',
      body: {
        ...signature
      }
    })
    if ((!data as any)?.token) { throw new Error('INVALID_SIGNATURE') }
    const authorizeToken = (data as any).token
    const authorizeIntercomToken = (data as any).intercomToken
    const authorizeJwtid = (data as any).jwtid

    return { jwtid: authorizeJwtid, intercomToken: authorizeIntercomToken, token: authorizeToken }
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

  async function refreshBookMetadata (classId: string) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/book/store/class/${classId}/refresh`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    return data
  }

  async function uploadSignImages (payload : FormData, classId: string) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/book/store/${classId}/image/upload`, {
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
    intercomToken,
    listingList,
    moderatedBookList,
    getTotalPendingNFTCount,
    isAuthenticated,
    isRestoringSession,
    isShowLoginPanel,
    openLoginPanel,
    closeLoginPanel,
    restoreAuthSession,
    authenticate,
    fetchBookListing,
    fetchModeratedBookList,
    reduceListingPendingNFTCountById,
    newBookListing,
    updateBookListingSetting,
    updateEditionPrice,
    addEditionPrice,
    refreshBookMetadata,
    uploadSignImages
  }
})
