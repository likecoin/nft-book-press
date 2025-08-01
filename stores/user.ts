import { defineStore, storeToRefs } from 'pinia'

import { useBookstoreApiStore } from './book-store-api'
import { useLikerStore } from './liker'

export const useUserStore = defineStore('user', () => {
  const { LIKE_CO_API } = useRuntimeConfig().public

  const bookstoreApiStore = useBookstoreApiStore()
  const { token, isAuthenticated, wallet } = storeToRefs(bookstoreApiStore)
  const likerStore = useLikerStore()

  const bookUser = ref<any>(null)
  const isUpdatingBookUserProfile = ref(false)
  const userLikerInfo = computed(() => {
    if (isAuthenticated.value && wallet.value) {
      return likerStore.getLikerInfoByWallet(wallet.value)
    }
    return null
  })
  const isFetchingUserLikerInfo = ref(false)

  async function fetchBookUserProfile () {
    const data = await $fetch(
      `${LIKE_CO_API}/likernft/book/user/profile`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    bookUser.value = data
    return bookUser.value
  }

  async function lazyFetchBookUserProfile () {
    if (bookUser.value) {
      return bookUser.value
    }
    try {
      const user = await fetchBookUserProfile()
      return user
    } catch (e: unknown) {
      if ((e as Error).message !== 'USER_NOT_FOUND') {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    }
  }

  async function updateBookUserProfile (payload: any) {
    try {
      isUpdatingBookUserProfile.value = true
      await $fetch(`${LIKE_CO_API}/likernft/book/user/profile`, {
        method: 'POST',
        body: payload,
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
      bookUser.value = { ...bookUser.value, ...payload }
      return bookUser.value
    } finally {
      isUpdatingBookUserProfile.value = false
    }
  }

  async function fetchUserLikerInfo ({ nocache = false } = {}) {
    if (!isAuthenticated.value) {
      return null
    }
    try {
      isFetchingUserLikerInfo.value = true
      const likerInfo = await likerStore.fetchLikerInfoByWallet(wallet.value, { nocache })
      return likerInfo
    } finally {
      isFetchingUserLikerInfo.value = false
    }
  }

  async function lazyFetchUserLikerInfo () {
    if (!isAuthenticated.value) {
      return null
    }
    if (userLikerInfo.value) {
      return userLikerInfo.value
    }
    const likerInfo = await fetchUserLikerInfo()
    return likerInfo
  }

  watch(isAuthenticated, () => {
    if (isAuthenticated.value) {
      lazyFetchUserLikerInfo()
      lazyFetchBookUserProfile()
    } else {
      bookUser.value = null
    }
  })

  return {
    bookUser,
    isUpdatingBookUserProfile,
    userLikerInfo,
    isFetchingUserLikerInfo,
    fetchBookUserProfile,
    lazyFetchBookUserProfile,
    updateBookUserProfile,
    fetchUserLikerInfo,
    lazyFetchUserLikerInfo
  }
})
